import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class MerchantService {
  constructor(private http: HttpService) { }

  getAllPagination(pageSize: number, pageNum: number) {
    return this.http.getRaw(environment.endpoints.api + 'merchantreferral/' + pageSize + '/' + pageNum);
  }

  getAllNodes(pageSize: number, pageNum: number) {
    return this.http.getRaw(environment.endpoints.api + 'merchantnode/' + pageSize + '/' + pageNum);
  }

  getAllNodeUsers(pageSize: number, pageNum: number) {
    return this.http.getRaw(environment.endpoints.api + 'merchantnodeuser/' + pageSize + '/' + pageNum);
  }

  getMerchant(id) {
    return this.http.getRaw(environment.endpoints.api + 'merchantreferral/' + id);
  }

  delete(data) {
    return this.http.postRaw(environment.endpoints.api + 'merchantreferral/delete', data);
  }

  modifyReferral(data) {
    return this.http.postRaw(environment.endpoints.api + 'merchantreferral/modifyReferral', data);
  }

  modifyRewardStrategy(data) {
    return this.http.postRaw(environment.endpoints.api + 'merchantreferral/admin/modifyRewardStrategy', data);
  }

  update(id, data) {
    return this.http.putRaw(environment.endpoints.api + 'merchantreferral/' + id, data);
  }
  
  generateApiCredential(data) {
    return this.http.postRaw(environment.endpoints.api + 'merchantapp', data);
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