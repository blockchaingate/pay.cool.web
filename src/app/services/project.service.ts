import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class ProjectService {
    constructor(
        private http: HttpService) { }
    getAllProjects(pageNum: number, pageSize: number) {
        return this.http.getRaw(environment.endpoints.api + 'project/' + pageSize + '/' + pageNum);
    }  
    getAllProjectPackages(pageNum: number, pageSize: number) {
        return this.http.getRaw(environment.endpoints.api + 'projectpackage/' + pageSize + '/' + pageNum);
    }  
    getAllProjectUsers(pageNum: number, pageSize: number) {
        return this.http.getRaw(environment.endpoints.api + 'projectuser/' + pageSize + '/' + pageNum);
    }      
    createProject(data: any) {
        return this.http.postRaw(environment.endpoints.api + 'project', data);
    }  
    createProjectPackage(data: any) {
        return this.http.postRaw(environment.endpoints.api + 'projectpackage', data);
    }  
    getProject(id: string) {
        return this.http.getRaw(environment.endpoints.api + 'project/' + id);
    }
    getProjectPackage(id: string) {
        return this.http.getRaw(environment.endpoints.api + 'projectpackage/' + id);
    }
    updateProject(id: string, data: any) {
        return this.http.putRaw(environment.endpoints.api + 'project/' + id, data);
    }
    
    updateProjectPackage(id: string, data: any) {
        return this.http.putRaw(environment.endpoints.api + 'projectpackage/' + id, data);
    }
}