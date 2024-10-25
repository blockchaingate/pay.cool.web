import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class ChargeService {
    constructor(
      private http: HttpClient) { }
    getChargesByUser(user: string) {
        const url = environment.endpoints.api + 'v3/paycool/charge/user/' + user + '/100/0';
        return this.http.get(url);
    }

    getChargesByMerchant(walletAddress: string) {
        const url = environment.endpoints.api + 'v3/paycool/charge/merchant/' + walletAddress + '/100/0';
        return this.http.get(url);
    }
    
    requestRefund(id: string, data) {
        const url = environment.endpoints.api + 'v3/paycool/charge/requestRefund/' + id;
        return this.http.post(url, data);
    }

    cancelRequestRefund(id: string) {
        const url = environment.endpoints.api + 'v3/paycool/charge/cancelRequestRefund/' + id;
        return this.http.delete(url);
    }

    getRefundInfo(id: string) {
        const url = environment.endpoints.api + 'v3/paycool/charge/refundInfo/' + id;
        return this.http.get(url); 
    }
}
   