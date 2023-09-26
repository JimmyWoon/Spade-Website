import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, switchMap } from 'rxjs';
import { initializeApp } from "firebase/app";
import { environment } from 'src/environment/environment';
import { getStorage } from "firebase/storage";

@Injectable({
    providedIn: 'root',
})
export class FileUploadService {
    // fireauth = environment.firebase
    constructor(private storage: AngularFireStorage) {

    }

    uploadFile(file: File, filePath: string): Observable<string | undefined> {
        // const app = initializeApp(this.fireauth);
        // const storage = getStorage(app);
        const storageRef = this.storage.ref(filePath);
        const task = storageRef.put(file);

        return task.snapshotChanges().pipe(
            // Get the download URL once the upload is complete
            switchMap(() => storageRef.getDownloadURL())
        );
    }
}
