import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IMaterial } from 'src/app/models/material.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss']
})
export class MaterialListComponent implements OnInit {
  msg:String = ''
  user_information: any = null;
  items: string[] | undefined;


  constructor(private fireAuth: AngularFireAuth,private firestore: AngularFirestore){
    if (sessionStorage.getItem('user') !== null) {
      const sessionData = JSON.parse(sessionStorage.getItem('user')!);
      this.user_information = sessionData;
    }
  }

  ngOnInit(){
    this.fireAuth.signInWithEmailAndPassword(
      this.user_information.data.email ,
      this.user_information.data.password
    ).then(() => {
      this.firestore
      .collection('teaching-material', (ref) => {
        return ref.where('date_deleted', '==', null).where('exposure', '==', true);
      })
      .get()
      .subscribe(
        (querySnapshot) => {
          const subjectsSet = new Set<string>();

          querySnapshot.forEach((doc:any) => {
            const subject = doc.data().material_subject;
            if (subject) {
              subjectsSet.add(subject);
            }
          });
          this.items = Array.from(subjectsSet);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    })
  }


  editpage(){
    window.location.href='/material-edit-list';
  }
  redirectpage(item:string){
    window.location.href = `/teaching-material?subject=${item}`;
  }
}

