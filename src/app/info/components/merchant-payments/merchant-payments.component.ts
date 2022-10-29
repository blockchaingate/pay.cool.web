import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ChargeService } from 'src/app/services/charge.service';
import BigNumber from 'bignumber.js';
import { Web3Service } from 'src/app/services/web3.service';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CoinService } from 'src/app/services/coin.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from 'src/app/services/kanban.service';
import { ToastrService } from 'ngx-toastr';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';

@Component({
  selector: 'app-merchant-payments',
  templateUrl: './merchant-payments.component.html',
  styleUrls: ['./merchant-payments.component.scss']
})
export class MerchantPaymentsComponent implements OnInit {

  payments: any;
  payment: any;
  wallet: any;
  modalRef: BsModalRef;
  constructor(
    private router: Router,
    private modalService: BsModalService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private toastr: ToastrService,
    private dataServ: DataService,
    private chargeServ: ChargeService
    ) { }

  ngOnInit(): void {
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.chargeServ.getChargesByMerchant(walletAddress).subscribe(
            (payments) => {
              this.payments = payments;
              console.log('paymentsddd=', payments);
            }
          );
        }

      }
    );

    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 

  }

  showId(id: string) {
    return id.substring(0, 3) + '...' + id.substring(id.length - 3);
  }

  showAmount(amount: string) {
    return new BigNumber(amount).shiftedBy(-18).toNumber();
  }

  approveRefund(item: any) {
    
    const id = item._id;
    this.chargeServ.getRefundInfo(id).subscribe(
      payment => {
        this.payment = payment;
      }
    );
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
      this.approveRefundDo(seed);
    });
  }

  async approveRefundDo(seed: any) {
    if(!this.payment) {
      this.toastr.error('Failed to connect to the api server');
      return;
    }
    const params = this.payment.params;
    console.log('params==', params);

    let ret = await this.kanbanSmartContractServ.execSmartContractAbiHex(seed, params[0].to, params[0].data);
    if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
      ret = await this.kanbanSmartContractServ.execSmartContractAbiHex(seed, params[1].to, params[1].data);
      if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
        this.toastr.success('the transaction was procssed successfully');
      } else {
        this.toastr.error('Failed to refund, txid:' + ret._body.transactionHash);
      }
    } else {
      this.toastr.error('Failed to authorizeOperator, txid:' + ret._body.transactionHash);
    }
  }
}
