import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	UserCredential,
} from 'firebase/auth';
import { auth } from './firebaseConfig';
import { FirebaseError } from 'firebase/app';

export const firebaseLogin = async (
	email: string,
	password: string
): Promise<UserCredential | null> => {
	return signInWithEmailAndPassword(auth, email, password)
		.then(userCredential => {
			// Signed in
			console.log(userCredential);
			return userCredential;
		})
		.catch((error: FirebaseError) => {
			console.error('Error signing in:', error.message);
			return null;
		});
};

export const firebaseRegister = async (
	email: string,
	password: string
): Promise<UserCredential | null> => {
	return createUserWithEmailAndPassword(auth, email, password)
		.then(userCredential => {
			// Signed in
			console.log(userCredential);
			return userCredential;
		})
		.catch((error: FirebaseError) => {
			console.error('Error signing in:', error.message);
			return null;
		});
};
