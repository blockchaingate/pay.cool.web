import { Component, OnInit } from '@angular/core';
import { StarService } from 'src/app/services/star.service';

@Component({
  selector: 'app-fiat-customer',
  templateUrl: './fiat-customer.component.html',
  styleUrls: ['./fiat-customer.component.scss']
})
export class FiatCustomerComponent implements OnInit {
  customers: any;
  constructor(private starSer: StarService) { }

  ngOnInit(): void {
    this.starSer.getStarCustomers().subscribe(
      (ret: any) => {
        if(ret && ret.ok) {
          this.customers = ret._body;
        }
      }
    );
  }

}
