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
                var thumbnails: string[] = [];

                const data = a.payload.doc.data() as any; // Adjust the type as per your data structure
                const id = a.payload.doc.id;

                // Fetch the username from the user collection based on 'userid' field
                const userId = data.user_id;
                const username$ = this.getUserUsername(userId);

                // Get a reference to the 'thumbnail' subcollection
                const thumbnailCollectionRef = this.firestore.collection('teaching-material').doc(id).collection("thumbnails");
                thumbnailCollectionRef.get().toPromise().then(querySnapshot => {
                  if (querySnapshot) {

                    // Check if the subcollection has any documents
                    if (!querySnapshot.empty) {
                      querySnapshot.forEach(doc => {
                        const thumbnailData = doc.data();
                        // Assuming there's a property named 'downloadURL' that contains the URL
                        const downloadURL = thumbnailData['downloadUrl'];
                
                        // Add the downloadURL to the thumbnails array
                        if (!thumbnailData['replaced']) {
                          thumbnails.push(downloadURL);
                        }                      
                      });
                
                    } else {
                    }
                  } else {
                    console.log('Error: querySnapshot is undefined');
                  }
                }).catch(error => {
                  console.error('Error getting subcollection documents:', error);
                });

                
                return combineLatest([username$]).pipe(
                  map(([username]) => {
                    return { id, username, exposure:data.exposure ,fullPath:data.fullPath, date_added:data.date_updated,  material_description:data.material_description, material_file_name:data.material_filename, material_subject:data.material_subject,material_title:data.material_title, thumbnail:thumbnails} as IMaterial;
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
        switchMap((actions) => 
          combineLatest(

            actions.map((a) => {
              var thumbnails: string[] = [];

              const data = a.payload.doc.data() as any; // Adjust the type as per your data structure
              const id = a.payload.doc.id;

              // Fetch the username from the user collection based on 'userid' field
              const userId = data.user_id;
              const username$ = this.getUserUsername(userId);

              // Get a reference to the 'thumbnail' subcollection
              const thumbnailCollectionRef = this.firestore.collection('teaching-material').doc(id).collection("thumbnails");
              thumbnailCollectionRef.get().toPromise().then(querySnapshot => {
                if (querySnapshot) {

                  // Check if the subcollection has any documents
                  if (!querySnapshot.empty) {
                    querySnapshot.forEach(doc => {
                      const thumbnailData = doc.data();
                      // Assuming there's a property named 'downloadURL' that contains the URL
                      const downloadURL = thumbnailData['downloadUrl'];
              
                      // Add the downloadURL to the thumbnails array
                      if (!thumbnailData['replaced']) {
                        thumbnails.push(downloadURL);
                      }                    
                    });
              
                  } else {
                  }
                } else {
                  console.log('Error: querySnapshot is undefined');
                }
              }).catch(error => {
                console.error('Error getting subcollection documents:', error);
              });

              
              return combineLatest([username$]).pipe(
                map(([username]) => {
                  return { id, username, exposure:data.exposure ,fullPath:data.fullPath, date_added:data.date_updated,  material_description:data.material_description, material_file_name:data.material_filename, material_subject:data.material_subject,material_title:data.material_title, thumbnail:thumbnails} as IMaterial;
                })
              );
            })
          )
        )
      );
    }
}
  