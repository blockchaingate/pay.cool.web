import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit {

  stores: any;
  constructor(
    private utilServ: UtilService,
    private router: Router,
    private storeServ: StoreService) { }

  ngOnInit(): void {
    this.storeServ.getAll().subscribe(
      (ret: any) => {
        if(ret && ret.ok) {
          this.stores = ret._body;
        }
      }
    );
  }

  showAddress(address: string) {
    if(!address) {
      return '';
    }
    return address.substring(0,3) + '...' + address.substring(address.length - 3);
  }
  
  approved(store_id: string) {
    this.router.navigate(['/admin/store/' + store_id + '/approve']);
  }

  showName(name) {
    return this.utilServ.showName(name);
  }
}
