import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable()
export class MultisigService {
    baseUrl = environment.endpoints.blockchain + 'multisig/';
    constructor(private http: HttpClient) { }

    getByTxid(txid: string) {
        const url = this.baseUrl + 'txid/' + txid;
        return this.http.get(url);
    }
}