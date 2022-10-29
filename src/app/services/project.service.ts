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
    getAllProjectUsers(pageNum: number, pageSize: number) {
        return this.http.getRaw(environment.endpoints.api + 'projectuser/' + pageSize + '/' + pageNum);
    }      
    createProject(data: any) {
        return this.http.postRaw(environment.endpoints.api + 'project', data);
    }  
    getProject(id: string) {
        return this.http.getRaw(environment.endpoints.api + 'project/' + id);
    }
    updateProject(id: string, data: any) {
        return this.http.putRaw(environment.endpoints.api + 'project/' + id, data);
    }
}