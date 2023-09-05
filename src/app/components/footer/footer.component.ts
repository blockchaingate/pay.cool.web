import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { SubscribeService } from 'src/app/services/subscribe.service';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  year = 2020;

  email: string;
  emailValid = true;
  emailSubmitted = false;
  storedLan: string = "";

  constructor(
    private subService: SubscribeService,

  ) {
    this.storedLan = localStorage.getItem('_lan') || 'en';
  }

  ngOnInit() {
    const dt = new Date();
    this.year = dt.getFullYear();
  }

  onSubmit() {

    if (!this.isEmailValid(this.email)) {
      this.emailValid = false;
    } else {
      this.emailValid = true;
      this.subService.addEmail(this.email).subscribe(
        (response) => {
          //print status message
          if (response["status"] === 200) {

            this.emailSubmitted = true;
          } else {
            this.emailSubmitted = false;
          }
        }
      );
    }
  }

  isEmailValid(email: string) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // email validation pattern
    return emailPattern.test(email); // returns true if email is valid, false otherwise
  }

}
