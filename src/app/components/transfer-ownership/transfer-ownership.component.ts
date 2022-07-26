import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';
import { StarService } from 'src/app/services/star.service';

@Component({
  selector: 'app-transfer-ownership',
  templateUrl: './transfer-ownership.component.html',
  styleUrls: ['./transfer-ownership.component.scss']
})
export class TransferOwnershipComponent implements OnInit {
  address: string;
  sig: string;
  txids: any;
  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private dataServ: DataService,
    
    private starServ: StarService) { }

  ngOnInit(): void {
    this.txids = [];

    this.route.paramMap.subscribe((params: ParamMap) =>  {
      this.sig = params.get('sig');  
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
    localStorage.setItem('sig', this.sig);
    this.router.navigate(['/wallet/create']);
  }

  restoreWallet() {
    localStorage.setItem('sig', this.sig);
    this.router.navigate(['/wallet/import']);
  }

  transfer() {
    this.txids = [];
    this.starServ.transferLockersOwnership(this.address, this.sig).subscribe(
      (ret: any) => {
        console.log('ret====', ret);
        if(!ret.ok) {
          this.toastr.error(ret._body);
        } else {
          this.txids = ret._body;
          let successCount = 0;
          let errorCount = 0;
          for(let i = 0; i < this.txids.length; i++) {
            const item = this.txids[i];
            if(item.status == '0x1') {
              successCount ++;
            } else {
              errorCount ++;
            }
          }

          if(!errorCount) {
            this.toastr.success(successCount + ' lockers was transfer successfully');
          } else 
          if(!successCount) {
            this.toastr.error('Failed to transfer ' + errorCount + ' lockers');
          } else {
            this.toastr.info(successCount + ' lockers was transfer successfully,' + ' failed to transfer ' + errorCount + ' lockers');
          }

        }
      }
    );
  }
}
