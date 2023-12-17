// user.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: AngularFirestore) {}

  checkUserCredentials(email: string, password: string) {
    
    return this.firestore
      .collection('user').ref
      .where('email', '==', email).where('password', '==', password).where("date_deleted","==", null)
      .get()
      .then((querySnapshot) =>{
        if (!querySnapshot.empty){
            const userData:any = [];
            
            querySnapshot.forEach((doc)=>{
   
              userData.push({ id: doc.id, data: doc.data() });
            })
            return userData;
        }else{
          return "No user found";
        }
      })
      .catch((error) =>{
        return "No user found";
      })

  }
}
