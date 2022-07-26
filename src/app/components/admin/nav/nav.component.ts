import { Component, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  @ViewChild('sidenav') sidenav: MatSidenav;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;

  menu = [
    {
      name: 'Settings',
      icon: 'settings',
      link: '/admin/settings'
    }
  ];

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  clickMenuItem(menuItem) {
    if(menuItem.children) {
      menuItem.showSubmenu = !menuItem.showSubmenu;
    } else {
      this.router.navigate([menuItem.link]);
    }
    
  }
  @Input() isHandset$: Observable<boolean>;
  
  constructor( private router: Router) {}
  menuItems = ['dashboard', 'profile', 'users', 'customers', 'merchants', 'categories', 'products',  'sales', 'orders'];
}
