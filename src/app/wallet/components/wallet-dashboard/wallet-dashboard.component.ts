import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UtilService } from '../../../services/util.service';
import { KanbanService } from '../../../services/kanban.service';
import { CoinService } from '../../../services/coin.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { TimerService } from '../../../services/timer.service';
import { StarService } from '../../../services/star.service';
import { LoginSettingModal } from '../../modals/login-setting/login-setting.modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ReceiveComponent } from '../../modals/receive/receive.component';
import { SendComponent } from '../../modals/send/send.component';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { StorageService } from 'src/app/services/storage.service';
import { TransactionItem } from '../../../models/transaction-item';
import { MyCoin } from 'src/app/models/mycoin';
import { WalletService } from 'src/app/services/wallet.service';
import { ShowSeedPhraseModal } from '../../modals/show-seed-phrase/show-seed-phrase.modal';
import { GetFreeFabModal } from '../../modals/get-free-fab/get-free-fab.modal';
import { UserReferralService } from 'src/app/services/userreferral.service';

@Component({
  selector: 'app-wallet-dashboard',
  providers: [],
  templateUrl: './wallet-dashboard.component.html',
  styleUrls: [
    './wallet-dashboard.component.scss', 
    '../../../../select.scss', 
    '../../../../button.scss'
  ]
})
export class WalletDashboardComponent implements OnInit {
  /*
  fabPrice: number;
  exgPrice: number;
  bstPrice: number;
  amount: number;
  payable: number;
  selectedCurrency: string;
  */

  btni = 1;
  lan: string;
  tab: string;
  referral: string;
  walletAdd: string;
  rewards: any;
  amount: number;
  currency: string;
  currentCoin: string;
  transactionHistories: any;
  merchantTransactionHistories: any;

  sendCoinParams: any;

  addresses: any;
  coins: any;
  orderId: string;
  wallets: any;
  modalRef: BsModalRef;
  wallet: any;
  withdrawAmount: number;
  currentCoinId: number;
  gasAmount: number;
  depositAmount: number;
  fabBalance: number;
  to: string;
  opType: string;
  walletAddress: string;
  kanbanAddress: string;
  walletBalance: number;
  transactions: any;
  assets: any;
  walletValue: number;
  gas: number;
  errMsg = '';

  constructor(
    private walletServ: WalletService,
    private modalServ: BsModalService,
    private toastr: ToastrService,
    private storageService: StorageService,
    private translateServ: TranslateService,
    private localSt: LocalStorage,
    public utilServ: UtilService,
    private timerServ: TimerService,
    private coinServ: CoinService,
    private kanbanServ: KanbanService,
    private starSer: StarService,
    private userreferralServ: UserReferralService,
    private router: Router) {
  }

  ngOnInit() {

    this.lan = this.translateServ.currentLang;
    this.tab = 'wallet_assets';
    this.localSt.getItem('7star_ref').subscribe(
      (ref: string) => {
        this.referral = ref;
      }
    );
    this.amount = 2000;
    this.currency = 'USD';
    this.gas = 0;
    this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

      if (!wallets || (wallets.length == 0)) {
        return;
      }
      this.wallets = wallets;
      this.wallet = this.wallets.items[this.wallets.currentIndex];

      this.loadWallet();

    });
  }

  receive() {
    const initialState = {
      addresses: this.addresses,
      coins: this.coins
    }
    this.modalRef = this.modalServ.show(ReceiveComponent, {initialState});
  }



  getFreeGas() {
    const initialState = {
      address: this.walletAdd
    }
    this.modalRef = this.modalServ.show(GetFreeFabModal, {initialState});    
  }

  async checkAmount(seed) {
    //this.sendCoinParams
    //this.coins
    let fabBalance = 0;
    let ethBalance = 0;
    let btcBalance = 0;
    let trxBalance = 0;

    const amount = this.sendCoinParams.sendAmount;
    const currentCoin = this.sendCoinParams.currentCoin;
    const mycoin = this.coinServ.formMyCoin(this.addresses, currentCoin);
    const to = this.sendCoinParams.to;
    const options = {
      gasPrice: this.sendCoinParams.gasPrice,
      gasLimit: this.sendCoinParams.gasLimit,
      satoshisPerBytes: this.sendCoinParams.satoshisPerByte,
      feeLimit: this.sendCoinParams.feeLimit,
      getTransFeeOnly: true
    };
    const { transFee, tranFeeUnit } = await this.coinServ.sendTransaction(
      mycoin, seed,
      to, amount, options, false
    );    
    console.log('amount=', amount);
    console.log('transFee=', transFee);
    console.log('tranFeeUnit=', tranFeeUnit);
    for (let i = 0; i < this.wallet.mycoins.length; i++) {
        if (this.wallet.mycoins[i].name === 'FAB' && !fabBalance) {
            fabBalance = this.wallet.mycoins[i].balance;
        } else if (this.wallet.mycoins[i].name === 'ETH' && !ethBalance) {
            ethBalance = this.wallet.mycoins[i].balance;
        } else if (this.wallet.mycoins[i].name === 'BTC' && !btcBalance) {
            btcBalance = this.wallet.mycoins[i].balance;
        } else if (this.wallet.mycoins[i].name === 'TRX' && !trxBalance) {
            trxBalance = this.wallet.mycoins[i].balance;
        }
    }

    console.log('ethBalance=', ethBalance);
    console.log('transFee=', transFee);
    const currentCoinBalance = this.coins.filter(item => item.coin == currentCoin)[0].balance;

    if(mycoin.tokenType) {
      if(currentCoinBalance < amount) {
        if (this.lan === 'zh') {
          this.toastr.error(currentCoin + '余额不足', 'Ok');
        } else {
            this.toastr.error('Insufficient ' + currentCoin + ' for this transaction', 'Ok');
        }  
      }
      else if(
        ((tranFeeUnit == 'ETH') && (ethBalance < transFee))
        || ((tranFeeUnit == 'FAB') && (fabBalance < transFee))
        || ((tranFeeUnit == 'TRX') && (trxBalance < transFee))
      ) {
        if (this.lan === 'zh') {
          this.toastr.error(tranFeeUnit + '余额不足', 'Ok');
        } else {
            this.toastr.error('Insufficient ' + tranFeeUnit + ' for this transaction', 'Ok');
        }  
      }
    } else {
      if(currentCoinBalance < amount + transFee) {
        if (this.lan === 'zh') {
          this.toastr.error(currentCoin + '余额不足', 'Ok');
        } else {
            this.toastr.error('Insufficient ' + currentCoin + ' for this transaction', 'Ok');
        }        
      }
    }
    return true;
}

  send() {
    const initialState = {
      coins: this.coins,
      addresses: this.addresses
    }
    this.modalRef = this.modalServ.show(SendComponent, {initialState});

    this.modalRef.content.onClose.subscribe(result => {
      this.sendCoinParams = result;
      //console.log('results', result);
      const initialState = {
        coins: this.coins,
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

      this.modalRef.content.onClose.subscribe( (seed: Buffer) => {

        this.kanbanServ.getWalletBalances(this.addresses).subscribe(
          (res: any) => {
            console.log('res for getWalletBalances=', res);
            if (res && res.success) {
              this.coins = res.data.filter(item => ((item.coin != 'CAD') && (item.coin != 'RMB')));
              if(!this.checkAmount(seed)) {
                return;
              }
              this.sendCoinDo(seed);
            }
          });        
        
      });      
    });    
  }

  async sendCoinDo(seed: Buffer) {
    const currentCoin = this.sendCoinParams.currentCoin;

    const amount = this.sendCoinParams.sendAmount;
    const to = this.sendCoinParams.to.trim();
    const doSubmit = true;
    const options = {
      gasPrice: this.sendCoinParams.gasPrice,
      gasLimit: this.sendCoinParams.gasLimit,
      satoshisPerBytes: this.sendCoinParams.satoshisPerByte,
      feeLimit: this.sendCoinParams.feeLimit
    };
    const mycoin: MyCoin = this.coinServ.formMyCoin(this.wallet.addresses, currentCoin);
    const { txHex, txHash, errMsg, txids } = await this.coinServ.sendTransaction(
      mycoin, seed,
      to, amount, options, doSubmit
    );
    if (errMsg) {
      this.toastr.error(errMsg);
      return;
    }
    if (txHex && txHash) {
      this.toastr.info(
        this.translateServ.instant('your transaction was submitted successful, please wait a while to check status.'));
      //this.ngxSmartModalService.getModal('passwordModal').close();
      
      const item:TransactionItem = {
          walletId: this.wallet.id,
          type: 'Send',
          coin: currentCoin,
          tokenType: mycoin.tokenType,
          amount: amount,
          txid: txHash,
          to: this.to,
          time: new Date(),
          confirmations: '0',
          blockhash: '',
          comment: this.sendCoinParams.comment,
          status: 'pending'
      };
      this.timerServ.transactionStatus.next(item);
      this.timerServ.checkTransactionStatus(item);
      this.storageService.storeToTransactionHistoryList(item);
      
    }
  }

  warnPwdErr() {
    this.toastr.error(this.translateServ.instant('Your password is invalid.'));
  }


  changeTab(tabName: string) {
    this.tab = tabName;

    if(tabName == 'historyCustomer') {
      this.starSer.getTransactionHisotryForCustomer(this.walletAddress).subscribe(
        (ret: any) => {
          if(ret && ret.ok) {
            this.transactionHistories = ret._body;
          }
        }
      );
    } else
    if(tabName == 'historyMerchant') {
      this.starSer.getTransactionHisotryForMerchant(this.walletAddress).subscribe(
        (ret: any) => {
          if(ret && ret.ok) {
            this.merchantTransactionHistories = ret._body;
          }
        }
      );        
    } else
    if(tabName == 'rewards') {
      this.starSer.getLockers(this.walletAddress).subscribe(
        (resp: any) => {
          console.log('resp for rewards=', resp);
          if(resp && resp.ok) {
            this.rewards = resp._body;
            console.log('this.rewards===', this.rewards);
          }
        }
      );
    }
  }

  onChange(value) {
    console.log('value==', value);

    this.wallet = this.wallets.items.filter(item => (item.id == value))[0];

    this.wallets.currentIndex = this.wallets.items.indexOf(this.wallet);

    this.localSt.setItem('ecomwallets', this.wallets).subscribe(() => {
      this.walletServ.refreshWallets(this.wallets);
      this.loadWallet();
    });
  }



  addWallet() {
    this.router.navigate(['/wallet/create']);
  }

  loadWallet() {
    const addresses = this.wallet.addresses;
    this.addresses = addresses;
    const walletAddressItem = addresses.filter(item => item.name == 'FAB')[0];
    this.walletAddress = walletAddressItem.address;
    this.starSer.getOrderByAddressCampaignId(this.walletAddress, 1).subscribe(
      (res: any) => {
        this.orderId = res._id;
      }
    );
    this.walletAdd = this.walletAddress;
    this.kanbanAddress = this.utilServ.fabToExgAddress(this.walletAddress);
    this.refreshGas();
    this.refreshAssets();

    this.coinServ.getTransactionHistoryEvents(addresses).subscribe(
      (res: any) => {
          if (res && res.success) {
              const data = res.data;
              this.transactions = data;
          }
      }
    ); 

    this.kanbanServ.getWalletBalances(addresses).subscribe(
      (res: any) => {
        console.log('res for getWalletBalances=', res);
        if (res && res.success) {
          this.coins = res.data.filter(item => ((item.coin != 'CAD') && (item.coin != 'RMB')));
          const exgCoin = this.coins.filter(item => item.coin == 'EXG')[0];
          const fabCoin = this.coins.filter(item => item.coin == 'FAB')[0];
          this.fabBalance = fabCoin.balance;
          console.log('fabCoin==', fabCoin);
          this.currentCoin = exgCoin.coin;
          //this.currentCoinAddress = this.getCurrentCoinAddress();
          this.walletBalance = Number(exgCoin.balance) + Number(exgCoin.lockBalance);
          this.walletValue = this.walletBalance * exgCoin.usdValue.USD;
        }
      }
    );
  }



  refreshAssets() {
    this.kanbanServ.getExchangeBalance(this.kanbanAddress).subscribe(
      (resp: any) => {
        this.assets = resp;
        console.log('this.assets=', this.assets);
      },
      error => {
        // console.log('errorrrr=', error);
      }
    );
  }

  refreshGas() {
    this.kanbanServ.getKanbanBalance(this.kanbanAddress).subscribe(
      (resp: any) => {
        // console.log('resp=', resp);
        const fab = this.utilServ.stripHexPrefix(resp.balance.FAB);
        this.gas = this.utilServ.hexToDec(fab) / 1e18;
      },
      error => {
        // console.log('errorrrr=', error);
      }
    );
  }

  enroll(template: TemplateRef<any>) {
    this.modalRef = this.modalServ.show(template);
  }

  createOrderDo() {
    this.starSer.createOrder(
      {
        walletAdd: this.walletAdd,
        amount: this.amount,
        currency: this.currency,
        referral: this.referral
      }
    ).subscribe(
      (res: any) => {
        if (res && res._id) {
          this.modalRef.hide();
          this.router.navigate(['/order/' + res._id]);
        }
      },

      (error) => {
        console.log('error=', error);
        this.toastr.error(error.error.text);
      }
    );
  }

  loginSetting() {

      const initialState = {
        coins: this.coins,
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

      this.modalRef.content.onClosePin.subscribe( (pin: string) => {
        this.modalRef = this.modalServ.show(LoginSettingModal);
        this.modalRef.content.onClose.subscribe( (newPassword: string) => {
          console.log('old wallet===', this.wallet);
          this.wallet = this.walletServ.updateWalletPassword(this.wallet, pin, newPassword);
          console.log('new wallet===', this.wallet);
          this.walletServ.updateToWalletList(this.wallet, this.wallets.currentIndex);
          console.log('currentIndex===', this.wallets.currentIndex);
          this.toastr.info(
            this.translateServ.instant('Your password was changed successfully'),
            this.translateServ.instant('Ok'));
        });
      }); 
    
  }

  showSeedPhrase() {
    const initialState = {
      coins: this.coins,
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClosePin.subscribe( (pin: string) => {
      const seedPhrase = this.utilServ.aesDecrypt(this.wallet.encryptedMnemonic, pin);
      const initialState = {
        seedPhrase
      };
      this.modalRef = this.modalServ.show(ShowSeedPhraseModal, { initialState });     
    });

  }


  deleteWallet() {
    const initialState = {
      coins: this.coins,
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClosePin.subscribe( (pin: string) => {

      this.wallets.items.splice(this.wallets.currentIndex, 1);
      if(this.wallets.items.length > 0) {
        this.wallets.currentIndex = 0;
      } else {
        this.wallets.currentIndex = -1;
      }

      this.walletServ.updateWallets(this.wallets).subscribe((res: any) => {
        this.walletServ.refreshWallets(this.wallets);
        this.toastr.info(
          this.translateServ.instant('Your wallet was deleted successfully'),
          this.translateServ.instant('Ok')); 
      });
     
    });
  }




  placeOrder() {
    if (this.referral && this.referral.length > 36) {
      this.userreferralServ.checkAddress(this.referral).subscribe(
        (res: any) => {
          if (res && res.isValid) {
            this.createOrderDo();
          } else {
            this.toastr.error('invalid referral');
          }

        },
        err => { this.errMsg = err.message; console.log(err.message) }
      );
    } else {
      this.createOrderDo();
    }
  }
}
