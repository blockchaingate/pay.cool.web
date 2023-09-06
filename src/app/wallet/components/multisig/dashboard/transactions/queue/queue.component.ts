import { Component, OnInit, Input } from '@angular/core';
import { MultisigService } from 'src/app/services/multisig.service';


@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit{
  pageSize: number = 10;
  pageNum: number = 0;
  @Input() multisigwallet: any;
  proposals: any;
  constructor(private multisigServ: MultisigService) {}

  ngOnInit(): void {
    this.multisigServ.getTransactionQueues(this.multisigwallet.address, this.pageSize, this.pageNum).subscribe(
      (ret: any) => {
        if(ret.success) {
          this.proposals = ret.data;
        }
      }
    );
  }
}
