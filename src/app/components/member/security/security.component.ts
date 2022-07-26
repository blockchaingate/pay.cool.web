import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  email: string;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    // alert('email: ' + this.email );
  }
}
