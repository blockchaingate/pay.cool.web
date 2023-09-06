import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../models/language';
import { StorageService } from './storage.service';
@Injectable()
export class LanguageService {
    languages: Language[] = [
        { value: 'en', viewValue: 'English' },
        { value: 'sc', viewValue: '简体中文' },
        { value: 'tc', viewValue: '繁體中文' }
    ];
    selectedLan = this.languages[0];
    constructor(
        private storageServ: StorageService,
        private tranServ: TranslateService,
        private storage: StorageMap
    ) { 
        // this.selectedLan = this.getLan();
        this.setLan();
    }

    getLan() {
        // return this.tranServ.currentLang;
        return this.selectedLan;
    }

    setLan() {
        const storedLan = localStorage.getItem('_lan');
        if (storedLan) {
            if (storedLan === 'en') {
                this.selectedLan = this.languages[0];
            } else if (storedLan === 'sc') {
                this.selectedLan = this.languages[1];
            } else if (storedLan === 'tc') {
                this.selectedLan = this.languages[2];
            }
        } else {
            let userLang = navigator.language;
            userLang = userLang.substr(0, 2);
            if (userLang === 'CN' || userLang === 'cn' || userLang === 'zh') {
                this.selectedLan = this.languages[1];
                localStorage.setItem('_lan', 'sc');
                this.storage.set('_lan', 'sc');
            }
        }
        this.tranServ.use(this.selectedLan.value);
    }

    changeLan(lan: Language) {
        this.selectedLan = lan;
        this.tranServ.use(lan.value);

        localStorage.setItem('_lan', lan.value);
        this.storage.set('_lan', lan.value);
    }
}
