import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class PayRewardService {
    constructor(
        private http: HttpService) { }

        getPayRewardDiff(pageSize, pageNum) {
            return this.http.getRaw(environment.endpoints.api + 'ipo/payreward-diff/' + pageSize + '/' + pageNum);
        }

        getAllPendings() {
            return this.http.getRaw(environment.endpoints.api + 'ipo/payrewardpendings');
        }

        getPayRewardDiffByUserId(userId) {
            return this.http.getRaw(environment.endpoints.api + 'ipo/payreward-diff/user/' + userId);
        }

        getAllIcoRewardsById(icoid) {
            return this.http.getRaw(environment.endpoints.api + 'payreward/ipo/' + icoid + '/100/0');
        }

        getAllRewardsByProjectAndType(projectId: number, type: string, pageSize: number, pageNum: number) {
            const url = environment.endpoints.api + 'payreward/project/' + projectId + '/type/' + type + '/' + pageSize + '/' + pageNum;
            return this.http.getRaw(url);
        }

        getIcoRewardsByUser(user: string) {
            const url = environment.endpoints.api + 'payreward/ipos/user/' + user + '/10000/0';
            return this.http.getRaw(url);
        }

        getRewardsByUser(user: string) {
            const url = environment.endpoints.api + 'payreward/user/' + user + '/10000/0';
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

        deleteIpo(ipoid) {
            return this.http.deleteRaw(environment.endpoints.api + 'ipo/' + ipoid);
        }
}

//https://fabtest.info/api/userpay/params/amount/2000/mweZqx4QFEPDHHryp4K257zRss2VY4zc9D/DUSD