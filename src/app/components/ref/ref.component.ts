import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ref',
  templateUrl: './ref.component.html',
  styleUrls: ['./ref.component.scss']
})
export class RefComponent implements OnInit {

  constructor(private route: ActivatedRoute,) { }

  ngOnInit(): void {  
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const refCode = params.get('refcode');
        const newUrl = (environment.production ? 'https://www.pay.cool' : 'http://localhost:4200') + '/user-tree?ref=' + refCode;
        window.location.href = newUrl;
      }
    );
  }

}
