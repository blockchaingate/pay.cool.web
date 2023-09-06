import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class InsightService {
    constructor(private http: HttpClient) {}
    getFetRewardsFromSeed() {
        const baseUrl = environment.production ? 'https://fabexplorer.com/api/' : 'https://test.fabcoin.org/api/';
        const url = baseUrl + 'insight/fetRewardsFromSeed';
        return this.http.get(url);
    }

    getFetRewardsFromMetaforce() {
        const url = environment.endpoints.api + 'insight/fetRewardsFromMetaforce';
        return this.http.get(url);
    }

    getBuysBySearch(from: string, to: string, type: string, address: string, typesOfPackage: any, pageSize: number, pageNum: number) {
        const url = environment.endpoints.api + 'insight/searchForBuys';
        const body = {
            from,
            to,
            type,
            address,
            typesOfPackage,
            pageSize,
            pageNum
        };
        return this.http.post(url, body);
    }

    getBuysBySearchTotal(from: string, to: string, type: string, address: string, typesOfPackage: any) {
        const url = environment.endpoints.api + 'insight/searchForBuysTotal';
        const body = {
            from,
            to,
            type,
            address,
            typesOfPackage
        };
        return this.http.post(url, body);
    }

    getBiswapTransactions(txid: string) {
        const url = environment.endpoints.api + 'kanban/biswap/transaction/txid/' + txid;
        return this.http.get(url);
    }
}