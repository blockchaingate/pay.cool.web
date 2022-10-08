import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class MerchantService {
  constructor(private http: HttpService) { }

  getAllPagination(pageNum: number, pageSize: number) {
    return this.http.getRaw(environment.endpoints.api + 'merchantreferral/' + pageSize + '/' + pageNum);
  }
}