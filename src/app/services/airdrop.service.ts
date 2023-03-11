import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AirdropService {
    constructor(private http: HttpService) { }
    
    getQuestionair(address: string, ip: string) {
        const url = 'airdrop/getQuestionair/' + address + '/' + ip;
        return this.http.getRaw(environment.endpoints.blockchaingate + url);
    }

    answerQuestionair(address: string, questionair_id: string, answer: string) {
        const data = {
            address: address,
            questionair_id: questionair_id,
            answer: answer
        };
        const url = 'airdrop/answerQuestionair';
        console.log('urllll=', url);
        return this.http.postRaw(environment.endpoints.blockchaingate + url, data);       
    }    
}