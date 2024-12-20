import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { UtilService } from '../../../../services/util.service';
import { KanbanService } from '../../../../services/kanban.service';
import { CoinService } from '../../../../services/coin.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import BigNumber from 'bignumber.js';
import { Signature } from '../../../../interfaces/kanban.interface';
import { Web3Service } from '../../../../services/web3.service';
import { UserReferralService } from '../../../../services/userreferral.service';
import { environment } from '../../../../../environments/environment';
import * as bs58 from 'bs58';
import * as createHash from 'create-hash';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../../shared/modals/password-modal/password-modal.component';
import { Campaign } from '../../../../models/campaign';
import { StarOrder } from '../../../../models/order';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { UserpayService } from 'src/app/services/userpay.service';

@Component({
  selector: 'app-my-asset-dashboard',
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'accent' },
  }],
  templateUrl: './asset-dashboard.component.html',
  styleUrls: ['./asset-dashboard.component.scss', '../../../../../table.scss', '../../../../../select.scss', '../../../../../button.scss']
})
export class MyAssetDashboardComponent implements OnInit {
  btni = 1;
  referral: string;
  walletAdd: string;
  amount: number;
  qrcodeData: string;
  to: string;
  abihex: string;
  balance: number;
  currency: string;
  campaigns: Campaign[];
  campaignsParticipation: boolean[] = [];
  campaignOrders: StarOrder[] = [];
  currentCampaignId: number;
  totalValue = 0;
  paymentMethod = 'DUSD';
  officialUSDTERC20add = '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06';
  officialUSDTTRC20add = 'TH8Agnmc2kp2AfXqUi2uaSMZPPducjyGXR';
  officialDUSDadd = '1FNEhT8uTmrEMvHGCGohnEFv6Q1z4qRhQu';
  officialKbadd = environment.addresses.campaignOfficial.BINPAY;
  chainRadio = 'TRC-20';
  txId = '';
  totalAssetValue = 0;
  reflink = '';
  lan='en';

  coins: any;
  assets: any;
  orderId: string;
  wallets: any;
  modalRef: BsModalRef;
  wallet: any;
  isValidMember: boolean;
  withdrawAmount: number;
  currentCoinId: number;
  gasAmount: number;
  depositAmount: number;
  comment: string;
  link: string;
  fabBalance: number;
  password: string;
  satoshisPerByte: number;
  gasPrice: number;
  gasLimit: number;
  opType: string;
  participated: boolean;
  kanbanGasPrice: number;
  kanbanGasLimit: number;
  isAdvance: boolean;
  sendAmount: number;
  currentCoin: string;
  currentCoinAddress: string;
  walletAddress: string;
  kanbanAddress: string;
  walletBalance: number;
  walletValue: number;
  gas: any;
  currentTab: string;
  errMsg = '';
  dashboardErrMsg = '';

  constructor(
    private modalService: BsModalService,
    private toastr: ToastrService,
    private translateServ: TranslateService,
    private storage: StorageMap,
    public utilServ: UtilService,
    private web3Serv: Web3Service,
    private coinServ: CoinService,
    private kanbanSmartContractServ:KanbanSmartContractService,
    public ngxSmartModalService: NgxSmartModalService,
    private kanbanServ: KanbanService,
    private userreferalSer: UserReferralService,
    private userpaySer: UserpayService,
    private router: Router) {
  }

  async ngOnInit() {
    this.participated = false;
    this.getCampaigns();
    this.to = environment.addresses.smartContract.SEVENSTAR_ENROLLMENT;
    this.amount = 2000;
    this.balance = 0;
    this.currency = 'USD';
    this.gas = 0;
    this.currentTab = 'wallet';
    
    this.storage.get('ecomwallets').subscribe((wallets: any) => {

      if (!wallets || (wallets.length == 0)) {
        this.router.navigate(['/wallet']);
      }
      this.wallets = wallets;
      this.wallet = this.wallets.items[this.wallets.currentIndex];
      this.walletAdd = this.wallet.addresses.filter(c => c.name === 'FAB')[0].address;

      
      this.userreferalSer.checkAddress(this.walletAdd).subscribe(
        (res: any) => {
          if (res) {
            this.participated = res.isValid;
          }
      });

      this.userreferalSer.checkAddress(this.walletAdd).subscribe(
        (ret: any) => {
          this.isValidMember = ret.isValid;
        }
      );

      this.reflink = 'https://pay.cool/ref/' + this.walletAdd;
      this.loadWallet(1);
      this.getMyOrder(1);

      this.storage.watch('7star_ref').subscribe(
        (ref: string) => {
          this.referral = ref;
        }
      );
  
    });

  }

  checkMy7starAssets() {
    const campaignId = 1
    const myOrder = this.campaignOrders[campaignId];
//    alert(JSON.stringify(myOrder))
    if(myOrder && (myOrder.status === 3 || myOrder.status === 4)) {
      this.totalAssetValue = 20000 * 0.58;
    }


    this.kanbanServ.getTiker().then(
      (ret: any) => {
        // alert(JSON.stringify(ret))
        if (ret.data && ret.data['BST_USDT']) {
          // alert(ret.data['BST_USDT'].last);
        }
      }
    ).catch(err => { });

  }

  getTitle(camp: Campaign) {
    if (!camp.titleLan || !camp.titleLan[0]) {
      if (camp.name) {
        return camp.name;
      } else {
        return '';
      }
    }
    const lan = localStorage.getItem('_lan') || 'en';
    this.lan = lan;
    const titleL = camp.titleLan.filter(n => n.lan === lan);
    if (titleL.length > 0) {
      return titleL[0].text;
    } else {
      return '';
    }
  }

  getSubTitle(camp: Campaign) {
    if (!camp.subtitleLan || !camp.subtitleLan[0]) return '';
    const lan = localStorage.getItem('_lan') || 'en';
    this.lan = lan;
    const subTitleL = camp.subtitleLan.filter(n => n.lan === lan);
    if (subTitleL.length > 0) {
      return subTitleL[0].text;
    } else {
      return '';
    }
  }

  getSlogan(camp: Campaign) {
    if (!camp.sloganLan || !camp.sloganLan[0]) return '';

    const lan = localStorage.getItem('_lan') || 'en';
    this.lan = lan;
    if (!camp.sloganLan) return '';
    const sloL = camp.sloganLan.filter(n => n.lan === lan);
    if (sloL.length > 0) {
      return sloL[0].text;
    } else {
      return '';
    }
  }

  getSubslogan(camp: Campaign) {
    if (!camp.subsloganLan || !camp.subsloganLan[0]) return '';

    const lan = localStorage.getItem('_lan') || 'en';
    if (!camp.subsloganLan) return '';
    const sloL = camp.subsloganLan.filter(n => n.lan === lan);
    if (sloL.length > 0) {
      return sloL[0].text;
    } else {
      return '';
    }
  }

  getDesc(camp: Campaign) {
    if (!camp.descLan || !camp.descLan[0]) return '';
    const lan = localStorage.getItem('_lan') || 'en';
    const descL = camp.descLan.filter(n => n.lan === lan);
    if (descL.length > 0) {
      return descL[0].text;
    } else {
      return '';
    }
  }

  getCampaignStatus(camp: Campaign) {
    if (!camp.status) return "Unkown";

    if (camp.status === 0) {
      return "Waitting to start";
    } else if (camp.status === 1) {
      return "In progress";
    } else {
      return "Ended";
    }
  }

  getStatusColor(status: number) {
    if (status === 0) return 'red';
    else if (status === 1) return 'brown';
    else if (status === 3 || status === 4) return 'green';
    else if (status === 5) return 'gray';
    else if (status === 6) return 'orange';
    else return 'white';
  }

  //0: waiting for payment, 1: payment made, 3: payment confirmed 4: completed - coins sent, 5: cancelled, 6: suspended
  getOrderStatus(status: number) {
    if (status === 0) {
      return "Waitting for payment";
    } else if (status === 1) {
      return "Marked as paid";
    } else if (status === 3) {
      return "Payment confirmed";
    } else if (status === 4) {
      return "Completed";
    } else if (status === 5) {
      return "Cancelled";
    } else if (status === 6) {
      return "Suspended";
    } else {
      return "Unknown";
    }
  }

  getCampaigns() {
    this.userpaySer.getCampaigns().toPromise().then(ret => {
      this.campaigns = <Campaign[]>ret;
    }).catch(err => { this.errMsg = err.message; });
  }

  getMyOrder(campaignId: number) {
    /*
    this.walletAdd = '1FAvtXKzgR6SyD9cLgFjUnQUV6G4nce5m6';
    //local
    this.walletAdd = '1Avx8u3ERKmXpVfW4ZPzqfGZQ7nEHVoptB';
    */
    // alert(this.walletAdd)

    /*
    this.starSer.getOrderByAddressCampaignId(this.walletAdd, campaignId).toPromise().then(
      ret => {
        this.campaignsParticipation[campaignId] = true;
        this.campaignOrders[campaignId] = ret as StarOrder;
        this.checkMy7starAssets();
        // alert(JSON.stringify(ret))
      }
    ).catch(
      err => { 
        this.errMsg = err.message;
        this.campaignsParticipation[campaignId] = false; 
      }
    )
    */
  }

  selectCurrency(currency: string) {
    /*
    this.selectedCurrency = currency;
    if(currency == 'FAB') {
      this.amount = Math.ceil(this.payable / this.fabPrice);
    } 
    if(currency == 'EXG') {
      this.amount = Math.ceil(this.payable / this.exgPrice);
    } 
    if(currency == 'BST') {
      this.amount = Math.ceil(this.payable / this.bstPrice);
    }   
    */
  }

  onPaymentMethodSelect(paymethod: string) {
    this.paymentMethod = paymethod;

    this.getPaymentQrcode();
    if(!this.assets || this.assets.length == 0) {
      this.balance = 0;
      return;
    }
    const coinTypeId = this.coinServ.getCoinTypeIdByName(paymethod);
    const selectCoins = this.assets.filter(item => item.coinType == coinTypeId);    
    if(!selectCoins || selectCoins.length == 0) {
      this.balance = 0;
      return;
    }
    const balance = selectCoins[0].unlockedAmount;
    this.balance = Number(this.utilServ.showAmount(balance, 18));
  }

  sendCoin() {
    this.opType = 'sendCoin';
    this.ngxSmartModalService.getModal('sendModal').close();
    this.ngxSmartModalService.getModal('passwordModal').open();
  }

  addGas() {
    if (this.fabBalance <= 0) {
      this.toastr.info(this.translateServ.instant("Not enough FAB in wallet, can not add gas"));
      return;
    }
    this.ngxSmartModalService.getModal('addGasModal').open();
  }

  deposit(coin) {
    this.currentCoin = coin;
    this.ngxSmartModalService.getModal('depositModal').open();
  }

  depositConfirm() {
    this.opType = 'deposit';
    this.ngxSmartModalService.getModal('depositModal').close();
    this.ngxSmartModalService.getModal('passwordModal').open();
  }

  withdraw(coinId, coin) {
    this.currentCoinId = coinId;
    this.currentCoin = coin;
    this.ngxSmartModalService.getModal('withdrawModal').open();
  }

  withdrawConfirm() {
    this.opType = 'withdraw';
    this.ngxSmartModalService.getModal('withdrawModal').close();
    this.ngxSmartModalService.getModal('passwordModal').open();
  }

  addGasConfirm() {
    this.opType = 'addGas';
    this.ngxSmartModalService.getModal('addGasModal').close();
    this.ngxSmartModalService.getModal('passwordModal').open();
  }

  confirmPassword() {
    const pinHash = this.utilServ.SHA256(this.password).toString();
    if (pinHash !== this.wallet.pwdHash) {
      this.warnPwdErr();
      return;
    }
    if (this.opType == 'addGas') {
      this.addGasDo();
    } else if (this.opType == 'sendCoin') {
      this.sendCoinDo();
    } else if (this.opType == 'deposit') {
      this.depositDo();
    } else if (this.opType == 'withdraw') {
      this.withdrawDo();
    }
  }

  async withdrawDo() {
    const amount = this.withdrawAmount;
    const pin = this.password;
    const currentCoin = this.coinServ.formMyCoin(this.wallet.addresses, this.currentCoin);
    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
    if (!seed) {
      this.warnPwdErr();
      return;
    }
    const keyPairsKanban = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const amountInLink = new BigNumber(amount).multipliedBy(new BigNumber(1e18)); // it's for all coins.
    let addressInWallet = currentCoin.receiveAdds[0].address;

    if (currentCoin.name === 'BTC' || currentCoin.name === 'FAB' || currentCoin.name === 'DOGE' || currentCoin.name === 'LTC') {
      const bytes = bs58.decode(addressInWallet);

      addressInWallet = bytes.toString();

    } else if (currentCoin.name === 'BCH') {
      const keyPairsCurrentCoin = this.coinServ.getKeyPairs('BCH', seed, 0, 0, 'b');
      let prefix = '6f';
      if (environment.production) {
        prefix = '00';
      }
      // address = prefix + this.stripHexPrefix(address);
      const addr = prefix + keyPairsCurrentCoin.addressHash;
      const buf = Buffer.from(addr, 'hex');

      const hash1 = createHash('sha256').update(buf).digest().toString('hex');
      const hash2 = createHash('sha256').update(Buffer.from(hash1, 'hex')).digest().toString('hex');

      addressInWallet = addr + hash2.substring(0, 8);
    } else if (currentCoin.tokenType === 'FAB') {
      let fabAddress = '';
      for (let i = 0; i < this.wallet.mycoins.length; i++) {
        const coin = this.wallet.mycoins[i];
        if (coin.name === 'FAB') {
          fabAddress = coin.receiveAdds[0].address;
        }
      }
      if (fabAddress === '') {
        this.toastr.error(this.translateServ.instant('FAB address not found.'));
        /*
          if (this.lan === 'zh') {
              this.alertServ.openSnackBar('没有FAB地址。', 'Ok');
          } else {
              this.alertServ.openSnackBar('FAB address not found.', 'Ok');
          }
          */
        return;
      }
      const bytes = bs58.decode(fabAddress);
      addressInWallet = bytes.toString();
    }

    const abiHex = this.web3Serv.getWithdrawFuncABI(this.currentCoinId, amountInLink, addressInWallet);

    const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();
    const nonce = await this.kanbanServ.getTransactionCount(this.utilServ.fabToExgAddress(keyPairsKanban.address));

    this.gasPrice = Number(this.gasPrice);
    this.gasLimit = Number(this.gasLimit);
    if (this.gasPrice <= 0 || this.gasLimit <= 0) {
      /*
        if (this.lan === 'zh') {
            this.alertServ.openSnackBar('燃料价格或限量错误。', 'Ok');
        } else {
            this.alertServ.openSnackBar('Invalid gas price or gas limit.', 'Ok');
        }
        */
      this.toastr.error(this.translateServ.instant('Invalid gas price or gas limit.'));
      return;
    }
    const options = {
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit
    };

    const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, coinPoolAddress, nonce, 0, options);

    this.kanbanServ.sendRawSignedTransaction(txKanbanHex).subscribe((resp: any) => {

      if (resp && resp.transactionHash) {
        this.toastr.error(this.translateServ.instant('Your withdraw request is pending.'));

      } else {
        this.toastr.error(this.translateServ.instant('Errors happened, please try again.'));

      }
    });
  }

  async addGasDo() {
    const amount = this.gasAmount;
    const pin = this.password;

    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
    if (!seed) {
      this.warnPwdErr();
      return;
    }
    const scarAddress = await this.kanbanServ.getScarAddress();

    const currentCoin = this.coinServ.formMyCoin(this.wallet.addresses, 'FAB');
    const { txHash, errMsg } = await this.coinServ.depositFab(scarAddress, seed, currentCoin, amount);
    if (errMsg) {
      this.toastr.error(errMsg);
    } else {
      this.ngxSmartModalService.getModal('passwordModal').close();
      this.toastr.info(this.translateServ.instant('Add gas transaction was submitted successfully, please check gas balance 40 minutes later.'));
    }
  }

  async depositDo() {
    const currentCoin = this.currentCoin;

    const amount = this.depositAmount;
    const pin = this.password;

    const coinType = this.coinServ.getCoinTypeIdByName(currentCoin);

    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
    if (!seed) {
      this.warnPwdErr();
      return;
    }

    const myCoin = this.coinServ.formMyCoin(this.wallet.addresses, currentCoin);
    let keyPairs = this.coinServ.getKeyPairs(myCoin.tokenType ? myCoin.tokenType : myCoin.name, seed, 0, 0, 'b');
    keyPairs.tokenType = myCoin.tokenType;
    const officalAddress = this.coinServ.getOfficialAddress(currentCoin);
    if (!officalAddress) {

      this.toastr.error(this.translateServ.instant('offical address is unavailable'));
      return;
    }


    const keyPairsKanban = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');

    const addressInKanban = this.utilServ.fabToExgAddress(keyPairsKanban.address);

    const doSubmit = false;
    const options = {
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit,
      satoshisPerBytes: this.satoshisPerByte
    };

    const { txHex, txHash, errMsg, amountInTx, txids } = await this.coinServ.sendTransaction(
      this.coinServ.formMyCoin(this.wallet.addresses, currentCoin), seed, officalAddress,
      amount, options, doSubmit
    );

    if (errMsg) {
      this.toastr.error(errMsg);
      return;
    }

    if (!txHex) {
      this.toastr.error(this.translateServ.instant('Internal error for txHex'));
      return;
    }

    if (!txHash) {
      this.toastr.error(this.translateServ.instant('Internal error for txHash'));
      return;
    }
    const amountInLink = new BigNumber(amount).multipliedBy(new BigNumber(1e18)); // it's for all coins.

    const amountInLinkString = amountInLink.toFixed();
    const amountInTxString = amountInTx.toFixed();

    if (amountInLinkString.indexOf(amountInTxString) === -1) {
      /*
        if (this.lan === 'zh') {
            this.alertServ.openSnackBar('转账数量不相等', 'Ok');
        } else {
            this.alertServ.openSnackBar('Inequal amount for deposit', 'Ok');
        }
        */
      this.toastr.error(this.translateServ.instant('Inequal amount for deposit'));
      return;
    }

    const subString = amountInLinkString.substr(amountInTxString.length);
    if (subString && Number(subString) !== 0) {
      this.toastr.error(this.translateServ.instant('deposit amount not the same'));
      return;
    }

    const originalMessage = this.coinServ.getOriginalMessage(coinType, this.utilServ.stripHexPrefix(txHash)
      , amountInLink, this.utilServ.stripHexPrefix(addressInKanban));

    const signedMessage: Signature = this.coinServ.signedMessage(originalMessage, keyPairs);


    const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();
    const abiHex = this.web3Serv.getDepositFuncABI(coinType, txHash, amountInLink, addressInKanban, signedMessage);

    const nonce = await this.kanbanServ.getTransactionCount(addressInKanban);

    const optionsKanban = {
      gasPrice: this.kanbanGasPrice,
      gasLimit: this.kanbanGasLimit,
    };
    const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, coinPoolAddress, nonce, 0, optionsKanban);

    this.kanbanServ.submitDeposit(txHex, txKanbanHex).subscribe((resp: any) => {

      if (resp && resp.data && resp.data.transactionID) {


        this.ngxSmartModalService.getModal('passwordModal').close();
        this.toastr.info(this.translateServ.instant('Moving fund to DEX was submitted, please wait for ')
          + environment.depositMinimumConfirmations[currentCoin] + this.translateServ.instant('confirmations.'));
      } else if (resp.error) {
        this.toastr.error(resp.error);
      }
    },
      error => {

        if (error.error && error.error.error) {
          this.toastr.error(error.error.error);
          //this.alertServ.openSnackBar(error.error.error, 'Ok');
        } else if (error.message) {
          this.toastr.error(error.message);
          //this.alertServ.openSnackBar(error.message, 'Ok');
        }
      }
    );
  }

  async sendCoinDo() {
    const pin = this.password;
    const currentCoin = this.currentCoin;

    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);

    const amount = this.sendAmount;
    const doSubmit = true;
    const options = {
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit,
      satoshisPerBytes: this.satoshisPerByte
    };
    const { txHex, txHash, errMsg, txids } = await this.coinServ.sendTransaction(
      this.coinServ.formMyCoin(this.wallet.addresses, currentCoin), seed,
      this.to.trim(), amount, options, doSubmit
    );
    if (errMsg) {
      this.toastr.error(errMsg);
      return;
    }
    if (txHex && txHash) {
      this.toastr.info(this.translateServ.instant('your transaction was submitted successful, please wait a while to check status.'));
      this.ngxSmartModalService.getModal('passwordModal').close();

    }
  }

  warnPwdErr() {
    this.toastr.error(this.translateServ.instant('Your password is invalid.'));
  }

  onCoinChange(newCoin) {
    this.currentCoin = newCoin;
    this.currentCoinAddress = this.getCurrentCoinAddress();
  }

  changeTab(tabName: string) {
    this.errMsg = '';
    this.currentTab = tabName;
  }

  onChange(value) {
    this.errMsg = '';

    this.wallet = this.wallets.items.filter(item => (item.id == value))[0];

    this.wallets.currentIndex = this.wallets.items.indexOf(this.wallet);

    this.storage.set('ecomwallets', this.wallets).subscribe(() => {
      this.loadWallet(1);
    });
  }

  getCurrentCoinAddress() {
    const addresses = this.wallet.addresses;
    let fabAddress = '';
    let ethAddress = '';
    for (let i = 0; i < addresses.length; i++) {
      const addr = addresses[i];
      if (addr.name == this.currentCoin) {
        return addr.address;
      }
      if (addr.name == 'FAB') {
        fabAddress = addr.address;
      }
      if (addr.name == 'ETH') {
        ethAddress = addr.address;
      }
    }

    if (
      ['EXG', 'DUSD', 'USDT', 'DCAD', 'DCNY', 'DJPY', 'DGBP', 
      'DEURO', 'DAUD', 'DMYR', 'DKRW', 'DPHP', 
      'DTHB', 'DTWD', 'DSGD', 'DHKD', 'DINR', 'BST', 'DSC',
      'DMXN', 'DBRL', 'DNGN', 'BTC', 'ETH', 'FAB'].indexOf(this.currentCoin) >= 0) {
      return fabAddress;
    }
    return ethAddress;
  }

  addWallet() {
    this.router.navigate(['/wallet/create']);
  }

  loadWallet(campaignId: number) {
    const addresses = this.wallet.addresses;
    const walletAddressItem = addresses.filter(item => item.name == 'FAB')[0];
    this.walletAddress = walletAddressItem.address;
    /*
    this.starSer.getOrderByAddressCampaignId(this.walletAddress, campaignId).subscribe(
      (res: any) => {
        this.orderId = res._id;
      }
    );
    */
    this.walletAdd = this.walletAddress;
    this.kanbanAddress = this.utilServ.fabToExgAddress(this.walletAddress);
    this.refreshGas();
    this.refreshAssets();
    this.kanbanServ.getWalletBalances(addresses).subscribe(
      (res: any) => {
        if (res && res.success) {
          this.coins = res.data.filter(item => ((item.coin != 'CAD') && (item.coin != 'RMB')));
          const exgCoin = this.coins.filter(item => item.coin == 'EXG')[0];
          const fabCoin = this.coins.filter(item => item.coin == 'FAB')[0];
          this.fabBalance = fabCoin.balance;
          this.currentCoin = exgCoin.coin;
          this.currentCoinAddress = this.getCurrentCoinAddress();
          this.walletBalance = Number(exgCoin.balance) + Number(exgCoin.lockBalance);
          this.walletValue = this.walletBalance * exgCoin.usdValue.USD;
        }
      }
    );
  }

  dlDataUrlBin() {
    const y = document.getElementById('address_qr_code').getElementsByTagName('canvas')[0];
    if (y) {
      var link = y.toDataURL("image/png");
      this.link = link;
    }

  }

  refreshAssets() {
    this.kanbanServ.getExchangeBalance(this.kanbanAddress).subscribe(
      (resp: any) => {
        this.assets = resp;
      },
      error => {
      }
    );
  }

  refreshGas() {
    this.kanbanServ.getKanbanBalance(this.kanbanAddress).subscribe(
      (resp: any) => {
        const fab = this.utilServ.stripHexPrefix(resp.balance.FAB);
        this.gas = this.utilServ.hexToDec(fab) / 1e18;
      },
      error => {
      }
    );
  }

  enrollAsCustomer() {
    if(!this.referral) {
      this.toastr.info('Referral address is empty.');
      return;      
    }

    if(this.referral == this.walletAddress) {
      this.toastr.info('You cannot refer yourself.');
      return;
    }
    this.userreferalSer.checkAddress(this.referral).subscribe(
      (ret: any) => {
        if(ret && ret.isValid) {
          this.modalRef.hide();
          const initialState = {
            pwdHash: this.wallet.pwdHash,
            encryptedSeed: this.wallet.encryptedSeed
          };          
          
          this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
      
          this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
            this.joinAsMemberDo(privateKey);
          }); 
        } else {
          this.toastr.error('ref address is not registered.');
        }
      }
    );

  }

  joinAsMemberDo(privateKey: any) {
    const data = {
      parentId: this.referral
    };

    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature; 
    this.userpaySer.createRef(data).subscribe(
      (ret: any) => {
        if(ret && ret._id) {
          this.isValidMember = true;
          this.toastr.success('You join as a customer successfully.');
        }
      }
    );    
  }

  enroll(template: TemplateRef<any>, campaignId: number) {
    this.onPaymentMethodSelect('DUSD');
    this.errMsg = '';
    this.currentCampaignId = campaignId;
    this.modalRef = this.modalService.show(template);
  }

  makepayment(template: TemplateRef<any>, campaignId: number) {
    this.errMsg = '';
    this.currentCampaignId = campaignId;
    this.modalRef = this.modalService.show(template);
  }

  confirmPayment(template: TemplateRef<any>, campaignId: number) {
    this.errMsg = '';
    this.currentCampaignId = campaignId;
    this.modalRef = this.modalService.show(template);
  }

  createOrderDo() {
    this.userpaySer.createOrder(
      {
        walletAdd: this.walletAdd,
        amount: this.amount,
        currency: this.currency,
        referral: this.referral,
        campaignId: this.currentCampaignId
      }
    ).subscribe(
      (res: any) => {
        if (res && res._id) {
          this.modalRef.hide();
          this.orderId = res._id;
          this.router.navigate(['/order/' + res._id]);
        }
      },

      (error) => {
        this.toastr.error(error.error.text);
      }
    );
  }

  placeOrder() {
    this.errMsg = '';
    if(!this.walletAdd || !this.referral) return;

    if (this.referral.toLowerCase() === this.walletAdd.toLowerCase()) {
      this.errMsg = "You can't use your own referral code";
      return;
    }

    if (this.referral && this.referral.length > 32) {
      this.userreferalSer.checkAddress(this.referral).subscribe(
        (res: any) => {
          if (res && res.isValid || !environment.production) {
            this.createOrderDo();
          } else {
            this.errMsg = 'Invalid referral code';
            this.toastr.error('invalid referral code');
          }

        },
        err => { this.errMsg = err.message;  }
      );
    } else {
    }
  }

  createPayment() {
    this.errMsg = '';
    this.orderId = this.campaignOrders[1]._id;
    // alert('orderId: ' + this.orderId + ', paymentmethod: ' + this.paymentMethod + ', amount: ' + this.amount + ', txId: ' + this.txId);
    this.userpaySer.addPayment(this.orderId, this.paymentMethod, this.amount, this.txId).toPromise().then(
      ret => {
        if (ret['status'] === 208) {
          this.errMsg = "Can't make duplicate payment";
        } else {
          this.modalRef.hide();
          this.getMyOrder(1);
        }
      }
    ).catch(
      err => { this.errMsg = err.message; }
    );
  }

  getPaymentQrcode() {
    const abi = {
      "constant": false,
      "inputs": [
        {
          "name": "_walletAddr",
          "type": "address"
        },
        {
          "name": "_referral",
          "type": "address"
        },
        {
          "name": "_coinType",
          "type": "uint32"
        }
      ],
      "name": "transferToJoin",
      "outputs": [
        
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };

    let referral = this.referral;
    if(!referral) {
      return;
    }
    if(referral && (referral.indexOf('0x') < 0)) {
      referral = this.utilServ.fabToExgAddress(referral);
    }
    this.abihex = this.web3Serv.getGeneralFunctionABI(abi, 
      [
        this.utilServ.fabToExgAddress(this.walletAdd), 
        referral, 
        this.coinServ.getCoinTypeIdByName(this.paymentMethod)
      ]);
    const qrcodeData = {
      to: this.to,
      data: this.abihex,
      name: this.translateServ.instant('Sevenstar')
    };
    this.qrcodeData = JSON.stringify(qrcodeData);
  }
  pay() {

    if(this.balance < 2000) {
      this.toastr.info('Not enough balance to make this transaction.');
      return;
    }

    if(this.gas < 0.0001) {
      this.toastr.info('Not enough Gas to make this transaction.');
      return;
    }    

    this.modalRef.hide();
    const initialState = {
      coins: this.coins,
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {

      const ret = await this.kanbanSmartContractServ.execSmartContractAbiHex(seed, this.to, this.abihex);
      //const txid = ret.transactionHash;
      if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
        const txid = ret._body.transactionHash;
        this.toastr.success('Transaction was made, txid is: ' + txid);
        this.userpaySer.savePayment(this.walletAdd, txid).subscribe(
          (ret) => {

          }
        );
      } else {
        this.toastr.success('Error while doing payment process');
      }
      
    });    
  }
}
