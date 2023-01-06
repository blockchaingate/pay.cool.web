import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class CommonService {
    constructor(
        private http: HttpService) { }
    getPrice(coinName: string) {
        return this.http.getRaw(environment.endpoints.api + 'common/price/' + coinName);
    }  
}