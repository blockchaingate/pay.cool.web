import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MultisigRoutingModule } from './multisig-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MultisigComponent } from './multisig.component';
import { CreateComponent } from './create/create.component';
import { ImportComponent } from './import/import.component';
import { NetworkSelectComponent } from './network-select/network-select.component';
import { OwnersComponent } from './owners/owners.component';
import { FeeComponent } from './fee/fee.component';
import { CreateGoComponent } from './create-go/create-go.component';
import { CreateConfirmComponent } from './create-confirm/create-confirm.component';


@NgModule({
  declarations: [
    MultisigComponent,
    CreateComponent,
    ImportComponent,
    NetworkSelectComponent,
    OwnersComponent,
    FeeComponent,
    CreateGoComponent,
    CreateConfirmComponent
  ],
  
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MultisigRoutingModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot()
  ]
})
export class MultisigModule { }
