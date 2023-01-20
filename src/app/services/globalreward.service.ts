import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class GlobalRewardService {
    constructor(
        private http: HttpService) { }

    getAllRewardsByProject(projectId: number, pageSize: number, pageNum: number) {
        return this.http.getRaw(environment.endpoints.api + 'globalreward/' + pageSize + '/' + pageNum);
    }
}