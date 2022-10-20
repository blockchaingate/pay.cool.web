import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class ChargeService {
    constructor(
      private http: HttpClient) { }
    getChargesByUser(user: string) {
        const url = environment.endpoints.api + 'charge/user/' + user + '/100/0';
        return this.http.get(url);
    }

    getChargesByMerchant(walletAddress: string) {
        const url = environment.endpoints.api + 'charge/merchant/' + walletAddress + '/100/0';
        console.log('url--==', url);
        return this.http.get(url);
    }
    
    requestRefund(id: string, data) {
        const url = environment.endpoints.api + 'charge/requestRefund/' + id;
        return this.http.post(url, data);
    }

    cancelRequestRefund(id: string) {
        const url = environment.endpoints.api + 'charge/cancelRequestRefund/' + id;
        return this.http.delete(url);
    }
}
   