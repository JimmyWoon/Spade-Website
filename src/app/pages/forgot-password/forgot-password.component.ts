import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

// function generateOTP(length: number): string {
//   const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // Includes numbers, capital letters, and small alphabet letters
//   let otp = '';
  
//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * charset.length);
//     otp += charset[randomIndex];
//   }
//   return otp;
// }

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  formGroup: FormGroup = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    otp: new FormControl("",Validators.required)

  })
  msg:string = '';
  email:string|null = null;
  static otp:string = '';

  constructor(private cookieService: CookieService,private http: HttpClient,private fireAuth: AngularFireAuth,private firestore: AngularFirestore){
  }
  // submit(){
  //   const emailControl = this.formGroup.get('email');

  //   if (emailControl?.value !== undefined && this.formGroup.valid){
  //     if(otpControl.value === ForgotPasswordComponent.otp){
  //       var email = {email:emailControl.value};
  //       sessionStorage.setItem('email', JSON.stringify(email));
  //       window.location.href='/reset-password';  
        
  //     }else{
  //       this.msg='Wrong OTP entered';
  //       otpControl.setValue('');
  //     }

  //   }else{
  //     this.msg='Please enter requried information.'
  //   }
  // }

  async requestOTP(){
    const emailControl = this.formGroup.get('email');
    if (emailControl?.value === '' || !emailControl?.valid) {
      this.msg = "Please enter email";
    }else{
      this.fireAuth.sendPasswordResetEmail(emailControl.value)
      .then(() => {
        this.msg = 'Password reset email sent successfully!';
        this.cookieService.set('reset-email', emailControl?.value, 0.5);  
      })
      .catch((error) => {
        this.msg =  error.message;
      });


      // const url = "http://localhost:5001/spade-3cac3/us-central1/mailer";
      // ForgotPasswordComponent.otp = generateOTP(6);

      // try{
      //   const response = await this.http.post(url,{
      //     to:this.formGroup.get('email')?.value,
      //     subject:"Colus User Email Verification",
      //     message:"Dear Valued Customer, Below is the verification code "+ ForgotPasswordComponent.otp + " Please do not hesitate to connect with our friendly support staff via admin@cloudbasha.com should you have any queries or require further assistance. Thank you. Kind Regards, Colus Sdn. Bhd."
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
}
