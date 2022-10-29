import { Component, OnInit } from '@angular/core';
import { coins } from '../../../config/coins';
import { DataService } from '../../../services/data.service';
import { MerchantService } from 'src/app/services/merchant.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { CoinService } from 'src/app/services/coin.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchant-info',
  templateUrl: './merchant-info.component.html',
  styleUrls: ['./merchant-info.component.scss']
})
export class MerchantInfoComponent implements OnInit {
  currentTab: string;
  nameChinese: string;
  businessAddressChinese: string;
  contactNameChinese: string;
  businessContentsChinese: string;
  modalRef: any;
  wallet: any;
  name: string = '';
  referral: string = '';
  txHash: string = '';
  timeoutHandle: any;
  images: any;
  address: string;
  businessAddress: string;
  contactName: string;
  phone: string;
  fax: string;
  email: string;
  website: string;
  openTime: string;
  closeTime: string;
  businessContents: string;
  rebateRate: number;
  coin: string;
  rewardCoin: string;
  taxRate: number;
  id: string;
  walletAddress: string;
  lockedDays: number;
  hideOnStore: boolean;
  coins = coins;

  constructor(
    private router: Router,
    private kanbanServ: KanbanService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private coinServ: CoinService,
    private merchantServ: MerchantService,
    private dataServ: DataService) { }

  ngOnInit(): void {
    this.currentTab = 'EN';
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    );

    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        this.walletAddress = walletAddress;
        this.merchantServ.getMerchantsByAddress(this.walletAddress).subscribe(
          (ret: any) => {
            if(ret && (ret.length > 0)) {
              const merchant = ret[0];
              this.id = merchant.id;
              this.name = merchant.name.en;
              this.nameChinese = merchant.name.sc;
              this.images = [merchant.image];
              this.businessAddress = merchant.businessAddress.en;
              this.businessAddressChinese = merchant.businessAddress.sc;
              this.contactName = merchant.contactName.en;
              this.contactNameChinese = merchant.contactName.sc;
              this.phone = merchant.phone;
              this.fax = merchant.fax;
              this.email = merchant.email;
              this.website = merchant.website;
              this.openTime = merchant.openTime;
              this.closeTime = merchant.closeTime;
              this.businessContents = merchant.businessContents.en;
              this.businessContentsChinese = merchant.businessContents.sc;
              this.rebateRate = merchant.rebateRate;
              this.coin = merchant.coin;
              this.rewardCoin = merchant.rewardCoin;
              this.taxRate = merchant.taxRate;
              this.lockedDays = merchant.lockedDays;
              this.hideOnStore = merchant.hideOnStore;
            }
          }
        );
      }
    );
  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  updateMerchant() {
    if(!this.images || this.images.length === 0) {
      this.toastr.info('no merchant logo');
      return;
    }
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.toastr.info('no wallet');
      //this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
      this.updateMerchantDo(seed);
    });
  }

  credit() {
    this.router.navigate(['/merchants/merchant-credit']);
  }

  updateMerchantDo(seed) {

    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey;

    const data = {
      name: {
        en:this.name,
        sc: this.nameChinese
      },
      image: this.images[0],
      businessAddress: {
        en: this.businessAddress,
        sc: this.businessAddressChinese
      },
      contactName: {
        en: this.contactName,
        sc: this.contactNameChinese
      },
      phone: this.phone,
      email: this.email,
      website: this.website,
      openTime: this.openTime,
      closeTime: this.closeTime,
      businessContents: {
        en: this.businessContents,
        sc: this.businessContentsChinese
      },
      rebateRate: this.rebateRate,
      coin: this.coin,
      rewardCoin: this.rewardCoin,
      taxRate: this.taxRate,
      lockedDays: this.lockedDays,
      hideOnStore: this.hideOnStore
    };

    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  

    this.merchantServ.update(this.id, data).subscribe(
      async (res: any) => {
        if (res && res._id) {
          this.toastr.success('Store was updated.');        
        } else {
          this.toastr.error('Store failed to be updated.');    
        }
      } 
    ); 
  }
}
