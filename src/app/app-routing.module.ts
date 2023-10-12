import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from './pages/logout/logout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from 'service/auth-service.service';
import { ManageUserComponent } from './pages/manage-user/manage-user.component';
import { TeachingMaterialComponent } from './pages/teaching-material/teaching-material.component';
import { MaterialListComponent } from './pages/material-list/material-list.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { DownloadComponent } from './pages/download/download.component';
import { DownloadEditComponent } from './pages/download-edit/download-edit.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { MaterialEditComponent } from './pages/material-edit/material-edit.component';
import { MaterialEditListComponent } from './pages/material-edit-list/material-edit-list.component';
// import { AngularFireModule } from '@angular/fire';



const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: "contact",
    component: ContactComponent
  },
  {
    path: "email-verification",
    component: EmailVerificationComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path:"logout",
    component:LogoutComponent
  },
  {
    path:"profile",
    component:ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path:"manage-user",
    component:ManageUserComponent,
    canActivate: [AuthGuard],
    data: { role: 'Admin' }
  },
  {
    path:"material-list",
    component:MaterialListComponent,
    canActivate: [AuthGuard],
  },
  {
    path:"teaching-material",
    component:TeachingMaterialComponent,
    canActivate: [AuthGuard],
  },
  {
    path:"pricing",
    component:PricingComponent,
  },
  {
    path:"download",
    component:DownloadComponent,
  },
  {
    path:"download-edit",
    component:DownloadEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path:"signup",
    component:SignupComponent,
  },
  {
    path:"forgot-password",
    component:ForgotPasswordComponent,
  },
  {
    path:"reset-password",
    component:ResetPasswordComponent
  },
  {
    path:"material-edit",
    component:MaterialEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path:"material-edit-list",
    component:MaterialEditListComponent,
    canActivate:[AuthGuard]
  }
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes),CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
