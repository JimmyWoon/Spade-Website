import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  formGroup: FormGroup = new FormGroup({
    name: new FormControl('dasdasd'),
    email: new FormControl('', [Validators.email]),
    password: new FormControl(""),
    password_confirmation: new FormControl(""),
    checkbox: new FormControl(false)
  })
  spade: AngularFirestoreDocument<any> | undefined;
  c: string  = "sabi";

  constructor(private firestore: AngularFirestore) {
    this.formGroup.valueChanges.subscribe((changes) => {
      // console.log(changes)
    })
  }

  //.add({
  //   name: "jimmy",
  //   type: "school"
  // })

  submit() {
    console.log(this.formGroup.getRawValue())
  // on loding
    // db: AngularFireStore
    let d = this.firestore.collection('spade')
      .doc('ZQZEZNlEWX9cGm6oSGaW')
      .get()
      .subscribe({
        next: (data) => {
          // off loading
          console.log("next", data.data());
        },
        error: (error) => console.error("error", error),
        complete: () => {console.log("complete");
      setTimeout(() =>{d.unsubscribe()},3000)}
      }
      );

    this.firestore.collection("spade").add({
      name: "jimmy",
      type: "school"
    })

    // this.firestore.collection('spade').get().subscribe
    //   ({
    //     next: (data) => { console.log("next", data.size);

    //    },
    //     error: (error) => console.error("error", error),
    //     complete: () => console.log("complete")
    //   });

    // let data = this.spade.ref.id
    // console.log(data)

    // this.spade.ref().get().subscribe((data)=> {
    //   console.log(data)
    // })




  }


}
