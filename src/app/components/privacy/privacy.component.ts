import { Component } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Location } from '@angular/common';
@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent {
  lan = 'en';
  public href: string = "";
  public langFromUrl: string = "";
  constructor(private localSt: LocalStorage,
    private location: Location
  ) {
    this.href = this.location.path();
    this.langFromUrl = this.href.split('/')[1];

    if (this.langFromUrl === 'en' || this.langFromUrl === 'sc' || this.langFromUrl === 'tc') {
      this.lan = this.langFromUrl;
    } else {
      this.lan = localStorage.getItem('_lan') || 'en';
    }
    console.log('Privacy this.lan=', this.lan);

  }
}