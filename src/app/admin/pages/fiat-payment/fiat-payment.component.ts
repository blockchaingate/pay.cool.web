import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { OrderService } from 'src/app/services/order.service';
import { UserpayService } from 'src/app/services/userpay.service';
import { UtilService } from 'src/app/services/util.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RequestRefundComponent } from '../../../shared/modals/request-refund/request-refund.component';
import { TransferOwnershipComponent } from '../../../shared/modals/transfer-ownership/transfer-ownership.component';
import { DataService } from 'src/app/services/data.service';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { CoinService } from 'src/app/services/coin.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { ToastrService } from 'ngx-toastr';
import { Web3Service } from 'src/app/services/web3.service';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-fiat-payment',
  templateUrl: './fiat-payment.component.html',
  styleUrls: ['./fiat-payment.component.scss']
})
export class FiatPaymentComponent implements OnInit {
  charges: any;
  realOrder: any;
  modalRef: BsModalRef;
  order: any;
  op: string;
  newowner: string;
  starCustomer: any;
  requestRefundData: any;
  wallet: any;

  constructor(
    private toastr: ToastrService,
    private coinServ: CoinService,
    private kanbanServ: KanbanService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private modalService:BsModalService,
    private utilServ: UtilService,
    private web3Serv: Web3Service,
    private orderServ: OrderService,
    private dataServ: DataService,
    private userpaySer: UserpayService) { }

  ngOnInit(): void {
    this.userpaySer.getStarChargeFundFromCredits().subscribe(
      (ret: any) => {
        if(ret && ret.ok) {
          this.charges = ret._body;
        }
      }
    );
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
          this.wallet = wallet;
      }
  );
  }

  getPassword(){
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {

      if(this.op == 'requestRefundV2') {
        this.requestRefundV2Do(seed);
      }
      if(this.op == 'cancelRequestRefundV2') {
        this.cancelRequestRefundV2Do(seed);
      }
      if(this.op == 'transferOwnershipV2') {
        this.transferOwnershipV2Do(seed);
      }
    });
  }

  async transferOwnershipV2Do(seed: Buffer) {
    const id = this.order.id;
    const index = this.starCustomer.index;
    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b', '1150/' + index);
    const privateKey = keyPair.privateKeyBuffer.privateKey;
    const from = keyPair.address;
    const abi = {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_ID",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "transferLocker",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const args = [id, this.utilServ.fabToExgAddress(from), this.utilServ.fabToExgAddress(this.newowner)];

    const ret = await this.kanbanSmartContractServ.execSmartContractFromPrivateKey(privateKey, from, environment.addresses.smartContract.locker2, abi, args);
    if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
      this.toastr.success('Ownership was transfered successfully');
    } else {
      this.toastr.error('Failed to transfer ownership');
    }
  }
  async cancelRequestRefundV2Do(seed: Buffer) {
    const realOrderId = this.order.id.substring(2, 26);
    const data = {
      id: realOrderId
    }
    const index = this.starCustomer.index;
    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b', '1150/' + index);
    const privateKey = keyPair.privateKeyBuffer.privateKey;
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;   
    this.orderServ.cancelrequestRefundV2(data).subscribe(
      (ret: any) => {
        if(ret && ret.ok && ret._body && ret._body._id) {
          this.toastr.success('Request refund was canceled successfully');
        } else {
          this.toastr.error('Failed to cancel request refund');
        }
      }
    );
  }

  requestRefundV2Do(seed: Buffer) {
    const index = this.starCustomer.index;
    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b', '1150/' + index);
    const address = keyPair.address;
    if(address != this.starCustomer.address) {
      this.toastr.info('You are not the owner of this order');
      return;
    }
    const privateKey = keyPair.privateKeyBuffer.privateKey;
    let requestRefundId = this.utilServ.genRanHex(64);

    const hashForSignature = this.web3Serv.hashKanbanMessage('0x' + requestRefundId);
    const requestRefundSig = this.web3Serv.signKanbanMessageHashWithPrivateKey(hashForSignature, privateKey);

    const data = {
      refundAll: this.requestRefundData.refundAll,
      items: this.requestRefundData.items.filter(item => item.quantity > 0),
      requestRefundId: '0x' + requestRefundId,
      r: requestRefundSig.r,
      s: requestRefundSig.s,
      v: requestRefundSig.v
    };
    const sig = this.kanbanServ.signJsonData(privateKey, data);

    data['sig'] = sig.signature;   
    this.orderServ.requestRefund(this.realOrder._id, data).subscribe(
      (ret: any) => {
        if(ret && ret.ok && ret._body && ret._body._id) {
          this.toastr.success('Request refund was made successfully');
        } else {
          this.toastr.error('Failed to request refund');
        }
      }
    );
  }

  transferOwnership(order) {
    const from = order.from;
    this.userpaySer.get7StarCustomerByAddress(from).subscribe(
      (ret: any) => {
        if(ret && ret.ok) {
          this.starCustomer = ret._body;
        }
      }
    );

    this.modalRef = this.modalService.show(TransferOwnershipComponent, { });
    this.modalRef.content.onClose.subscribe( (newowner: string) => {
      this.op = 'transferOwnershipV2';
      this.newowner = newowner;
      this.order = order;
      this.getPassword();
    });
  }
  
  showCoinName(coinType:number) {
    return this.utilServ.getCoinNameByTypeId(coinType);
  }

  showAmount(amount: number) {
    return new BigNumber(amount).shiftedBy(-18).toNumber()
  }

  showAddr(addr: string) {
    if(!addr) {
      return '';
    }
    return addr.substring(0,3) + '...' + addr.substring(addr.length-3);
  }

  requestRefund(order) {
    const from = order.from;
    this.userpaySer.get7StarCustomerByAddress(from).subscribe(
      (ret: any) => {
        if(ret && ret.ok) {
          this.starCustomer = ret._body;
        }
      }
    );
    const realOrderId = order.id.substring(2, 26);
    this.orderServ.get(realOrderId).subscribe(
      (ret: any) => {
        if(ret && ret.ok) {
          this.realOrder = ret._body;
          const initialState = {
            order: order,
            realOrder: this.realOrder
          };          
          
          this.modalRef = this.modalService.show(RequestRefundComponent, { initialState });
          this.modalRef.content.onClose.subscribe( (requestRefundData: any) => {
            this.op = 'requestRefundV2';
            this.order = order;
            this.requestRefundData = requestRefundData;
            this.getPassword();
          });
        }
      }
    );

  }
}
