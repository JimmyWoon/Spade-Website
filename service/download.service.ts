import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: AngularFireStorage) {}

  downloadFile(filePath: string): Observable<any> {
    const storageRef = this.storage.ref(filePath);
    return storageRef.getDownloadURL();
  }
}
