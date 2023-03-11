import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadComponent } from './download.component';
import { DownloadRoutingModule } from './download.routing.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    DownloadRoutingModule,   
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule
  ],
  declarations: [DownloadComponent]
})
export class DownloadModule { }
