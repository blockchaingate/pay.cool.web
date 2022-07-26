import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { MyCoin } from 'src/app/models/mycoin';
import { CoinService } from 'src/app/services/coin.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
    selector: 'app-send',
    templateUrl: './send.component.html',
    styleUrls: ['./send.component.scss'],
    encapsulation: ViewEncapsulation.None
  })
  export class SendComponent implements OnInit {
    public onClose: Subject<any>;
    coins: any;
    mycoin: MyCoin;
    addresses: any;
    sendAmount: number;
    currentCoin: string;
    to: string;
    isAdvance: boolean;
    comment: string;
    balance: number;
    onText: any;
    offText: any;
    onColor: any;
    offColor: any;
    size: any;
    disabled: boolean;
    gasPrice: number;
    gasLimit: number;
    satoshisPerByte: number;
    feeLimit: number;

    constructor(
      private utilServ: UtilService,
      private modalRef: BsModalRef, private coinServ: CoinService) {}
    
    ngOnInit() {
      this.currentCoin = 'FAB';
    
      this.onClose = new Subject();
      this.isAdvance = false; 
      this.onText = 'Yes';
      this.offText = 'No';
      this.onColor = 'blue';
      this.offColor = 'yellow';
      this.onCoinChange(this.currentCoin);  
    }

    close() {
        this.modalRef.hide();
    }    

    sendCoin() {
      const data = {
        currentCoin: this. currentCoin,
        to: this.to,
        sendAmount: this.sendAmount,
        comment: this.comment,
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit,
        satoshisPerByte: this.satoshisPerByte,
        feeLimit: this.feeLimit
      };
      this.onClose.next(data);
      this.modalRef.hide();
    }

    onFlagChange(event) {
      console.log('event=', event);
      this.isAdvance = event;
    }

    formatName(coinName:string) {
      return this.utilServ.showCoinName(coinName);
    }
    
    onCoinChange(newCoin) {
      this.currentCoin = newCoin;
      console.log('newCoin==', newCoin);
      this.mycoin = this.coinServ.formMyCoin(this.addresses, this.currentCoin);
      console.log('this.coins=', this.coins);
      console.log('this.coins.filter(item => item.coin == newCoin)=', this.coins.filter(item => item.coin == newCoin));
      this.balance = this.coins.filter(item => item.coin == newCoin)[0].balance;
    }


  }