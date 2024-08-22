import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';
import { UserpayService } from 'src/app/services/userpay.service';

@Component({
  selector: 'app-transfer-ownership',
  templateUrl: './transfer-ownership.component.html',
  styleUrls: ['./transfer-ownership.component.scss']
})
export class TransferOwnershipComponent implements OnInit {
  address: string;
  id: string;
  txids: any;
  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private dataServ: DataService,
    private userpayServ: UserpayService) { }

  ngOnInit(): void {
    this.txids = [];

    this.route.paramMap.subscribe((params: ParamMap) =>  {
      this.id = params.get('id');  
    });

    this.dataServ.currentWalletAddress.subscribe(
      (ret: any) => { 
        if(ret) {
          this.address = ret;
        }
      }
    );
  }

  createWallet() {
    localStorage.setItem('id', this.id);
    this.router.navigate(['/wallet/create']);
  }

  restoreWallet() {
    localStorage.setItem('id', this.id);
    this.router.navigate(['/wallet/import']);
  }

  transfer() {
    this.txids = [];
    this.userpayServ.transferLockersOwnership(this.address, this.id).subscribe(
      (ret: any) => {
        if(ret && ret._id) {
          this.toastr.info(' Reward was transfer successfully');
        } else {
          this.toastr.error('Failed to transfer reward');
        }
      }
    );
  }
}
