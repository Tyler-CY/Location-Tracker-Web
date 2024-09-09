import { collection, doc, DocumentData, DocumentSnapshot, getDoc, getDocs, QuerySnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";


export const getTimestampByDateOld = async (uid: string, date: string): Promise<QuerySnapshot<DocumentData, DocumentData> | undefined>=> {
    try {
        const querySnapshot = await getDocs(collection(db, "users", uid, date));
        console.log(querySnapshot)
        console.log(querySnapshot.size)
        return querySnapshot;
    } catch (error: any) {
        console.error('Unexpected error occurred:', error.message);
        return undefined;
    }
};

export const getTimestampByDate = async (uid: string, date: string): Promise<QuerySnapshot<DocumentData, DocumentData> | undefined>=> {
    try {
        const collectionRef = collection(db, "snapshots", uid, "personal", date, "timestamps");

        const querySnapshot = await getDocs(collectionRef);

        console.log(querySnapshot)
        console.log(querySnapshot.size)
        return querySnapshot;
    } catch (error: any) {
        console.error('Unexpected error occurred:', error.message);
        return undefined;
    }
};


export const getSharePermission = async (fromUser: string, toUser: string): Promise<DocumentSnapshot<DocumentData, DocumentData> | undefined> => {
    try {
        const querySnapshot = await getDoc(doc(db, "permissions", fromUser + "_READS_" + toUser));
        console.log(querySnapshot)
        return querySnapshot;
    } catch (error: any) {
        console.error('Unexpected error occurred:', error.message);
        return undefined;
    }
}