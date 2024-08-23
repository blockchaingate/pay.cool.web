import { Component, OnInit } from '@angular/core';
import { UserpayService } from '../../../services/userpay.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CoinService } from 'src/app/services/coin.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-fiat-orders',
  templateUrl: './fiat-orders.component.html',
  styleUrls: ['./fiat-orders.component.scss']
})
export class FiatOrdersComponent implements OnInit {
  orders: any;
  wallet: any;
  order: any;
  id: string;
  fabAddress: string;
  modalRef: BsModalRef;

  constructor(
    private userpayServ: UserpayService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private dataServ: DataService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private router: Router, 
    private coinServ: CoinService,
    private kanbanServ: KanbanService,
    private utilServ: UtilService
  ) { }

  ngOnInit(): void {
    this.userpayServ.getAllFiatOrders(100, 0).subscribe(
      (orders: any) => {
        this.orders = orders;
      }
    );

    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 
  }

  sendReward(order: any) {
    this.order = order;
    this.id = order._id;
    this.fabAddress = order.fabAddress;
    const initialState = { 
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }

    this.userpayServ.getPaycoolRewardInfo(this.id, this.fabAddress).subscribe(
      (info: any) => {
        console.log('info===', info);
        if(!info || !info.params || (info.params.length != 2)) {
          this.toastr.error('No paycool info');
          return;
        }
        this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

        this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
          this.sendRewardDo(seed, info.params);
        });
      }
    );
  }


  async sendRewardDo(seed: Buffer, params: any) {
    console.log('params===', params);
    const keyPairsKanban = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    let privKey: any = keyPairsKanban.privateKeyBuffer;

    if(!Buffer.isBuffer(privKey)) {
      privKey = privKey.privateKey;
    }

    const address = keyPairsKanban.address;


    const nonce = await this.kanbanServ.getTransactionCount(this.utilServ.fabToExgAddress(address));
    const rawtx1 = this.kanbanSmartContractServ.getExecSmartContractAbiHexFromPrivateKeyNonce(privKey, nonce, params[0].to, params[0].data); 
    const rawtx2 = this.kanbanSmartContractServ.getExecSmartContractAbiHexFromPrivateKeyNonce(privKey, nonce + 1, params[1].to, params[1].data); 

    const res = await this.kanbanServ.sendRawSignedTransactionsPromise([rawtx1, rawtx2]);
    //return res;

    console.log('res====', res);
    if(res && res.success && res.data && res.data.status == '0x1') {
      this.toastr.success('the transaction was procssed successfully');
    } else {
      const txids = res.data.txids;
      this.toastr.error('Failed to chargeFund with credit, txid:' + txids[txids.length - 1]);
    }
  }

}
