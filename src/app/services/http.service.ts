import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserAuth } from './user-auth.service';
import Config from '../config/config.json';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface OPTIONS {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    // responseType: "arraybuffer";
    withCredentials?: boolean;
}

@Injectable({ providedIn: 'root' })
export class HttpService {
    constructor(private http: HttpClient, private userAuth: UserAuth) { }

    post(path: string, data: any, jwtAuth = false): Observable<object> {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-app-id': Config.appid
        });
        if (jwtAuth) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-app-id': Config.appid,
                'x-access-token': this.userAuth.token
            });
        }

        //data.appId = Config.appid;
        const options = {
            headers: httpHeaders
        };

        const url = environment.endpoints.blockchaingate + path;
        return this.http.post(url, data, options);
    }

    get(path: string, jwtAuth = false): Observable<object> {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-app-id': Config.appid
        });
        if (jwtAuth === true) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-app-id': Config.appid,
                'x-access-token': this.userAuth.token
            });
        }

        // alert('get Token: ' + this.userAuth.token);
        const options = {
            headers: httpHeaders
        };

        const url = environment.endpoints.blockchaingate + path;
        // alert('url: ' + url)
        return this.http.get(url, options);
    }

    // path is absolute url.
    getAbsoluteUrl(path: string, jwtAuth = false): Observable<object> {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-app-id': Config.appid
        });
        if (jwtAuth === true) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-app-id': Config.appid,
                'x-access-token': this.userAuth.token
            });
        }

        // alert('get Token: ' + this.userAuth.token);
        const options = {
            headers: httpHeaders
        };

        return this.http.get(path, options);
    }

    put(path: string, data: any, jwtAuth = true): Observable<any> {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        if (jwtAuth === true) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': this.userAuth.token
            });
        }
        const options: OPTIONS = {
            headers: httpHeaders
        };
        //data.appId = Config.appid;
        const url =  environment.endpoints.blockchaingate + path;
        return this.http.put(url, data, options);
    }

    delete(path: string, jwtAuth = true): Observable<any> {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        if (jwtAuth === true) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': this.userAuth.token
            });
        }
        const options: OPTIONS = {
            headers: httpHeaders
        };
        const url = Config.apiUrl + path;
        return this.http.delete(url, options);
    }

    postWithExtra(path: string, data: any, reportProgress = true, jwtAuth = false): Observable<object> {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-app-id': Config.appid
        });
        if (jwtAuth === true) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-app-id': Config.appid,
                'x-access-token': this.userAuth.token
            });
        }
        //data.appId = Config.appid;
        const options = {
            headers: httpHeaders,
            reportProgress
        };

        const url = environment.endpoints.blockchaingate + path;
        return this.http.post(url, data, options);
    }

    postPrivate(path: string, data: any, token: string): Observable<object> {
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-app-id': Config.appid,
            'x-access-token': token
        });
        const options = {
            headers: httpHeaders
        };
        //data.appId = Config.appid;

        const url = environment.endpoints.blockchaingate + path;
        return this.http.post(url, data, options);
    }

    getPrivate(path: string, token: string): Observable<object> {
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-app-id': Config.appid,
            'x-access-token': token
        });
        const options = {
            headers: httpHeaders
        };

        const url = environment.endpoints.blockchaingate + path;
        return this.http.get(url, options);
    }

    uploadFile(url: string, contenType: string, file: File): Observable<object>  {
        contenType = contenType.replace('+', '/');
        contenType = 'application/octet-stream';
        const httpHeaders = new HttpHeaders({ 'Content-Type': contenType, 'x-amz-acl': 'public-read' });
        const options: OPTIONS = {
            headers: httpHeaders,
            reportProgress: true
        };
        return this.http.put(url, file, options);
    }

    getRaw(fullUrl: string, options?:any): Observable<any> {
        return this.http.get(fullUrl, options);
    }

    deleteRaw (fullUrl: string, options?:any): Observable<any> {
        return this.http.delete(fullUrl, options);
    }

    putRaw(fullUrl: string, options?:any): Observable<any> {
        return this.http.put(fullUrl, options);
    }

    // fullUrl: http://...  or https://...
    postRaw(fullUrl: string, data: any, options?: OPTIONS): Observable<any> {
        return this.http.post(fullUrl, data, options);
    }    
}
