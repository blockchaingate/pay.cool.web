import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-store-detail',
  templateUrl: './store-detail.component.html',
  styleUrls: ['./store-detail.component.scss']
})
export class StoreDetailComponent implements OnInit {

  @Input() store: any;
  constructor(
    private utilServ: UtilService,
    private translateServ: TranslateService) { }

  ngOnInit(): void {
    console.log('store====', this.store);
  }

  showName(name) {
    return this.utilServ.showName(name);
  }
}
