import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from '../../shared/shared.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminComponent } from './admin.component';
import { NavComponent } from './nav/nav.component';
import { MainDivComponent } from './main-div/main-div.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
    declarations: [
        AdminComponent,
        NavComponent,
        MainDivComponent,
        SettingsComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        AdminRoutingModule,
        TranslateModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatFormFieldModule,
        MatGridListModule,
        MatMenuModule,
        MatDividerModule,
        MatInputModule,
        MatCardModule,
        MatTableModule,
        MatCheckboxModule,
        MatTooltipModule,
        FormsModule, ReactiveFormsModule
    ]
})

export class AdminModule { }