import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AddressGeo } from '../models/address-geo';

@Injectable({
  providedIn: 'root'
})
export class AddressGeoService {
  private apiUrl = environment.endpoints.api;

  constructor(private http: HttpService) {}

  getAddress(id: string): Observable<AddressGeo> {
    return this.http.get(`${this.apiUrl}address/${id}`) as Observable<AddressGeo>;
  }

  updateAddress(id: string, address: AddressGeo): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, address);
  }

  createAddress(address: AddressGeo): Observable<any> {
    return this.http.post(this.apiUrl, address);
  }
}
