import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor(private http: HttpClient) {}

  sendEmail(emailData: any) {
    // Replace 'api/send-email' with the actual API endpoint on your server
    return this.http.post('api/send-email', emailData);
  }
}
