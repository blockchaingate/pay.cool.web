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
    private kanbanServ: KanbanService,
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
      this.approveRefundDo(seed);
    });
  }

  async approveRefundDo(seed: any) {
    console.log('payment=', this.payment);
    const abi = {
      "inputs": [
        {
          "internalType": "bytes32[3]",
          "name": "_ids",
          "type": "bytes32[3]"
        },
        {
          "internalType": "uint32",
          "name": "_paidCoin",
          "type": "uint32"
        },
        {
          "internalType": "uint256",
          "name": "_totalAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_refundTax",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_refundRewardInPaidCoin",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "_users",
          "type": "address[]"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "refundAllWithSig",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const args = [
      [
        this.payment.merchantId, 
        this.payment.refunds[0].requestRefundId,
        this.payment.orderId
      ],
      this.payment.paidCoin, 
      '0x' + new BigNumber(this.payment.paymentFee).toString(16),
      '0x' + new BigNumber(this.payment.tax).toString(16),
      '0x' + new BigNumber(this.payment.totalReward).toString(16),
      [this.payment.customer],
      this.payment.refunds[0].v,
      this.payment.refunds[0].r,
      this.payment.refunds[0].s,
    ];
    console.log('args===', args);
    const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.payment.address, abi, args);
    if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
      this.toastr.success('Refund was approved successfully');
    } else {
      this.toastr.error('Error while approve the refund');
    }
  }
}
