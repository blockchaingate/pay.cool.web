import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MultisigRoutingModule } from './multisig-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MultisigComponent } from './multisig.component';
import { CreateComponent } from './create/create.component';
import { ImportComponent } from './import/import.component';
import { NetworkSelectComponent } from './network-select/network-select.component';
import { OwnersComponent } from './owners/owners.component';
import { FeeComponent } from './fee/fee.component';


@NgModule({
  declarations: [
    MultisigComponent,
    CreateComponent,
    ImportComponent,
    NetworkSelectComponent,
    OwnersComponent,
    FeeComponent
  ],
  
  imports: [
    CommonModule,
    FormsModule,
    MultisigRoutingModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot()
  ]
})
export class MultisigModule { }
