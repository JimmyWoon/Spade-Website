import { Timestamp } from '@firebase/firestore-types';


export interface IUser {
    id: string;
    username: string;
    email: string;
    role: string;
    date_added: Timestamp;
    date_updated: Timestamp | null;
    date_deleted: Timestamp | null;
    password: string | null;
    verified:boolean ;
    profile_picture:string | null;
    profile_name: string | null;
    profile_filetype:string| null;
    uid:string|null;
    first_name:string|null;
    last_name:string|null;
    dob:Timestamp|null;
    country:string|null;
    state:string|null;

  }
  