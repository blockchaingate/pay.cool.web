import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  url: string;
  constructor(private router: Router) { }

  ngOnInit(): void {
    const url = this.router.url;
    this.url = url;
    console.log('url====', url);
    this.router.events.subscribe(value => {
      this.url = this.router.url.toString();
    });
  }

}
