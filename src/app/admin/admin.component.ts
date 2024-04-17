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
        title: 'Projects',
        link: 'projects',
        icon: 'store'
      }, 
      {
        title: 'Project Packages',
        link: 'project-packages',
        icon: 'store'
      }, 
      {
        title: 'Project Users',
        link: 'project-users',
        icon: 'store'
      }, 
      {
        title: 'Merchants',
        link: 'merchants',
        icon: 'store'
      },   
      {
        title: 'Merchant Nodes',
        link: 'merchant-nodes',
        icon: 'store'
      },  
      {
        title: 'Merchant Node Users',
        link: 'merchant-node-users',
        icon: 'store'
      },
      {
        title: 'Users',
        link: 'users',
        icon: 'store'
      },
      {
        title: 'User Nodes',
        link: 'user-nodes',
        icon: 'store'
      },  
      {
        title: 'User Node Users',
        link: 'user-node-users',
        icon: 'store'
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
