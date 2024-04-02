import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize, firstValueFrom, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FileUploadService {
    // fireauth = environment.firebase
    constructor(private storage: AngularFireStorage,private firestore: AngularFirestore) {

    }

    uploadFile(file: File, filePath: string): Observable<string | undefined> {
        const storageRef = this.storage.ref(filePath);
        const task = storageRef.put(file);

        return task.snapshotChanges().pipe(
            // Get the download URL once the upload is complete
            switchMap(() => storageRef.getDownloadURL())
        );
    }

    ClearPreviousImageReference(materialId:string){
      const newData = {
        replaced: true,
        // Other fields if needed
      };

      const thumbnailsCollection = this.firestore.collection("teaching-material").doc(materialId).collection("thumbnails");

      thumbnailsCollection
      .get()
      .toPromise()
      .then((querySnapshot:any) => {
        // Iterate over the documents in the "thumbnails" subcollection
        querySnapshot.forEach((doc:any) => {
          // Use set with merge option to update each document
          thumbnailsCollection.doc(doc.id).set(newData, { merge: true })
            .then(() => {
              // console.log(`Document ${doc.id} successfully updated!`);
            })
            .catch((error) => {
              // console.error(`Error updating document ${doc.id}: `, error);
            });
        });
      })
      .catch((error:any) => {
        console.error('Error getting documents: ', error);
      });
    }

    uploadImage(file: File,materialId : string): Promise<string> {   
      const storageRef = this.storage.ref(`thumbnail/${materialId}/${file.name}`);        
      return storageRef.put(file).then((snapshot) => {
          return snapshot.ref.getDownloadURL().then((downloadUrl) => {
              // Additional details you may want to store in Firestore
              const imageInfo = {
                name: file.name,
                size: file.size,
                downloadUrl: downloadUrl,
                // Add more details as needed
              };
      
              // Store image information in Firestore
              return this.firestore
                .collection('teaching-material')
                .doc(materialId)
                .collection('thumbnails')
                .add(imageInfo);
          });        
      });

    }
}
