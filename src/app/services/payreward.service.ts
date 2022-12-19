import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class PayRewardService {
    constructor(
        private http: HttpService) { }

        getAllIcoRewardsById(icoid) {
            return this.http.getRaw(environment.endpoints.api + 'payreward/ipo/' + icoid + '/100/0');
        }

        getIcoRewardsByUser(user: string) {
            const url = environment.endpoints.api + 'payreward/ipos/user/' + user + '/10/0';
            return this.http.getRaw(url);
        }

        getAllRewardsByTxid(txid: string) {
            return this.http.getRaw(environment.endpoints.api + 'payreward/txid/' + txid);
        }   
        getMisses(pageSize: number, pageNum: number) {
            return this.http.getRaw(environment.endpoints.api + 'payrewarddiff/miss/' + pageSize + '/' + pageNum);
        }

        getExcesses(pageSize: number, pageNum: number) {
            return this.http.getRaw(environment.endpoints.api + 'payrewarddiff/excess/' + pageSize + '/' + pageNum);
        }

        getPayRewardParams(walletAddress: string, amount: number, currency: string) {
            return this.http.getRaw(environment.endpoints.api + 'userpay/params/amount/' + amount + '/' + walletAddress + '/' + currency);
        }

        createIpo(user: string, amount: number, liquidity: number) {
            const data = {
                user,
                amount,
                liquidity
            };
            return this.http.postRaw(environment.endpoints.api + 'ipo', data);
        }

        createIpos(ipos) {
            return this.http.postRaw(environment.endpoints.api + 'ipo/bulk', ipos);
        }

        recalculateIpoRewards() {
            return this.http.getRaw(environment.endpoints.api + 'ipo/recalculateRewards');
        }

        getIpos(pageSize, pageNum) {
            return this.http.getRaw(environment.endpoints.api + 'ipo/' + pageSize + '/' + pageNum);
        }
}

//https://fabtest.info/api/userpay/params/amount/2000/mweZqx4QFEPDHHryp4K257zRss2VY4zc9D/DUSD