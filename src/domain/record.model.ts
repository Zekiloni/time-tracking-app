import type {Timestamp} from "firebase/firestore";


export interface RecordFirestoreRaw {
    userId: string;
    startTime: Timestamp;
    project: string;
    endTime: Timestamp;
    duration: number;
    tags: string[];
    description?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface RecordModel {
    id?: string;
    userId: string;
    startTime: Date;
    project: string;
    endTime: Date;
    duration: number;
    tags: string[];
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}