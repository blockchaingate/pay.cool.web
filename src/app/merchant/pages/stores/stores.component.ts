import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent implements OnInit {
  pageSize = 100;
  pageNum = 0;
  stores: any;
  myStoreExisted: boolean;
  
  constructor(
    private dataServ: DataService,
    private router: Router,
    private storeServ: StoreService) { }

  getStores() {
    this.storeServ.getAllPagination(this.pageNum, this.pageSize).subscribe(
      (ret: any) => {
        if(ret && ret.ok) {
          this.stores = ret._body;
        }
      }
    );
  }
  ngOnInit(): void {
    this.myStoreExisted =false;
    this.dataServ.currentMyStore.subscribe(
      (store: any) => {
        if(store && store._id) {
          this.myStoreExisted = true;
        }
      }
    );
    this.getStores();
  }

  myStore() {
    this.router.navigate(['/merchants/new-store']);
  }
}
