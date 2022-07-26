import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset',
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['./reset-pwd.component.css']
})
export class ResetPwdComponent implements OnInit {
  email: string;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    // alert('email: ' + this.email );
  }
}
