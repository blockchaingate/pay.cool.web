import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberComponent } from './member.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { SignInComponent } from './signin/signin.component';
import { ActivationComponent } from './register/activation.component';
import { ForgotPwdComponent } from './forget-pwd/forgot-pwd.component';
import { ResetPwdComponent } from './forget-pwd/reset-pwd.component';
import { SecurityComponent } from './security/security.component';

const routes: Routes = [
    {
        path: '', component: MemberComponent,
        children: [
            { path: 'profile', component: ProfileComponent },
            { path: 'signup/:refCode', component: RegisterComponent },
            { path: 'signup', component: RegisterComponent },
            { path: 'signin', component: SignInComponent },
            { path: 'login',  pathMatch: 'full', redirectTo: 'signin' },
            { path: 'activation', component: ActivationComponent },
            { path: 'forgot-pwd', component: ForgotPwdComponent },
            { path: 'reset-pwd', component: ResetPwdComponent },
            { path: 'security', component: SecurityComponent },
            { path: '', pathMatch: 'full', redirectTo: 'profile' },

        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: []
})
export class MemberRoutingModule { }
