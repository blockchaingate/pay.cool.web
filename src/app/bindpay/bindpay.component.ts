import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
//import { AlertService } from 'src/app/services/alert.service';
import { CoinService } from 'src/app/services/coin.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { TimerService } from 'src/app/services/timer.service';
import { UtilService } from 'src/app/services/util.service';
import { WalletService } from 'src/app/services/wallet.service';
import { Web3Service } from 'src/app/services/web3.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../shared/modals/password-modal/password-modal.component';
import { ReceiveCoinModal } from './modals/receive-coin/receive-coin.component';
import BigNumber from 'bignumber.js';
import * as exaddr from '../lib/exaddr';
import { KanbanSmartContractService } from '../services/kanban.smartcontract.service';
import { ToastrService } from 'ngx-toastr';
import { QrscannerModalComponent } from '../shared/modals/qr-scanner/qrscanner-modal.component';

@Component({
    selector: 'app-bindpay',
    templateUrl: './bindpay.component.html',
    styleUrls: ['./bindpay.component.scss'],
    providers: []
  })

export class BindpayComponent implements AfterContentInit{
  address: string;
  exAddress: string;
  modalRef: BsModalRef;
  qrModalRef: BsModalRef;
  pin: string;
  receiverAddress: string;
  transactionHistory: any;
  coin: any;
  token: any;
  amount: number;
  mytokens: any;
  transactionHistories: any;
  wallet: any;
  //@ViewChild('pinModal', { static: true }) pinModal: PinNumberModal;

   constructor(
      public coinServ: CoinService,
      public utilServ: UtilService,
      private storage: StorageMap,
      private web3Serv: Web3Service,
      private modalServ: BsModalService,
      private toastr: ToastrService,
      private timerServ: TimerService,
      private translateServ: TranslateService,
      //private alertServ: AlertService,
      private kanbanServ: KanbanService,
      private kanbanSmartContractServ: KanbanSmartContractService,
      private walletServ: WalletService) {}

  ngAfterContentInit() {
    this.storage.get('ecomwallets').subscribe((wallets: any) => {

        if (!wallets || (wallets.length == 0)) {
          return;
        }
        this.wallet = wallets.items[wallets.currentIndex];
  
        this.loadWallet();
  
      });

  }

  onLoadCamera() {
    this.qrModalRef = this.modalServ.show(QrscannerModalComponent, {});
  }

  loadWallet() {
    const addresses = this.wallet.addresses;
    const walletAddressItem = addresses.filter(item => item.name == 'FAB')[0];
    this.address = walletAddressItem.address;
    this.exAddress = exaddr.toKbpayAddress(this.address);
    const kanbanAddress = this.utilServ.fabToExgAddress(this.address);
    this.kanbanServ.getBalance(kanbanAddress).subscribe((tokens) => {
        this.mytokens = tokens;
    }); 
  }

  confirmTransfer() {
    const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
    };          
      
    this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
        this.transferDo(seed);
    });

  }



  async transferDo(seed: Buffer) {

    const abi = {
      'constant': false,
      'inputs': [
        {
          'name': '_to',
          'type': 'address'
        },
        {
          'name': '_coinType',
          'type': 'uint32'
        },
        {
          'name': '_value',
          'type': 'uint256'
        },
        {
          "name": "_comment",
          "type": "bytes32"
        }
      ],
      'name': 'transfer',
      'outputs': [
        {
          'name': 'success',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    };

    let toAddressLegacy = '';
    try {
        toAddressLegacy = exaddr.toLegacyAddress(this.receiverAddress);
    } catch(e) {

    }
    
    if(!toAddressLegacy) {
        this.toastr.info(
            this.translateServ.instant('The format of the payment address is incorrect.'), this.translateServ.instant('Ok'));

        return;            
    }

    const coinType = this.coin;
    if(coinType <= 0) {
      this.toastr.info(
        this.translateServ.instant('Coin is not supported'), this.translateServ.instant('Ok'));

    return;    
    }
    const receiveAddr = this.utilServ.fabToExgAddress(toAddressLegacy);
    if(!receiveAddr) {
      this.toastr.error('Invalid receiver address');
    }
    const args = [
        receiveAddr, 
        coinType, 
        '0x' + new BigNumber(this.amount).shiftedBy(18).toString(16),
        '0x'
    ];
  
    const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();
    const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, coinPoolAddress, abi, args);
    if(ret2 && ret2.success && ret2._body && ret2._body.status == '0x1') {
        this.toastr.success(this.translateServ.instant('Transfer request is pending.'));
    } else {
        this.toastr.error(this.translateServ.instant('Error while transfering your asset'));
    }
    
 
  }

  showReceiveAddress() {
    const initialState = {
      exAddr: this.exAddress
  };          
    
  this.modalRef = this.modalServ.show(ReceiveCoinModal, { initialState });
  }

  showTransactionHisotry() {
    this.transactionHistory = true;
    this.kanbanServ.getTransactionHistory(this.address).subscribe(
      (res: any) => {
          if(res && res.success) {
              this.transactionHistories = res.data;
          }
      }
    );

  }


}
