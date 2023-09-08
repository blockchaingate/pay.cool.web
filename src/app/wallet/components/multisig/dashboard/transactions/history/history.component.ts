import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MultisigService } from 'src/app/services/multisig.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnChanges{
  @Input() multisigwallet: any;

  transactions: any;
  pageSize: number = 10;
  pageNum: number = 0;
  chain: string;
  constructor(private multisigServ: MultisigService, private toastServ: ToastrService) {}
  loadTransactions() {
    this.chain = this.multisigwallet.chain;
    this.multisigServ.getTransactions(this.multisigwallet.address, this.pageSize, this.pageNum).subscribe(
      {
        next: (ret: any) => {
          if(ret.success) {
            this.transactions = ret.data;
          }
        },
        error: (error: any) => {
          this.toastServ.error(error);
        }
      }
    );
  }
  ngOnInit(): void {
    this.loadTransactions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.multisigwallet && changes.multisigwallet.currentValue) {
      this.multisigwallet = changes.multisigwallet.currentValue;
      this.loadTransactions();
    }
  }
}
