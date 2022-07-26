import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';

import { MemberComponent } from './member.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { SignInComponent } from './signin/signin.component';
import { ActivationComponent } from './register/activation.component';
import { ForgotPwdComponent } from './forget-pwd/forgot-pwd.component';
import { ResetPwdComponent } from './forget-pwd/reset-pwd.component';
import { SecurityComponent } from './security/security.component';

import { MemberService } from '../../services/member.service';
import { TranslateService } from '@ngx-translate/core';

import { MemberRoutingModule } from './member-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    QRCodeModule,
    TranslateModule.forChild(),
    MemberRoutingModule
  ],
  providers: [
    MemberService, TranslateService
  ],
  declarations: [
    MemberComponent,
    ProfileComponent,
    RegisterComponent,
    SignInComponent,
    ActivationComponent,
    ForgotPwdComponent,
    ResetPwdComponent,
    SecurityComponent
  ],
  exports: [
  ]
})
export class MemberModule { }
