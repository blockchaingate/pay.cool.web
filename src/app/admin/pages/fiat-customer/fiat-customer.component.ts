import { Component, OnInit } from '@angular/core';
import { UserpayService } from 'src/app/services/userpay.service';

@Component({
  selector: 'app-fiat-customer',
  templateUrl: './fiat-customer.component.html',
  styleUrls: ['./fiat-customer.component.scss']
})
export class FiatCustomerComponent implements OnInit {
  customers: any;
  constructor(private userpaySer: UserpayService) { }

  ngOnInit(): void {
    this.userpaySer.getStarCustomers().subscribe(
      (ret: any) => {
        if(ret && ret.ok) {
          this.customers = ret._body;
        }
      }
    );
  }

}
