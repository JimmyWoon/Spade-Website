import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IMaterial } from 'src/app/models/material.model';

@Injectable({
    providedIn: 'root',
  })
  export class MaterialService {
    materials: IMaterial[]|undefined;
    constructor(private firestore: AngularFirestore) {}
  
    getMaterials(subject: string): Observable<IMaterial[]> {

        return this.firestore.collection('teaching-material', (ref) =>
          ref
            .where('date_deleted', '==', null)
            .where('material_subject', '==', subject)
        ).snapshotChanges().pipe(
          switchMap((actions) =>

            combineLatest(

              actions.map((a) => {

                const data = a.payload.doc.data() as any; // Adjust the type as per your data structure
                const id = a.payload.doc.id;

                // Fetch the username from the user collection based on 'userid' field
                const userId = data.user_id;
                const username$ = this.getUserUsername(userId);
                return combineLatest([username$]).pipe(
                  map(([username]) => {
                    return { id, username, fullPath:data.fullPath, date_added:data.date_updated,  material_description:data.material_description, material_file_name:data.material_filename, material_subject:data.material_subject,material_title:data.material_title} as IMaterial;
                  })
                );
              })
            )
          )
        );
      }
    
      private getUserUsername(userId: string): Observable<string> {

        return this.firestore.doc(`user/${userId}`).valueChanges().pipe(
          map((user: any) => {
            return user.username; // Adjust the property name as per your user data structure
          })
        );
      }

      getSelfMaterials(userid: string): Observable<IMaterial[]> {
        return this.firestore.collection('teaching-material', (ref) =>
          ref
            .where('date_deleted', '==', null)
            .where('user_id', '==', userid)
        ).snapshotChanges().pipe(
          switchMap((actions) => {
            const materials: IMaterial[] = actions.map((a) => {
              const data = a.payload.doc.data() as any; // Adjust the type as per your data structure
              const id = a.payload.doc.id;
              return {
                id,
                fullPath: data.fullPath,
                date_added: data.date_updated,
                material_description: data.material_description,
                material_file_name: data.material_filename,
                material_subject: data.material_subject,
                material_title: data.material_title
              } as IMaterial;
            });
            return of(materials); // Wrap the array in an observable using 'of'
          })
        );
      }
}
  