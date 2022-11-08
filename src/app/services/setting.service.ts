import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class SettingService {
  constructor(private http: HttpService) { }

  createOrUpdate(setting: any) {
    return this.http.postRaw(environment.endpoints.api + 'usersetting', setting);
  }

  getSetting(walletAddress: string) {
    return this.http.getRaw(environment.endpoints.api + 'usersetting/user/' + walletAddress);
  }
}