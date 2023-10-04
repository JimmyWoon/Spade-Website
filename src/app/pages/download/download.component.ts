import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, map, switchMap, of } from 'rxjs';

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

  constructor( private firestore: AngularFirestore, public storage: AngularFireStorage,private fireAuth: AngularFireAuth) {
    if (sessionStorage.getItem('user') !== null) {
      const sessionData = JSON.parse(sessionStorage.getItem('user')!);
      this.user_information = sessionData;
    }
  }

  ngOnInit(){
    this.fireAuth.signInWithEmailAndPassword(
      "jimmyechunwoon@gmail.com",
      "123456"
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
    a.download = 'your-file-name.jpg'; // Replace with the desired file name
    a.target = '_blank'; // Open in a new tab
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  downloadSpade(){
    this.fireAuth.signInWithEmailAndPassword(
      "jimmyechunwoon@gmail.com",
      "123456"
    ).then(() => {
      // const filePath = 'gs://colus-website.appspot.com/hcc5nabj2yt'+this.spadeData.fullPath; // Replace with the actual file path
      // const ref = this.storage.ref(filePath);
  
      // ref.getDownloadURL().subscribe((url) => {
      //   // Use the URL to trigger the download or display the file
      //   this.download(url);
      // });
      
      const filePath = 'http://localhost:4200/colus-website.appspot.com/hcc5nabj2yt'; // Replace with the actual file path

      // Create an anchor element to trigger the download
      const a = document.createElement('a');
      a.href = filePath;
      a.download = 'spade2.exe'; // Replace with the desired file name
      a.target = '_blank'; // Open in a new tab
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}
