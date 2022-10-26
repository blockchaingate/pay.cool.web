import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Web3Service } from './web3.service';

@Injectable()
export class UserReferralService {
   constructor(
      private web3Serv: Web3Service,
      private http: HttpClient) { }

   getTree(address: string) {
    const url = environment.endpoints.api + 'userreferral/user/' + address + '/100/0';
    return this.http.get(url);
   }
   checkAddress(address: string) {
    const url = environment.endpoints.api + 'userreferral/isValid/' + address;
    return this.http.get(url);
   }   
}