// authentication.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private email: string = "";
  user$: Observable<firebase.default.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = afAuth.authState;
  }

  setEmail(email: string) {
    this.email = email;
  }

  getEmail(): string {
    return this.email;
  }

  signUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  sendVerificationEmail(email:string) {
    this.setEmail(email);
    
    return this.afAuth.sendSignInLinkToEmail(email, {
      // https://spademy.com/signup
      url: 'http://localhost:4200/signup/'+email,
      handleCodeInApp: true,
    });  
  }

  signIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signOut() {
    return this.afAuth.signOut();
  }
  
  applyActionCode(oobCode: string) {
    return this.afAuth.applyActionCode(oobCode);
  }

  sendPasswordResetEmail(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email,{
      // https://spademy.com/signup
      url: 'http://localhost:4200/signup/'+email,
      handleCodeInApp: true,
    });
  }
}
