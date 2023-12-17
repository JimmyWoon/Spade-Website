import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { FileService } from 'service/download.service';


@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {
  user_information:any = null;
  downloadURL: Observable<string> | null = null;
  spadeData:any = {filename:"",fullPath:"",description: "",filetype:""};
  msg:String = "";

  constructor( private firestore: AngularFirestore, public storage: AngularFireStorage,private fireAuth: AngularFireAuth, private fileService:FileService) {
    if (sessionStorage.getItem('user') !== null) {
      const sessionData = JSON.parse(sessionStorage.getItem('user')!);
      this.user_information = sessionData;
      
    }
  }

  ngOnInit(){
    this.fireAuth.signInWithEmailAndPassword(
      'jimmyechunwoon@gmail.com' ,
      '987654'
    ).then(() => {

      this.firestore.collection('spade', ref => ref.orderBy('date_added', 'desc').limit(1))
      .valueChanges()
      .subscribe((documents: any[]) => {
        if (documents.length > 0) {
          const document = documents[0];
          this.spadeData = {fullPath:document.fullPath,filename:document.filename,description:document.description,filetype:document.filetype};
        }
      });
    })
  }

  download(url: string) {
    // Create an anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'src/assets/image/spade-bg-login.jpg'; // Replace with the desired file name
    a.target = '_blank'; // Open in a new tab
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  async downloadSpade(){
    const filePath = "spade/19g6f1hcrtu";

    this.fireAuth.signInWithEmailAndPassword(
      'jimmyechunwoon@gmail.com' ,
      '987654'
    ).then(async (userCredential) => {

      const filePath = this.spadeData.fullPath;
      console.log(filePath);
      try {
      // const fileRef = this.storage.ref().child(`sapde/${this.spadeData.id}`);

      // // Download the file as a blob
      // const fileBlob = await fileRef.getDownloadURL();

      // // Create a blob with the modified content type
      // const modifiedBlob = new Blob([fileBlob], {
      //   type: 'application/vnd.microsoft.portable-executable',
      // });

      // // Create a temporary anchor element for downloading
      // const downloadLink = document.createElement('a');
      // downloadLink.href = URL.createObjectURL(modifiedBlob);
      // downloadLink.download = 'your-app.exe';
      // downloadLink.click();


        const fileRef = this.storage.ref(filePath);

        const downloadURL = await fileRef.getDownloadURL().toPromise();

        // Create an anchor element to trigger the download
        const a = document.createElement('a');
        a.href = downloadURL;
        a.download = this.spadeData.filename; 
        // Trigger the click event to start the download
        a.click();


        // const response = await axios.get(filePath, { responseType: 'blob' });

        // const blob = new Blob([response.data]);
  
        // const a = document.createElement('a');
        // a.href = window.URL.createObjectURL(blob);
        // a.download = this.spadeData.filename;
        // a.click();


        // const fileRef = this.storage.ref(filePath);
  
        // const fileBlob = await fileRef.getDownloadURL().toPromise();

        // // Create a Blob object with the original MIME type
        // const originalMimeType = 'application/octet-stream'; // Replace with the original MIME type
        // const blob = new Blob([fileBlob], { type: originalMimeType });
        // const blobUrl = URL.createObjectURL(blob);

        // const a = document.createElement('a');
        // a.href = blobUrl;
        // a.download = this.spadeData.filename;
    
        // // Trigger the click event to start the download
        // a.click();
    
        // // Clean up the object URL to release resources
        // URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    })
    .catch((error) => {
      // Handle authentication errors
      console.error('Authentication Error: ', error);
    });
  }
  editpage(){
    window.location.href='/download-edit';
  }
}
