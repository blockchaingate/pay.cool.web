import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-merchant-home',
  templateUrl: './merchant-home.component.html',
  styleUrls: ['./merchant-home.component.scss']
})
export class MerchantHomeComponent implements OnInit {

  merchant: any;
  constructor(private dataServ: DataService) { }

  ngOnInit(): void {
    this.dataServ.currentMyStore.subscribe(
      (store: any) => {
        if(store && store._id) {
          this.merchant = store;
        }
      }
    );
  }

}
