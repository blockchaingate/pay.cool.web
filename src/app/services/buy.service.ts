import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class BuyService {
    constructor(
      private http: HttpClient) { }
      getBuysByUser(user: string) {
        const url = environment.endpoints.api + 'buy/user/' + user + '/10/0';
        return this.http.get(url);
    }      
}
