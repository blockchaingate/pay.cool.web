import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  email: string;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    // alert('email: ' + this.email );
  }
}
