import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['./forgot-pwd.component.css']
})
export class ForgotPwdComponent implements OnInit {
  email: string;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    // alert('email: ' + this.email );
  }
}
