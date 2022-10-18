import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class MerchantService {
  constructor(private http: HttpService) { }

  getAllPagination(pageNum: number, pageSize: number) {
    return this.http.getRaw(environment.endpoints.api + 'merchantreferral/' + pageSize + '/' + pageNum);
  }

  getMerchant(id) {
    return this.http.getRaw(environment.endpoints.api + 'merchantreferral/' + id);
  }

  update(id, data) {
    return this.http.putRaw(environment.endpoints.api + 'merchantreferral/' + id, data);
  }
  createMerchantReferral(data: any) {
    const url = environment.endpoints.api + 'merchantreferral';
    return this.http.postRaw(url, data);
  }

  getMerchantsByAddress(address: string) {
    return this.http.getRaw(environment.endpoints.api + 'merchantreferral/owner/' + address + '/10/0');
  }

  getMerchantCredits(pageSize: number, pageNum: number) {
    return this.http.getRaw(environment.endpoints.api + 'merchantcredit/' + pageSize + '/' + pageNum);
  }

  getMerchantCreditsByID(id: string) {
    return this.http.getRaw(environment.endpoints.api + 'merchantcredit/' + id);
  }

  getMerchantCreditChargersByID(id: string) {
    return this.http.getRaw(environment.endpoints.api + 'merchantcreditcharger/' + id);
  }
}