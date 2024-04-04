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

    getByAddress(address: string) {
        const url = this.baseUrl + 'multisig/address/' + address;
        return this.http.get(url);
    }

    getNonce(address: string) {
        const url = this.baseUrl + 'multisig/nonce/' + address;
        return this.http.get(url);
    }

    getTransactions(address: string, pageSize: number, pageNum: number) {
        const url = this.baseUrl + 'multisigtransaction/address/' + address + '/' + pageSize + '/' + pageNum;
        return this.http.get(url);
    }

    getAssets(chain: string, address: string) {
        let balanceEndpoint = 'balance';

        const url = this.baseUrl + chain.toLowerCase() + '/' + balanceEndpoint;
        const body = {
            native: address
        };
        if(chain != 'KANBAN') {
            body['tokens'] = [];
            if(environment.addresses.smartContract.USDT[chain]) {
                body['tokens'].push(environment.addresses.smartContract.USDT[chain]);
            }
            if(environment.addresses.smartContract.USDC[chain]) {
                body['tokens'].push(environment.addresses.smartContract.USDC[chain]);
            }
        }
        return this.http.post(url, body);
    }

    getGasBalance(chain: string, address: string) {
        let balanceEndpoint = 'balance';

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