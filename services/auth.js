import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Alert } from 'react-native';

// Initialize Google Sign In
GoogleSignin.configure({
  webClientId: '173196811341-5b5vchou8ihpcrl4ggbi2h3eketeld3g.apps.googleusercontent.com',
  offlineAccess: false,
  hostedDomain: '',
  forceCodeForRefreshToken: false,
});

class AuthService {
  // Email/Password Sign In
  async signInWithEmail(email, password) {
    try {
      const result = await auth().signInWithEmailAndPassword(email, password);
      return result.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Email/Password Sign Up
  async signUpWithEmail(email, password) {
    try {
      const result = await auth().createUserWithEmailAndPassword(email, password);
      return result.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Google Sign In
  async signInWithGoogle() {
    try {
      // Make sure user is signed out first
      await GoogleSignin.signOut();

      // Check Play Services
      await GoogleSignin.hasPlayServices();
      
      // Get user info and tokens
      const response = await GoogleSignin.signIn();
      console.log('Response:', response);
      
      // Extract idToken from the nested data structure
      const idToken = response?.data?.idToken;
      console.log('ID Token:', idToken);
      
      if (!idToken) {
        throw new Error('Failed to get ID token');
      }

      // Create Firebase credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
      // Sign in to Firebase
      const result = await auth().signInWithCredential(googleCredential);
      return result.user;
    } catch (error) {
      console.error('Google Sign In Error:', {
        code: error.code,
        message: error.message,
        fullError: error
      });
      throw this.handleError(error);
    }
  }

  // Apple Sign In
  async signInWithApple() {
    try {
      console.log('1. Starting Apple Sign In...');
      
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      
      console.log('2. Got Apple credential:', credential ? 'Yes' : 'No');
      console.log('3. Identity Token:', credential.identityToken ? 'Yes' : 'No');

      // Create a Firebase credential
      const appleCredential = auth.AppleAuthProvider.credential(credential.identityToken);
      console.log('4. Created Firebase credential');

      // Sign in with Firebase
      console.log('5. Attempting Firebase sign in...');
      const userCredential = await auth().signInWithCredential(appleCredential);
      console.log('6. Firebase sign in successful:', userCredential.user.email);

      // If we have a name from Apple, update the Firebase profile
      if (credential.fullName) {
        console.log('7. Updating user profile with name...');
        await userCredential.user.updateProfile({
          displayName: `${credential.fullName.givenName} ${credential.fullName.familyName}`
        });
      }

      // Show success message
      Alert.alert('Success', 'You have successfully signed in with Apple!');
      return userCredential.user;
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        Alert.alert('Sign In Cancelled', 'You cancelled the sign in process');
        throw new Error('Sign in was cancelled');
      }
      console.error('Apple Sign In Error:', {
        code: error.code,
        message: error.message,
        fullError: error
      });
      Alert.alert('Error', error.message || 'An error occurred during sign in');
      throw this.handleError(error);
    }
  }

  // Sign Out
  async signOut() {
    try {
      await GoogleSignin.signOut(); // Sign out from Google
      await auth().signOut(); // Sign out from Firebase
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error Handler
  handleError(error) {
    let message = 'An error occurred';
    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
        message = 'User not found';
        break;
      case 'auth/wrong-password':
        message = 'Invalid password';
        break;
      case 'auth/email-already-in-use':
        message = 'Email already in use';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak';
        break;
      case 'auth/invalid-credential':
        message = 'Invalid authentication credential';
        break;
      case 'auth/operation-not-allowed':
        message = 'This authentication method is not enabled';
        break;
      case 'auth/user-disabled':
        message = 'This user account has been disabled';
        break;
      case 'auth/user-not-found':
        message = 'No user found for this credential';
        break;
      default:
        message = error.message;
    }
    return new Error(message);
  }

  async sendPasswordResetEmail(email) {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          throw new Error('Invalid email address');
        case 'auth/user-not-found':
          throw new Error('No account exists with this email');
        default:
          throw new Error('Failed to send reset email. Please try again.');
      }
    }
  }
}

export default new AuthService(); 