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
import { TxRewardsComponent } from '../tx-rewards/tx-rewards.component';
import { PayRewardService } from 'src/app/services/payreward.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  payments: any;
  payment: any;
  wallet: any;
  modalRef: BsModalRef;
  constructor(
    private router: Router,
    private modalService: BsModalService,
    private coinServ: CoinService,
    private web3Serv: Web3Service,
    private toastr: ToastrService,
    private dataServ: DataService,
    private payRewardServ: PayRewardService,
    private kanbanServ: KanbanService,
    private chargeServ: ChargeService
    ) { }

  ngOnInit(): void {
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.chargeServ.getChargesByUser(walletAddress).subscribe(
            (payments) => {
              this.payments = payments;
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

  showRwards(txid) {
    this.payRewardServ.getAllRewardsByTxid(txid).subscribe(
      (rewards: any) => {
        const initialState = {
          rewards
        };          

        this.modalService.show(TxRewardsComponent, { initialState, class: 'modal-lg' });
      }
    );
  }

  showId(id: string) {
    return id.substring(0, 3) + '...' + id.substring(id.length - 3);
  }

  showAmount(amount: string) {
    return new BigNumber(amount).shiftedBy(-18).toNumber();
  }

  requestRefund(item: any) {
    this.payment = item;
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
      this.requestRefundDo(seed);
    });
  }

  cancelRequestRefund(item: any) {
    this.payment = item;
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
      this.cancelRequestRefundDo(seed);
    });
  }

  cancelRequestRefundDo(seed: any) {
    this.chargeServ.cancelRequestRefund(this.payment._id).subscribe(
      (ret: any) => {
        if(ret && ret._id) {
          this.toastr.success('Request refund was canceled successfully');
        } else {
          this.toastr.error('Failed to cancel request refund');
        }
      }
    );
  }
  requestRefundDo(seed: any) {
    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey;

    let requestRefundId = this.web3Serv.randomHex(32);

    const hashForSignature = this.web3Serv.hashKanbanMessage( requestRefundId);
    const requestRefundSig = this.web3Serv.signKanbanMessageHashWithPrivateKey(hashForSignature, privateKey);

    const data = {
      refundAll: true,
      items: [],
      requestRefundId: requestRefundId,
      r: requestRefundSig.r,
      s: requestRefundSig.s,
      v: requestRefundSig.v
    };
    const sig = this.kanbanServ.signJsonData(privateKey, data);

    this.chargeServ.requestRefund(this.payment._id, data).subscribe(
      (ret: any) => {
        if(ret && ret._id) {
          this.toastr.success('Request refund was made successfully');
        } else {
          this.toastr.error('Failed to request refund');
        }
      }
    );

  }
}
