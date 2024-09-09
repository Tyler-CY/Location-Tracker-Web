import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "./firebaseConfig";




export const firebaseSignIn = async (email: string, password: string): Promise<UserCredential | null>=> {
    try {
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                console.log(userCredential);
                return userCredential
            })
            .catch((error: any) => {
                console.error('Error signing in:', error.message);
                return null
            });

    } catch (error: any) {
        console.error('Error signing in:', error.message);
        return null
    }
};

export const firebaseSignUp = async (email: string, password: string): Promise<UserCredential | null>=> {
    try {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                console.log(userCredential);
                return userCredential
            })
            .catch((error: any) => {
                console.error('Error signing in:', error.message);
                return null
            });

    } catch (error: any) {
        console.error('Error signing in:', error.message);
        return null
    }
};
