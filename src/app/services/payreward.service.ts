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
        getMisses(pageSize: number, pageNum: number) {
            return this.http.getRaw(environment.endpoints.api + 'payrewarddiff/miss/' + pageSize + '/' + pageNum);
        }

        getExcesses(pageSize: number, pageNum: number) {
            return this.http.getRaw(environment.endpoints.api + 'payrewarddiff/excess/' + pageSize + '/' + pageNum);
        }
}