import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
//import { AlertService } from 'src/app/services/alert.service';
import { CoinService } from 'src/app/services/coin.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { TimerService } from 'src/app/services/timer.service';
import { UtilService } from 'src/app/services/util.service';
import { WalletService } from 'src/app/services/wallet.service';
import { Web3Service } from 'src/app/services/web3.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../shared/modals/password-modal/password-modal.component';
import { ReceiveCoinModal } from './modals/receive-coin/receive-coin.component';
import BigNumber from 'bignumber.js';
import * as exaddr from '../lib/exaddr';
import { KanbanSmartContractService } from '../services/kanban.smartcontract.service';
import { ToastrService } from 'ngx-toastr';
//import { PinNumberModal } from '../shared/modals/pin-number/pin-number.modal';

@Component({
    selector: 'app-bindpay',
    templateUrl: './bindpay.component.html',
    styleUrls: ['./bindpay.component.scss'],
    providers: []
  })

export class BindpayComponent  implements OnInit{
  address: string;
  exAddress: string;
  modalRef: BsModalRef;
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
      private localSt: LocalStorage,
      private web3Serv: Web3Service,
      private modalServ: BsModalService,
      private toastr: ToastrService,
      private timerServ: TimerService,
      private translateServ: TranslateService,
      //private alertServ: AlertService,
      private kanbanServ: KanbanService,
      private kanbanSmartContractServ: KanbanSmartContractService,
      private walletServ: WalletService) {}


  ngOnInit() {
    this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

        if (!wallets || (wallets.length == 0)) {
          return;
        }
        this.wallet = wallets.items[wallets.currentIndex];
  
        this.loadWallet();
  
      });
    /*
    this.wallet = await this.walletServ.getCurrentWallet();
    if (this.wallet) {
        this.address = this.wallet.excoin.receiveAdds[0].address;
        const fabAddress = this.utilServ.exgToFabAddress(this.address);
        this.exAddress = exaddr.toKbpayAddress(fabAddress);
        this.kanbanServ.getBalance(this.address).subscribe((tokens) => {
            console.log('tokens====', tokens);
            this.mytokens = tokens;
        }); 
        this.timerServ.tokens.subscribe(
            (tokens: any) => {

               if(!this.token) {
                   return;
               }
               const coinType = this.token.coinType;
               const newCoins = tokens.filter(item => item.coinType == coinType);
               console.log('coinType==', coinType);
               console.log('newCOins=', newCoins);
                if(newCoins && newCoins.length > 0) {
                    const newCoin = newCoins[0];
                    console.log('newCoin=', newCoin);
                    if(newCoin.unlockedAmount != this.token.unlockedAmount) {
                        this.token.unlockedAmount = newCoin.unlockedAmount;
                    }
                }
            }
        );
    }   
    */
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
    /*
    this.transactionHistory = false;
    if(!this.coin && (this.mytokens.length > 0)) {
        this.coin = this.mytokens[0];
    }
    for (let i = 0; i < this.mytokens.length; i++) {
        if (this.mytokens[i].coinType == this.coin) {
            this.token = this.mytokens[i];
            break;
        }
    }
    if (!this.token) {
        console.log('this.token not found');
        return;
    }
    if (this.amount > this.utilServ.toNumber(this.utilServ.showAmount(this.token.unlockedAmount, 18))) {
        this.alertServ.openSnackBar(this.translateServ.instant('Not enough balance'), this.translateServ.instant('Ok'));

        return;
    }

    this.pinModal.show();
    */
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
        //console.log('toAddressLegacy===', toAddressLegacy);
    } catch(e) {

    }
    
    if(!toAddressLegacy) {
        this.toastr.info(
            this.translateServ.instant('The format of the payment address is incorrect.'), this.translateServ.instant('Ok'));

        return;            
    }

    console.log('this.coin===', this.coin);
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
    
    
    //console.log('transferDo start');

    /*
    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.pin);
    const keyPairsKanban = this.coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);
    let toAddressLegacy = '';
    try {
        toAddressLegacy = exaddr.toLegacyAddress(this.receiverAddress);
        //console.log('toAddressLegacy===', toAddressLegacy);
    } catch(e) {

    }
    
    if(!toAddressLegacy) {
        this.alertServ.openSnackBar(
            this.translateServ.instant('The format of the payment address is incorrect.'), this.translateServ.instant('Ok'));


        return;            
    }

    console.log('toAddressLegacy===', toAddressLegacy);
    const abiHex = this.web3Serv.getTransferFuncABI(this.coin, this.utilServ.fabToExgAddress(toAddressLegacy), this.amount);
    console.log('abiHex for getTransferFuncABI=', abiHex);
    const nonce = await this.kanbanServ.getTransactionCount(keyPairsKanban.address);

    const address = await this.kanbanServ.getCoinPoolAddress();
    const txhex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, address, nonce);
    console.log('txhex=', txhex);
    this.kanbanServ.sendRawSignedTransaction(txhex).subscribe((resp: any) => {
        console.log('resp=', resp);
        if (resp && resp.transactionHash) {

            this.timerServ.checkTokens(keyPairsKanban.address, 10);

            // this.tradeService.saveTransactions(this.openorders);
            // this.kanbanServ.incNonce();

                this.alertServ.openSnackBar(this.translateServ.instant('Transfer request is pending.'), this.translateServ.instant('Ok'));

        }
    },
        (error) => {
            if (error.error) {
                this.alertServ.openSnackBar(error.error, 'Ok');
            }

        });
    */
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

    /*
    
    const address = this.wallet.excoin.receiveAdds[0].address;
    const fabAddress = this.utilServ.exgToFabAddress(address);

    */
  }


}
