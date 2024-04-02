import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { user } from 'firebase-functions/v1/auth';
import { combineLatest, Observable, of } from 'rxjs';
import { defaultIfEmpty, map, switchMap } from 'rxjs/operators';
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
                    // console.log('Error: querySnapshot is undefined');
                  }
                }).catch(error => {
                  // console.error('Error getting subcollection documents:', error);
                });

                
                return combineLatest([username$]).pipe(
                  map(([username]) => {
                    // console.log(username);
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

    async checkRecord(userid: string, role: string): Promise<boolean> {
      // console.log(userid,role);
      try {
        const querySnapshot = await this.firestore
          .collection('teaching-material')
          .ref
          .where('date_deleted', '==', null)
          .where(
            role === 'Admin' ? 'user_id' : 'user_id', 
            role === 'Admin' ? '!=' : '==', 
            role === 'Admin' ? null : userid
          )
          .get();
    
        if (querySnapshot.empty) {
          // console.log("empty");
          return true;
        } else {
          return false;
        }
      } catch (error) {
        // console.log("error");

        // console.log(error);
        // Handle the error as needed
        return true;
      }
    }
    


    getSelfMaterials(userid: string, role:string): Observable<IMaterial[]> {
      
      
      return this.firestore.collection('teaching-material', (ref) =>
        ref
          .where('date_deleted', '==', null)
          .where(role === 'Admin' ? 'user_id' : 'user_id', role === 'Admin' ? '!=' : '==', role === 'Admin' ? null: userid)
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
                  // console.log('Error: querySnapshot is undefined');
                }
              }).catch(error => {
                // console.error('Error getting subcollection documents:', error);
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
  