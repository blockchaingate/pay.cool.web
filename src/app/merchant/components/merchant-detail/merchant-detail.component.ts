import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-merchant-detail',
  templateUrl: './merchant-detail.component.html',
  styleUrls: ['./merchant-detail.component.scss']
})
export class MerchantDetailComponent implements OnInit {

  @Input() merchant: any;
  constructor(
    private utilServ: UtilService,
    private translateServ: TranslateService) { }

  ngOnInit(): void {
    console.log('merchant====', this.merchant);
  }

  showName(name) {
    return this.utilServ.showName(name);
  }
}
