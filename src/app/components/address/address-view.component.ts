import { Component, Input } from '@angular/core';
import { AddressGeo } from '../../models/address-geo';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-address-view',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './address-view.component.html',
  styleUrls: ['./address-view.component.css']
})
export class AddressViewComponent {
  @Input() address?: AddressGeo;
}
