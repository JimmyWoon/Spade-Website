import { Timestamp } from '@firebase/firestore-types';


export interface IMaterial {
    id: string | null;
    user_id: string | null;
    date_added: Timestamp | null;
    date_updated: Timestamp | null;
    date_deleted: Timestamp | null;
    material_description: String | null;
    material_file_name: String | null;
    material_subject: String;
    material_title: String;
  }
  