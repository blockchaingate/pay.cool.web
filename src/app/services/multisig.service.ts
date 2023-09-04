import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable()
export class MultisigService {
    baseUrl = environment.endpoints.blockchain;
    constructor(private http: HttpClient) { }

    getByTxid(txid: string) {
        const url = this.baseUrl + 'multisig/txid/' + txid;
        return this.http.get(url);
    }

    getAssets(chain: string, address: string) {
        let balanceEndpoint = 'balance';
        if(chain == 'KANBAN') {
            balanceEndpoint = 'balanceold';
        }
        const url = this.baseUrl + chain.toLowerCase() + '/' + balanceEndpoint;
        const body = {
            native: address
        };
        return this.http.post(url, body);
    }

    createProposal(data: any) {
        const url = this.baseUrl + 'multisigproposal';
        return this.http.post(url, data);
    }

    confirmProposal(data: any) {
        const url = this.baseUrl + 'multisigproposal/confirm';
        return this.http.post(url, data);
    }

    getTransactionQueues(address: string, pageSize: number, pageNum: number) {
        const url = this.baseUrl + 'multisigproposal/queue/' + address + '/' + pageSize + '/' + pageNum;
        return this.http.get(url);
    }
}