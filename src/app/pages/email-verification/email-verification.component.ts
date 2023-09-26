import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent {
  msg: String = '';

  formGroup: FormGroup = new FormGroup({
    email: new FormControl('dsad', [Validators.email]),
    otp: new FormControl("")
  })
  constructor(private firestore:AngularFirestore){
  }

  //  nodemailer = require('nodemailer');

  // requestOTP(){
  //   if (this.formGroup.get('email') === null) {
  //     this.msg = "Please enter email";
  //   }else{
  //     // Configure the SMTP transporter
  //     const transporter = this.nodemailer.createTransport({
  //       host: "smtp.gmail.com",
  //       service: 'gmail',
  //       port : '587',
  //       auth: {
  //         user: 'jobsearchsystem666@gmail.com',
  //         pass: 'ccwehgpprkhevtek'
  //       }
  //     });

  //     const userInputValue= this.formGroup.get('email')?.value;

  //     // Define the email options
  //     const mailOptions = {
  //       from: 'jobsearchsystem666@gmail.com',
  //       to: 'recipient@example.com',
  //       subject: 'Test Email',
  //       text: 'This is a test email from Node.js and Nodemailer.'
  //     };

  //     // // Send the email
  //     // transporter.sendMail(mailOptions, (error, info) => {
  //     //   if (error) {
  //     //     console.error('Error sending email:', error);
  //     //   } else {
  //     //     console.log('Email sent:', info.response);
  //     //   }
  //     // });
  //     }
  //   }
    
  submit(){}
}
