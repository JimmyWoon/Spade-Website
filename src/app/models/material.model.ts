import { Timestamp } from '@firebase/firestore-types';


export interface IMaterial {
    id: string | null ;
    username: string | null ;
    date_added: Timestamp | null ;
    date_updated: Timestamp | null ;
    date_deleted: Timestamp | null ;
    material_description: string | null ;
    material_file_name: string | null ;
    material_subject: string | null ;
    material_title: string | null ;
    fullPath : string ;
    exposure: boolean | null ;
    thumbnail: string[] ;
  }
  