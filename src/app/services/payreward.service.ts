import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class PayRewardService {
    constructor(
        private http: HttpService) { }
        getAllRewardsByTxid(txid: string) {
            return this.http.getRaw(environment.endpoints.api + 'payreward/txid/' + txid);
        }   
        
}