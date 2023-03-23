import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class SubscribeService {
    constructor(private http: HttpClient) { }

    addEmail(email: string, message: string = "") {

        const url = environment.endpoints.emailApi + "create";

        //test url
        // const url = "http://localhost:3100/user";

        let data = {
            email: email
        };

        if (message != "" && message != null) {
            data['message'] = message;
        }

        console.log("data" + data);




        return this.http.post(url, data);
    }
}