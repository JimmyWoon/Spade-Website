import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private storage: AngularFireStorage) {}

  downloadFileFromStorage(filePath: string): Promise<string> {
    const ref = this.storage.ref(filePath);
    return ref.getDownloadURL().toPromise();
  }
}
