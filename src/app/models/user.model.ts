import { Timestamp } from '@firebase/firestore-types';


export interface IUser {
    id: string;
    username: string;
    email: string;
    role: string;
    date_added: Timestamp;
    date_updated: Timestamp | null;
    date_deleted: Timestamp | null;
    password: String | null;
    verified:boolean ;
    profile_picture:string | null;
    profile_name: string | null;
    profile_filetype:string| null;
    uid:string|null;
  }
  