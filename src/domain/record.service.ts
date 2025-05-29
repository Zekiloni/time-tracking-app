import type {RecordFirestoreRaw, RecordModel} from "./record.model.ts";
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc
} from "firebase/firestore";
import { db } from "../core/firebase.ts";



export const createRecord = async (record: RecordModel) => {
    return addDoc(collection(db, "users", record.userId, "records"), record);
};


export const getRecordById = async (userId: string, recordId: string): Promise<RecordModel | null> => {
    const recordRef = doc(db, "users", userId, "records", recordId);
    const recordSnap = await getDoc(recordRef);

    if (recordSnap.exists()) {
        const data = recordSnap.data() as RecordFirestoreRaw;
        return {
            id: recordSnap.id,
            ...(recordSnap.data() as RecordModel),
            startTime: data.startTime.toDate(),
            endTime: data.endTime.toDate(),
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
        };
    } else {
        return null;
    }
}

export const getRecords = async (userId: string): Promise<RecordModel[]> => {
    const recordsCol = collection(db, "users", userId, "records");
    const snapshot = await getDocs(recordsCol);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as RecordModel),
        startTime: doc.data().startTime.toDate(),
        endTime: doc.data().endTime.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
    }));
};

export const updateRecord = async (
    recordId: string,
    userId: string,
    updatedData: Partial<RecordModel>
) => {
    const recordRef = doc(db, "users", userId, "records", recordId);
    return updateDoc(recordRef, updatedData);
};

export const deleteRecord = async (recordId: string, userId: string) => {
    const recordRef = doc(db, "users", userId, "records", recordId);
    return deleteDoc(recordRef);
};
