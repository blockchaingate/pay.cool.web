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

  getMerchantsByAddress(address: string) {
    return this.http.getRaw(environment.endpoints.api + 'merchantreferral/owner/' + address + '/10/0');
  }

  getMerchantCredits(pageSize: number, pageNum: number) {
    return this.http.getRaw(environment.endpoints.api + 'merchantcredit/' + pageSize + '/' + pageNum);
  }

  getMerchantCreditsByID(id: string) {
    return this.http.getRaw(environment.endpoints.api + 'merchantcredit/' + id);
  }
}