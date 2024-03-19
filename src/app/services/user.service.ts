import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpService) { }

  getAllNodes(pageSize: number, pageNum: number) {
    return this.http.getRaw(environment.endpoints.api + 'usernode/' + pageSize + '/' + pageNum);
  }

  getAllNodeLinks(pageSize: number, pageNum: number) {
    return this.http.getRaw(environment.endpoints.api + 'usernodelink/' + pageSize + '/' + pageNum);
  }
}