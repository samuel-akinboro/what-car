import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { nanoid } from 'nanoid';

let db;

export class StorageService {
  constructor() {
    this.initDatabase();
  }

  async initDatabase() {
    try {
      db = await SQLite.openDatabaseAsync('carscanner.db');
      
      // Create tables using execAsync with exact matching schema
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS scans (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT,
          manufacturer TEXT,
          specs TEXT,           /* JSON string containing engine, power, torque, etc. */
          productionYears TEXT,
          rarity TEXT,
          description TEXT,
          alsoKnownAs TEXT,    /* JSON string array */
          year TEXT,
          matchAccuracy TEXT,
          timestamp INTEGER NOT NULL,
          images TEXT,         /* JSON string array */
          isSaved INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS collections (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          icon TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS collection_cars (
          collection_id TEXT,
          car_id TEXT,
          timestamp INTEGER,
          PRIMARY KEY (collection_id, car_id),
          FOREIGN KEY (collection_id) REFERENCES collections(id),
          FOREIGN KEY (car_id) REFERENCES scans(id)
        );
      `);

      // Insert default Favorites collection if it doesn't exist
      await db.runAsync(
        `INSERT OR IGNORE INTO collections (id, name, icon) 
         VALUES (?, ?, ?);`,
        ['1', 'Favorites', '✨']
      );
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  async saveImage(base64Image, id) {
    try {
      const imagesDir = `${FileSystem.documentDirectory}images/`;
      const path = `${imagesDir}${id}.jpg`;
      
      await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });
      await FileSystem.writeAsStringAsync(path, base64Image, { 
        encoding: FileSystem.EncodingType.Base64 
      });
      
      return path;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  }

  async saveScan(scan) {
    try {
      await db.runAsync(
        `INSERT OR REPLACE INTO scans (
          id, name, category, manufacturer, specs,
          productionYears, rarity, description, alsoKnownAs,
          year, matchAccuracy, timestamp, images, isSaved
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          scan.id,
          scan.name,
          scan.category,
          scan.manufacturer,
          JSON.stringify(scan.specs),
          scan.productionYears,
          scan.rarity,
          scan.description,
          JSON.stringify(scan.alsoKnownAs),
          scan.year,
          scan.matchAccuracy,
          scan.timestamp,
          JSON.stringify(scan.images),
          scan.isSaved ? 1 : 0
        ]
      );
      return scan;
    } catch (error) {
      console.error('Error saving scan:', error);
      throw error;
    }
  }

  async getRecentScans(limit = 50, offset = 0) {
    try {
      const results = await db.getAllAsync(
        `SELECT * FROM scans 
         ORDER BY timestamp DESC 
         LIMIT ? OFFSET ?;`,
        [limit, offset]
      );
      
      return results.map(row => ({
        ...row,
        specs: JSON.parse(row.specs),
        alsoKnownAs: JSON.parse(row.alsoKnownAs),
        images: row.images ? JSON.parse(row.images) : [],
        isSaved: Boolean(row.isSaved)
      }));
    } catch (error) {
      console.error('Error getting recent scans:', error);
      throw error;
    }
  }

  async getSavedCollection(limit = 50, offset = 0) {
    try {
      const results = await db.getAllAsync(
        `SELECT * FROM scans 
         WHERE isSaved = 1 
         ORDER BY timestamp DESC 
         LIMIT ? OFFSET ?;`,
        [limit, offset]
      );
      
      return results.map(row => ({
        ...row,
        isSaved: Boolean(row.isSaved),
        details: JSON.parse(row.details)
      }));
    } catch (error) {
      console.error('Error getting saved collection:', error);
      throw error;
    }
  }

  async toggleSavedScan(scanId) {
    try {
      const result = await db.runAsync(
        `UPDATE scans 
         SET isSaved = CASE WHEN isSaved = 1 THEN 0 ELSE 1 END 
         WHERE id = ?;`,
        [scanId]
      );
      return result.changes > 0;
    } catch (error) {
      console.error('Error toggling saved scan:', error);
      throw error;
    }
  }

  async searchScans(query) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM scans 
           WHERE name LIKE ? OR manufacturer LIKE ? 
           ORDER BY timestamp DESC;`,
          [`%${query}%`, `%${query}%`],
          (_, { rows: { _array } }) => {
            resolve(_array.map(row => ({
              ...row,
              isSaved: Boolean(row.isSaved),
              details: JSON.parse(row.details)
            })));
          },
          (_, error) => reject(error)
        );
      });
    });
  }

  async clearAllData() {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM scans;',
          [],
          async () => {
            try {
              await FileSystem.deleteAsync(
                `${FileSystem.documentDirectory}images/`, 
                { idempotent: true }
              );
              resolve(true);
            } catch (error) {
              reject(error);
            }
          },
          (_, error) => reject(error)
        );
      });
    });
  }

  async getCollections() {
    try {
      const collections = await db.getAllAsync('SELECT * FROM collections');
      const cars = await db.getAllAsync(`
        SELECT c.*, s.* 
        FROM collection_cars c 
        JOIN scans s ON c.car_id = s.id
      `);
      
      return collections.map(collection => ({
        ...collection,
        cars: cars
          .filter(car => car.collection_id === collection.id)
          .map(car => ({
            ...car,
            specs: JSON.parse(car.specs),
            alsoKnownAs: JSON.parse(car.alsoKnownAs),
            images: car.images ? JSON.parse(car.images) : [],
          }))
      }));
    } catch (error) {
      console.error('Error getting collections:', error);
      throw error;
    }
  }

  async createCollection(name, icon) {
    try {
      const id = Date.now().toString();
      await db.runAsync(
        'INSERT INTO collections (id, name, icon) VALUES (?, ?, ?)',
        [id, name, icon]
      );
      return id;
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  }

  async addToCollection(collectionId, car) {
    try {
      await db.runAsync(
        'INSERT OR REPLACE INTO collection_cars (collection_id, car_id, timestamp) VALUES (?, ?, ?)',
        [collectionId, car.id, Date.now()]
      );
    } catch (error) {
      console.error('Error adding to collection:', error);
      throw error;
    }
  }

  async removeFromCollection(collectionId, carId) {
    try {
      await db.runAsync(
        'DELETE FROM collection_cars WHERE collection_id = ? AND car_id = ?',
        [collectionId, carId]
      );
    } catch (error) {
      console.error('Error removing from collection:', error);
      throw error;
    }
  }

  async getStats() {
    try {
      // Get total scans
      const [totalScansResult] = await db.getAllAsync(
        'SELECT COUNT(*) as total FROM scans'
      );
      
      // Get this week's scans
      const [weeklyScansResult] = await db.getAllAsync(
        `SELECT COUNT(*) as total FROM scans 
         WHERE timestamp > ?`,
        [Date.now() - 7 * 24 * 60 * 60 * 1000] // Last 7 days
      );

      // Get total saved cars (unique cars across all collections)
      const [totalSavedResult] = await db.getAllAsync(
        `SELECT COUNT(DISTINCT car_id) as total FROM collection_cars`
      );

      // Get new saves this week
      const [newSavesResult] = await db.getAllAsync(
        `SELECT COUNT(DISTINCT car_id) as total FROM collection_cars 
         WHERE timestamp > ?`,
        [Date.now() - 7 * 24 * 60 * 60 * 1000]
      );

      return {
        totalScans: totalScansResult.total,
        weeklyScans: weeklyScansResult.total,
        totalSaved: totalSavedResult.total,
        newSaves: newSavesResult.total
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  }

  async deleteCollection(collectionId) {
    try {
      // First delete all cars in the collection
      await db.runAsync(
        'DELETE FROM collection_cars WHERE collection_id = ?',
        [collectionId]
      );
      
      // Then delete the collection itself
      // Don't allow deletion of the Favorites collection (id = '1')
      if (collectionId !== '1') {
        await db.runAsync(
          'DELETE FROM collections WHERE id = ?',
          [collectionId]
        );
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw error;
    }
  }
}
