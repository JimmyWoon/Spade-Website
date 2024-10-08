// firestore.service.ts
import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map, switchMap } from 'rxjs';
import { IUser } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class PagingService {
  constructor(private firestore: AngularFirestore) {}

  getDataWithPagination(
    collection: string,
    pageSize: number,
    pageNumber: number,
    id : String
  ): Observable<IUser[]> {
    var startIndex = (pageNumber - 1) * pageSize;
    

    return this.firestore
      .collection(collection, (ref) =>
        ref
          .where('date_deleted', '==', null)
          .orderBy('date_added')
          // .limit(pageSize)
      )
      .snapshotChanges() 
      .pipe(
        map((actions) =>
          actions
            .filter((a)=> a.payload.doc.id !== id)
            .map((a, i) =>  {
              const data:IUser = a.payload.doc.data() as IUser;
              const id = a.payload.doc.id;
              const username = data.username;
              const role = data.role;
              const date_added = data.date_added;
              const email = data.email;
              const verified = data.verified;
              const first_name = data.first_name;
              const last_name = data.last_name;
              const dob =data.dob;
              const country = data.country;
              const state = data.state;
              // if(){
              //   return null
              // }
              return { id, username,role,date_added,email,verified, first_name,last_name,country,state,dob }as IUser;
            })
        )
      );
  }

  getTotalDocumentCount(collection: string): Observable<number> {
    return this.firestore
      .collection(collection, (ref) =>
        ref.where('date_deleted', '==', null)
      )
      .get()
      .pipe(
        map((querySnapshot) => querySnapshot.size)
      );
  }
  
  filterDocumentsWithId(collection: string, id: string): Observable<number> {
    return this.getTotalDocumentCount(collection).pipe(
      switchMap((totalCount) => {
        return this.firestore
          .collection(collection, (ref) =>
            ref.where('date_deleted', '==', null)
          )
          .valueChanges({ idField: 'id' }) // Include document IDs
          .pipe(
            map((documents: any[]) => {
              const filteredDocuments = documents.filter(
                (document) => document.id !== id
              );
              return filteredDocuments.length;
            })
          );
      })
    );
  }
}
