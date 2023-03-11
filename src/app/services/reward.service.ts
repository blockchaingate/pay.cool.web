import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class RewardService {
    constructor(
        private http: HttpService) { }
    getAllRewardsByUser(user: string, pageSize: number, pageNum: number) {
        return this.http.getRaw(environment.endpoints.api + 'payreward/user/' + user + '/' + pageSize + '/' + pageNum);
    }  
    
    getGetRewards(user: string, pageSize: number, pageNum: number) {
        return this.http.getRaw(environment.endpoints.api + 'getreward/user/' + user + '/' + pageSize + '/' + pageNum);
    }

    getTotalGetRewards(user: string) {
        return this.http.getRaw(environment.endpoints.api + 'getreward/user/' + user + '/totalGet');
    }
}