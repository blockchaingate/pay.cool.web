import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { UtilService } from 'src/app/services/util.service';
import { Web3Service } from 'src/app/services/web3.service';
import { environment } from 'src/environments/environment';
import { coins } from '../../../config/coins';

import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ABI } from '../../../utils/abi';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { MerchantService } from 'src/app/services/merchant.service';
import { StoreService } from 'src/app/services/store.service';
import { HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CoinService } from 'src/app/services/coin.service';
import { KanbanService } from 'src/app/services/kanban.service';
const hash = require('object-hash');
@Component({
  selector: 'app-edit-merchant',
  templateUrl: './edit-merchant.component.html',
  styleUrls: ['./edit-merchant.component.scss']
})
export class EditMerchantComponent implements OnInit {
  currentTab: string;
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
  email2: string;
  website: string;
  openTime: string;
  closeTime: string;
  businessContents: string;
  rebateRate: number;
  coin: string;
  taxRate: number;
  id: string;
  walletAddress: string;
  nameChinese: string;
  businessAddressChinese: string;
  contactNameChinese: string;
  businessContentsChinese: string;
  lockedDays: number;
  hideOnStore: boolean;
  appId: string;
  appSecret: string;
  coins = coins;
  
  constructor(
    private toastr: ToastrService,
    private modalService: BsModalService,
    private merchantServ: MerchantService,
    private kanbanServ: KanbanService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private coinServ: CoinService, 
    private dataServ: DataService,
    private utilServ: UtilService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.currentTab = 'EN';
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    );
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.walletAddress = walletAddress;
        }

      }
    );

    this.images = [];
    this.dataServ.currentMyStore.subscribe(
      (store: any) => {
        if(store && store._id) {
          this.name = store.name.en;
          if(store.image) {
            this.images = [store.image];
          }
          
          this.id = store.id;
          this.businessAddress = store.businessAddress.en;
          this.website = store.website;
          this.contactName = store.contactName.en;
          this.phone = store.phone;
          this.email = store.email;
          this.email2 = this.email;
          this.openTime = store.openTime;
          this.businessContents = store.businessContents.en;
          this.rebateRate = store.rebateRate;
          this.taxRate = store.taxRate;
          this.lockedDays = store.lockedDays;
          this.coin = store.coin;
          this.referral = store.referral;
          this.hideOnStore = store.hideOnStore;
        }
      }
    );
  }

  generateApiCredential() {
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
      this.generateApiCredentialDo(seed);
    });
  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  updateMerchant() {
    if(!this.rebateRate) {
      this.toastr.info('Rebate rate not set');
      return;
    }
    const exgAddress = this.utilServ.fabToExgAddress(this.referral);
    if(!this.images || this.images.length === 0) {
      this.toastr.info('no merchant logo');
      return;
    }
    
    if(!exgAddress || exgAddress.length !== 42) {
      this.toastr.info('Invalid referral address');
      return;
    }
    
    if(!this.coin) {
      this.toastr.info('Coin not selected');
      return;
    }

    if(!this.rebateRate || (this.rebateRate < 3)) {
      this.rebateRate = 3;
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

  generateApiCredentialDo(seed) {
    const data = {
      merchant_id: this.id
    };

    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey;
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  

    this.merchantServ.generateApiCredential(data).subscribe(
      (ret: any) => {
        if(ret && ret.success) {
          const data = ret.data;
          this.appId = data.app_id;
          this.appSecret = data.app_secret;
          this.toastr.info('Api credential was generated successfully');
        } else {
          this.toastr.error('Failed to generate api credential merchant');
        }

      }
    );
  }

  updateMerchantDo(seed) {
    if(this.referral == this.walletAddress) {
      return;
    }
    const data = {
      referral: this.referral,
      paymentReceiver: this.walletAddress,
      owner: this.walletAddress,
      name: {
        en:this.name,
        //sc: this.nameChinese
      },
      image: this.images[0],
      businessAddress: {
        en: this.businessAddress,
        //sc: this.businessAddressChinese
      },
      contactName: {
        en: this.contactName,
        //sc: this.contactNameChinese
      },
      phone: this.phone,
      email: this.email,
      website: this.website,
      openTime: this.openTime,
      //closeTime: this.closeTime,
      businessContents: {
        en: this.businessContents,
        //sc: this.businessContentsChinese
      },
      rebateRate: this.rebateRate,
      coin: this.coin,
      taxRate: this.taxRate,
      lockedDays: this.lockedDays,
      hideOnStore: this.hideOnStore
    };

    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey;
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  

    this.merchantServ.update(this.id, data).subscribe(
      (ret: any) => {
        if(ret && ret._id) {
          this.toastr.info('Merchant was updated successfully');
        } else {
          this.toastr.error('Failed to update merchant');
        }

      }
    );

  }

  clearForm() {
    this.name = '';
    this.images = [];
    this.address = '';
    this.businessAddress = '';
    this.contactName = '';
    this.businessAddressChinese = '';
    this.businessContentsChinese = '';
    this.closeTime = '';
    this.contactNameChinese = '';
    this.email = '';
    this.fax = '';
    this.id = '';
    this.lockedDays = null;
    this.nameChinese = '';
    this.openTime = '';
    this.phone = '';
    this.rebateRate = 10;
    this.referral = '';
    this.taxRate = 0;
  }
}
