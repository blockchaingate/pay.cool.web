import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class SubscribeService {
    constructor(private http: HttpClient) { }

    addEmail(email: string) {

        const url = environment.endpoints.emailApi;

        //test url
        // const url = "http://localhost:3100/user";

        const data = {
            email: email
        };

        return this.http.post(url, data);
    }
}