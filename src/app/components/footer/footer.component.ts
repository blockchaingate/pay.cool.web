import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { SubscribeService } from 'src/app/services/subscribe.service';

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

  constructor(
    private subService: SubscribeService) { }

  ngOnInit() {
    const dt = new Date();
    this.year = dt.getFullYear();
  }

  onSubmit() {
    console.log("Email submitted: " + this.email);

    if (!this.isEmailValid(this.email)) {
      console.log("Invalid email");
      this.emailValid = false;
    } else {
      console.log("Valid email");
      this.emailValid = true;
      this.subService.addEmail(this.email).subscribe(
        (response) => {
          console.log(response);
          //print status message
          console.log("status:" + response["status"]);
          if (response["status"] === 200) {
            
            this.emailSubmitted = true;
          }else{
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
