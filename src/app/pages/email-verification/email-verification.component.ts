import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "service/authentication.service"; 


function generateOTP(length: number): string {
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // Includes numbers, capital letters, and small alphabet letters
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    otp += charset[randomIndex];
  }
  return otp;
}

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent {
  msg: String = '';
  static otp:string = '';
  formGroup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email,Validators.required]),
    otp: new FormControl("",Validators.required)
  })
  loading = false;

  constructor(private authService: AuthService, private http: HttpClient,private fireAuth: AngularFireAuth,private firestore: AngularFirestore){
  }

  async requestOTP(){
    const emailControl = this.formGroup.get('email');
    if (emailControl?.value === '' || !emailControl?.valid) {
      this.msg = "Please enter email";
    }else{
      console.log("enterd");
      this.authService.sendVerificationEmail(emailControl.value).then(() => {
        console.log("yes");

      }).catch((error) =>{
        console.log(error.message);
      });
      // const url ="http://localhost:5001/colus-website/us-central1/mailer";

      // EmailVerificationComponent.otp = generateOTP(6);

      // try{
      //   const response = await this.http.post(url,{
      //     to:this.formGroup.get('email')?.value,
      //     subject:"Colus User Email Verification",
      //     message:"Dear Valued Customer, Below is the verification code "+ EmailVerificationComponent.otp + " Please do not hesitate to connect with our friendly support staff via admin@cloudbasha.com should you have any queries or require further assistance. Thank you. Kind Regards, Colus Sdn. Bhd."
      //   }).subscribe({
      //     next: (response: any) => {
      //       console.log('Response:', response);
      //       // Process the response here
      //     },
      //     error: (error: any) => {
      //       console.error('Error occurred:', error);
      //       // Handle the error here
      //     },
      //     complete: () => {
      //     }
      //   });
      //   this.msg='OTP sent.'
      // }catch(error){
      //   console.error('Error occurred:', error);

      // }

    }
  }
    
  submit(){
    const emailControl = this.formGroup.get('email');
    const otpControl = this.formGroup.get('otp');

    if (emailControl?.value !== undefined && emailControl?.valid && otpControl?.value !== undefined){
      if(otpControl.value === EmailVerificationComponent.otp){

        this.fireAuth.signInWithEmailAndPassword(
          "jimmyechunwoon@gmail.com",
          "123456"
        ).then( () => {
          
          this.firestore.collection('user', ref => 
            ref.where('email', '==', emailControl.value)
              .where('date_deleted', '==', null)
              .limit(1) // Limit to 1 document, assuming there should be at most one matching document
          ).get().subscribe(querySnapshot => {
            if (!querySnapshot.empty) {
              this.msg=' This email is already registered.'
              emailControl.setValue('');
              otpControl.setValue('');
            } else {
              var email = {email:emailControl.value};
              sessionStorage.setItem('email', JSON.stringify(email));
              window.location.href='/signup';
            }
          })
        });
        
        

      }else{
        this.msg='Wrong OTP entered';
        otpControl.setValue('');
      }

    }else{
      this.msg='Please enter requried information.'
    }
  }
}
