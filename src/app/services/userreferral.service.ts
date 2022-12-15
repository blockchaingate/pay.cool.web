import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Web3Service } from './web3.service';

@Injectable()
export class UserReferralService {
   constructor(
      private http: HttpClient) { }

   getChildren(address: string, pageSize: number, pageNum: number) {
    const url = environment.endpoints.api + 'userreferral/user/' + address + '/' + pageSize + '/' + pageNum;
    return this.http.get(url);
   }

   getProjectUserChildren(projectId, address: string, pageSize: number, pageNum: number) {
      const url = environment.endpoints.api + 'projectuser/project/' + projectId + '/user/' + address + '/' + pageSize + '/' + pageNum;
      return this.http.get(url);
   }

   getProjectUserChildrenTotalCount(projectId: number, address: string) {
      const url = environment.endpoints.api + 'projectuser/project/' + projectId + '/user/' + address + '/totalCount';
      return this.http.get(url);
   }

   getChildrenTotalCount(address: string) {
      const url = environment.endpoints.api + 'userreferral/user/' + address + '/totalCount';
      return this.http.get(url);
   }

   checkAddress(address: string) {
    const url = environment.endpoints.api + 'userreferral/isValid/' + address;
    return this.http.get(url);
   }   

   isContractOwner(address: string) {
      const url = environment.endpoints.api + 'userreferral/isContractOwner/' + address;
      return this.http.get(url);
   }

   get(address: string) {
      const url = environment.endpoints.api + 'userreferral/user/' + address;
      return this.http.get(url);
   }

   getProjectUser(projectId, address: string) {
      const url = environment.endpoints.api + 'projectuser/' + projectId + '/user/' + address;
      return this.http.get(url);
   }

   getAllUsers(pageSize: number, pageNum: number) {
      return this.http.get(environment.endpoints.api + 'userreferral/' + pageSize + '/' + pageNum);
   }   
   getAllUsersTotalCount() {
      return this.http.get(environment.endpoints.api + 'userreferral/totalCount');
   } 
}