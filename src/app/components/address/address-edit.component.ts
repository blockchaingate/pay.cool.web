import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddressGeo } from '../../models/address-geo';
import { AddressGeoService } from '../../services/address-geo.services';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-address-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './address-edit.component.html',
  styleUrls: ['./address-edit.component.css']
})
export class AddressEditComponent {
  @Input() address: AddressGeo = { street: '' };
  form: FormGroup;

  constructor(private fb: FormBuilder, private addressService: AddressGeoService) {
    this.form = this.fb.group({
      name: [''],
      suite: [''],
      streetNumber: [''],
      direction: [''],
      street: [''],
      district: [''],
      city: [''],
      provinceCode: [''],
      province: [''],
      postcode: [''],
      countryCode: [''],
      country: [''],
      continentCode: [''],
      continent: [''],
      longitude: [''],
      latitude: [''],
      hightitude: [''],
      description: ['']
    });
  }

  ngOnInit() {
    this.form.patchValue(this.address);
  }

  onSubmit() {
    const updatedAddress = this.form.value;
    if (this.address._id) {
      this.addressService.updateAddress(this.address._id, updatedAddress).subscribe();
    } else {
      this.addressService.createAddress(updatedAddress).subscribe();
    }
  }
}
