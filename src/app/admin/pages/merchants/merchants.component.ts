import { Component, OnInit } from '@angular/core';
import { MerchantService } from '../../../services/merchant.service';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-merchants',
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.scss']
})
export class MerchantsComponent implements OnInit {

  merchants: any;
  constructor(
    private utilServ: UtilService,
    private router: Router,
    private merchantServ: MerchantService) { }

  ngOnInit(): void {
    this.merchantServ.getAllPagination(100, 0).subscribe(
      (ret: any) => {
        if(ret) {
          this.merchants = ret;
        }
      }
    );
  }

  showName(name) {
    return this.utilServ.showName(name);
  }
  
  showAddress(address: string) {
    if(!address) {
      return '';
    }
    return address.substring(0,3) + '...' + address.substring(address.length - 3);
  }
  
  approved(merchant_id: string) {
    this.router.navigate(['/admin/merchant/' + merchant_id + '/approve']);
  }

}
