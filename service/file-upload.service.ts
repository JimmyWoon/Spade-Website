import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, switchMap } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class FileUploadService {
    // fireauth = environment.firebase
    constructor(private storage: AngularFireStorage) {

    }

    uploadFile(file: File, filePath: string): Observable<string | undefined> {
        const storageRef = this.storage.ref(filePath);
        const task = storageRef.put(file);

        return task.snapshotChanges().pipe(
            // Get the download URL once the upload is complete
            switchMap(() => storageRef.getDownloadURL())
        );
    }
}
