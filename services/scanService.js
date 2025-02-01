import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

class ScanService {
  async saveScan(carData, imageUri) {
    try {
      const user = auth().currentUser;
      if (!user) {
        throw new Error('User must be logged in to save scans');
      }

      // First upload the image to Firebase Storage
      const imageRef = storage().ref(`scans/${user.uid}/${Date.now()}.jpg`);
      await imageRef.putFile(imageUri);
      const imageUrl = await imageRef.getDownloadURL();

      // Save scan data to Firestore
      const scanRef = await firestore().collection('scans').add({
        userId: user.uid,
        userEmail: user.email || null,
        userName: user.displayName || null,
        carData,
        imageUrl,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      console.log('Scan saved successfully:', scanRef.id);
      return scanRef.id;  // Return the document ID
    } catch (error) {
      console.error('Error saving scan:', error);
      throw error;
    }
  }

  // Get all scans for current user
  async getUserScans() {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('User must be logged in to get scans');
    }

    const scansSnapshot = await firestore()
      .collection('scans')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    return scansSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
}

export default new ScanService(); 