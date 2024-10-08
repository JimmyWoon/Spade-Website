import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  AngularFirestoreModule,
} from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from 'src/environment/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { UserService } from 'service/user';
import { HttpClientModule } from '@angular/common/http';
import { LogoutComponent } from './pages/logout/logout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ManageUserComponent } from './pages/manage-user/manage-user.component';
import { TeachingMaterialComponent } from './pages/teaching-material/teaching-material.component';
import { MaterialListComponent } from './pages/material-list/material-list.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { DownloadComponent } from './pages/download/download.component';
import { DownloadEditComponent } from './pages/download-edit/download-edit.component';
import { LoadingComponent } from './pages/loading/loading.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { MaterialEditComponent } from './pages/material-edit/material-edit.component';
import { MaterialEditListComponent } from './pages/material-edit-list/material-edit-list.component';
import { AboutComponent } from './pages/about/about.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    EmailVerificationComponent,
    LogoutComponent,
    ProfileComponent,
    ManageUserComponent,
    TeachingMaterialComponent,
    MaterialListComponent,
    PricingComponent,
    DownloadComponent,
    DownloadEditComponent,
    LoadingComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    MaterialEditComponent,
    MaterialEditListComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularFirestoreModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
    HttpClientModule,
  ],
  providers: [UserService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
