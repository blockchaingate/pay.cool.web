import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { StarService } from '../../../../services/star.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../services/api.service';
import { KanbanService } from '../../../../services/kanban.service';
import { UtilService } from '../../../../services/util.service';
import { CoinService } from '../../../../services/coin.service';
import { TranslateService } from '@ngx-translate/core';
import { UserReferralService } from '../../../../services/userreferral.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  @Input() id: string;
  order: any;
  password: string;
  payment_id: string;
  payment: any;
  accountName: string;
  goPayStep: number;
  txid: string;
  wallet: any;
  _currentCoin: string;

  get currentCoin(): string {
    return this._currentCoin;
  }

  set currentCoin(val: string) {
    this._currentCoin = val;

    if(val == 'DUSD') {
      this.receivingAddress = environment.addresses.campaignOfficial.FAB;
      this.gasPrice = environment.chains.FAB.gasPrice;
      this.gasLimit = environment.chains.FAB.gasLimit;
      this.satoshisPerBytes = environment.chains.FAB.satoshisPerBytes;
    }

    if(val == 'USDTX') {
      this.receivingAddress = environment.addresses.campaignOfficial.TRX;
      this.feeLimit = environment.chains.TRX.feeLimit;
    }
    
    if(val == 'USDT') {
      this.receivingAddress = environment.addresses.campaignOfficial.ETH;
      this.gasPrice = environment.chains.ETH.gasPrice;
      this.gasLimit = environment.chains.ETH.gasLimitToken;
    } 
  }  

  gasPrice: number;
  gasLimit: number;
  satoshisPerBytes: number;
  feeLimit: number;

  receivingAddress: string;
  modalRef: BsModalRef;
  referral: string;
  // wallets: any;
  // wallet: any;
  walletAdd: string;
  amount = 2000;
  coins: any;
  currency = 'USD';

  errMsg = '';

  constructor(
    private translateServ: TranslateService,
    private coinServ: CoinService,
    private utilServ: UtilService,
    private kanbanServ: KanbanService,
    private apiServ: ApiService,
    private toastr: ToastrService,
    private userreferalServ: UserReferralService,
    private modalService: BsModalService,
    private starServ: StarService, 
    private storage: StorageMap,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    
    this.goPayStep = 1;
    if(this.id) {
      this.getOrderById();
    }

    this.getWalletAddress();

    
    let sub = this.route.params.subscribe((params: Params) => {
        this.id = params['id'];
        this.getOrderById();
    });
  }

  getWalletAddress() {
    this.storage.watch('ecomwallets').subscribe((wallets: any) => {

      if (!wallets || (wallets.length == 0)) {
        return;
      }
      const wallet = wallets.items[wallets.currentIndex];
      this.wallet = wallet;
      const walletAddressItem = wallet.addresses.filter(item => item.name == 'FAB')[0];

      this.walletAdd = walletAddressItem.address;

      const addresses = wallet.addresses;
      this.kanbanServ.getWalletBalances(addresses).subscribe(
        (res: any) => {
          if (res && res.success) {
            this.coins = res.data.filter(item => (item.coin.indexOf('USDT') >= 0) || item.coin.indexOf('DUSD') >= 0);

          }
        }
      );      
    });

  }

  getOrderById() {
    this.starServ.getOrder(this.id).subscribe(
      (res: any) => {
        if(res['walletAdd']) {
          this.order = res;
        }
      }
    );

    this.starServ.getPayment(this.id).subscribe(
      (res: any) => {
        this.payment = res;
      }          
    );
  }
  
  async transferDo() {

    const pin = this.password;
    const currentCoin = this.currentCoin;

    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);

    const amount = this.order.amount;
    const doSubmit = true;
    

    const myCoin = this.coinServ.formMyCoin(this.wallet.addresses, currentCoin);

    const options = {
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit,
      satoshisPerBytes: this.satoshisPerBytes,
      feeLimit: this.feeLimit
    };
    const { txHex, txHash, errMsg, txids } = await this.coinServ.sendTransaction(
      myCoin , seed,
      this.receivingAddress.trim(), amount, options, doSubmit
    );
    if (errMsg) {
      this.toastr.error(errMsg);
      return;
    }

    if (txHash) {

       this.txid = txHash;
       this.confirmPaymentDone('Wallet-' + currentCoin);
    }
  }


  confirmPassword() {

    const addresses = this.wallet.addresses;
    this.kanbanServ.getWalletBalances(addresses).subscribe(
      (res: any) => {
        if (res && res.success) {
          const data = res.data;
          this.coins = data.filter(item => (item.coin == this.currentCoin));
          const coin = this.coins[0];
          if(coin.balance < this.order.amount) {
            this.toastr.info(
              this.translateServ.instant('Not enough ' + this.currentCoin)
            );      
            return;      
          }

          if(this.currentCoin == 'USDT') {
            const eth = data.filter(item => (item.coin == 'ETH'))[0];
            if(eth.balance < this.gasPrice * this.gasLimit / 1e9) {
              this.toastr.info(
                this.translateServ.instant('Not enough ETH')
              );      
              return;                
            }
          }

          if(this.currentCoin == 'USDTX') {
            const tron = data.filter(item => (item.coin == 'TRX'))[0];
            if(tron.balance < this.feeLimit) {
              this.toastr.info(
                this.translateServ.instant('Not enough TRX')
              );      
              return;                
            }            
          }

          if(this.currentCoin == 'DUSD') {
            const fab = data.filter(item => (item.coin == 'FAB'))[0];
            if(fab.balance < 2) {
              this.toastr.info(
                this.translateServ.instant('Not enough FAB')
              );      
              return;                
            }            
          }  
          
          this.transferDo();
        }
      }
    );

  }

  payWithDUSD(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  payWithWallet(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  confirmWalletPayment(template: TemplateRef<any>) {
    this.modalRef.hide();
    this.modalRef = this.modalService.show(template);
  }

  confirmPayment(template: TemplateRef<any>) {
    this.modalRef.hide();
    this.modalRef = this.modalService.show(template);
  }

  confirmPaymentDone(type: string) {
    this.starServ.addPayment(this.id, type, this.order.amount, this.txid).subscribe(
      (res: any) => {
        if(res && res._id) {
          this.payment = res;
          this.payment_id = res._id;

          this.modalRef.hide();
          
          this.toastr.success('Updated payment successfully', 'Ok');
          this.changePaymentStatus(1);
        }
      }
    );
  }

  confirmDUSDPaymentDone() {
    this.starServ.addPayment(this.id, 'DUSD', this.order.amount, this.txid).subscribe(
      (res: any) => {
        if(res && res._id) {
          this.payment = res;
          this.payment_id = res._id;

          this.modalRef.hide();
          
          this.toastr.success('Updated payment successfully', 'Ok');
          this.changePaymentStatus(1);
        }
      }
    );
  }

  payWithEpay() {

    this.starServ.addPayment(this.id, 'Epay', this.order.amount, this.txid).subscribe(
      (res: any) => {
        if(res && res._id) {
          const payment_id = res._id;

          const currency = this.order.currency;
          if (!this.order.amount) {
            return;
          }
          const amount = this.order.amount;
      
          const paymentAmount = amount;
          const paymentUnit = currency;
          this.apiServ.getEpayHash(paymentAmount, paymentUnit).subscribe(
            (ret: any) => {
              if (ret && ret.ok) {
      
                const paymentId = '7star_' + payment_id;
      
                const data = ret._body;
                const hash = data.hash;
                const payeeAccount = data.payeeAccount;

                const mapForm = document.createElement('form');
                mapForm.method = 'POST';
                mapForm.target = '_blank';
                mapForm.action = `${environment.EPAY_API}/merReceive`;
                mapForm.style.display = 'none';
      
                const mapInput = document.createElement('input');
                mapInput.type = 'hidden';
                mapInput.name = 'PAYEE_ACCOUNT';
                mapInput.value = payeeAccount;
                mapForm.appendChild(mapInput);
      
      
                const mapInput1 = document.createElement('input');
                mapInput1.type = 'hidden';
                mapInput1.name = 'PAYEE_NAME';
                mapInput1.value = this.order.walletAdd;
                mapForm.appendChild(mapInput1);
      
                const mapInput2 = document.createElement('input');
                mapInput2.type = 'hidden';
                mapInput2.name = 'PAYMENT_AMOUNT';
                mapInput2.value = paymentAmount.toString();
                mapForm.appendChild(mapInput2);
      
                const mapInput3 = document.createElement('input');
                mapInput3.type = 'hidden';
                mapInput3.name = 'PAYMENT_UNITS';
                mapInput3.value = paymentUnit;
                mapForm.appendChild(mapInput3);
      
                const mapInput5 = document.createElement('input');
                mapInput5.type = 'hidden';
                mapInput5.name = 'STATUS_URL';
                mapInput5.value = environment.endpoints.blockchaingate + 'epay/callback';
                mapForm.appendChild(mapInput5);
      
                const mapInput6 = document.createElement('input');
                mapInput6.type = 'hidden';
                mapInput6.name = 'PAYMENT_URL';
                mapInput6.value = location.origin + '/payment-success';
                mapForm.appendChild(mapInput6);
      
                const mapInput7 = document.createElement('input');
                mapInput7.type = 'hidden';
                mapInput7.name = 'NOPAYMENT_URL';
                mapInput7.value = location.origin + '/payment-fail';
                mapForm.appendChild(mapInput7);
      
                const mapInput8 = document.createElement('input');
                mapInput8.type = 'hidden';
                mapInput8.name = 'PAYMENT_ID';
                mapInput8.value = paymentId;
                mapForm.appendChild(mapInput8);
      
                const mapInput9 = document.createElement('input');
                mapInput9.type = 'hidden';
                mapInput9.name = 'V2_HASH';
                mapInput9.value = hash;
                mapForm.appendChild(mapInput9);
      
                const mapInput10 = document.createElement('input');
                mapInput10.type = 'hidden';
                mapInput10.name = 'SUGGESTED_MEMO';
                mapInput10.value = 'pay ' + this.order.amount + this.order.currency  + '(receiving address:';
                mapInput10.value += this.order.walletAdd;
                mapInput10.value += ')';
                mapForm.appendChild(mapInput10);
      
                document.body.appendChild(mapForm);
      
                mapForm.submit();
              }
            }
          );

        }
    });
    
  }

  payWithCashApp(template: TemplateRef<any>) {
          this.modalRef = this.modalService.show(template);
  }

  confirmCashAppPay() {
    this.starServ.addPayment(this.id, 'CashApp', this.order.amount, this.accountName).subscribe(
      (res: any) => {
        if(res && res._id) {      
          this.goPayStep = 2;
          this.payment_id = res._id;
          window.open("https://cash.app/$exchangily", "_blank");
    }});
  }

  changePaymentStatus(status: number) {
    this.starServ.changeOrderStatus(this.id, status).subscribe(
      (res: any) => {
      }
    );
    
    this.starServ.changePaymentStatus(this.payment_id, status).subscribe(
      (res: any) => {
        if(res && res._id) {      
          this.payment = res;
    }});
  }
  
  markAsPaid() {
    this.modalRef.hide();
    this.changePaymentStatus(1);
  }

  repay() {
    this.payment = null;
  }

  createOrder(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  createOrderDo() {
    this.starServ.createOrder(
      {
        walletAdd: this.walletAdd,
        amount: this.amount,
        currency: this.currency,
        referral: this.referral
      }
    ).subscribe(
      (res: any) => {
        if(res && res._id) {
          this.modalRef.hide();
          this.router.navigate(['/order/' + res._id]);
        }
      },

      (error) => {
        this.toastr.error(error.error.text);
      }
    );
  }

  placeOrder() {
    if(this.referral && this.referral.length > 32) {
      this.userreferalServ.checkAddress(this.referral).subscribe(
        (res: any) => {
          if(res && res.isValid) {
            this.createOrderDo();
          } else {
            this.errMsg = 'Invalid referral';
          }
        },
        err => {this.errMsg = err.message;}
      );
    } else {
      this.createOrderDo();
    }
  }


}
