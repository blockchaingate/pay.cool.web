import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component({
  providers: [],
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  showNavMenu = false;
  dropDownActive = false;
  //displayName: string;
  merchantId: string;



  role: string;
  myPhotoUrl: string;
  displayName: string;
  merchantStatus: string;

  menuItems: any;
  constructor(
    private router: Router, 
    private translateServ: TranslateService
  ) { }

  async ngOnInit() {

    this.menuItems = [
      {
        title: 'Dashboard',
        link: 'dashboard',
        icon: 'dashboard'
      },    
      {
        title: 'Payments',
        link: 'payments',
        icon: 'store'
      }, 
      {
        title: 'Vips',
        link: 'vips',
        icon: 'store'
      }, 
      {
        title: 'Fiat customer',
        link: 'fiat-customer',
        icon: 'store'
      }, 
      {
        title: 'Fiat payment',
        link: 'fiat-payment',
        icon: 'store'
      },      
        
      {
        title: 'Stores',
        link: 'stores',
        icon: 'store'
      },      
        
      {
        title: 'Exchange rate',
        link: 'exchange-rate',
        icon: 'category'
      },
      {
        title: 'Fee distribution',
        link: 'fee-distribution',
        icon: 'collection'
      },
      {
        title: 'Merchant credit',
        link: 'merchant-credit',
        icon: 'collection'
      }  
    ];




  }

  changeLang() {
    let lang = this.translateServ.getDefaultLang();
    lang = (lang === 'en') ? 'sc' : 'en';
    this.translateServ.setDefaultLang(lang);
  }

  logout(): void {
    this.router.navigate(['/auth/signin']);
  }

  profile(): void {
    this.router.navigate(['/admin/profile']);
  }

  toggleShowNavMenu(): void {
    this.showNavMenu = !this.showNavMenu;
  }

  toggleDropDownActive(): void {
    this.dropDownActive = !this.dropDownActive;
  }
}
