import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class LockerService {
    constructor(
        private http: HttpService) { }
        getAllLockersByUser(user: string, pageSize: number, pageNum: number) {
            return this.http.getRaw(environment.endpoints.api + 'locker/user/' + user + '/' + pageSize + '/' + pageNum);
        }   
        
        getAllLpLockersByUser(user: string, pageSize: number, pageNum: number) {
            return this.http.getRaw(environment.endpoints.api + 'lplocker/user/' + user + '/' + pageSize + '/' + pageNum);
        }   
        
}