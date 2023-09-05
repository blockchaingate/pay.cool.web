import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class StoreService {
  constructor(private http: HttpService) { }

  getAll() {
    return this.http.get('stores');
  }

  getAllPagination(pageNum: number, pageSize: number) {
    return this.http.get('stores/' + pageNum + '/' + pageSize);
  }

  getStoresByAddress(address: string) {
    return this.http.get('stores/ownedBy/' + address);
  }

  deleteStore(data: any) {
    return this.http.post('stores/Delete', data, false);
  }

  getStores() {
    return this.http.get('stores');
  }

  getStore(id: string) {
    const url = 'stores/' + id;
    return this.http.get(url, false);
  }

  getStoreByFeeCharger(address: string) {
    const url = 'stores/feeChargerSmartContractAddress/' + address;
    return this.http.get(url, false);
  }
  
  create(data:any) {
    return this.http.post('stores/Create', data, false);
  }

  update(id: string, data: any) {
    return this.http.post('stores/Update/' + id, data, false);
  }

  updateAdmin(id: string, data: any) {
    return this.http.post('stores/Update/Admin/' + id, data, false);
  }
}