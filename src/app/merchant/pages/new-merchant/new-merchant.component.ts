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
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { MerchantService } from 'src/app/services/merchant.service';
import { StoreService } from 'src/app/services/store.service';
import { HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ImageCropperModule } from 'ngx-image-cropper';
const hash = require('object-hash');
@Component({
  selector: 'app-new-merchant',
  templateUrl: './new-merchant.component.html',
  styleUrls: ['./new-merchant.component.scss']
})
export class NewMerchantComponent implements OnInit {
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
  coins = coins;
  
  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private merchantServ: MerchantService,
    private storeServ: StoreService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private web3Serv: Web3Service, 
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
  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  import() {
    if(!this.walletAddress) {
      this.toastr.error('Please create or import your wallet first');
      return;
    }
    this.storeServ.getStoresByAddress(this.walletAddress).subscribe(
      (ret: any) => {
          console.log('rettt for stores=', ret);
        if(ret && ret.ok) {
          const store = ret._body[0];
          console.log('store==', store);
          if(store.name) {
            this.name = store.name.en;
            this.nameChinese = store.name.sc;
          }
          this.images = [store.image];
          this.phone = store.phone;
          this.fax = store.fax;
          this.email = store.email;
          this.website = store.website;
          this.openTime = store.openTime;
          this.closeTime = store.closeTime;
          if(store.merchant) {
            if(store.merchant.addressLan) {
              this.businessAddress = store.merchant.addressLan.en;
              this.businessAddressChinese = store.merchant.addressLan.sc;
            }
            if(store.merchant.contactNameLan) {
              this.contactName = store.merchant.contactNameLan.en;
              this.contactNameChinese = store.merchant.contactNameLan.sc;
            }
            if(store.merchant.businessContentsLan) {
              this.businessContents = store.merchant.businessContentsLan.en;
              this.businessContentsChinese = store.merchant.businessContentsLan.sc;
            }
           if(store.merchant.phone) {
              this.phone = store.merchant.phone;
            } 
            if(store.merchant.fax) {
              this.fax = store.merchant.fax;
            } 
            if(store.merchant.email) {
              this.email = store.merchant.email;
            } 
            if(store.merchant.website) {
              this.website = store.merchant.website;
            } 
            if(store.merchant.openTime) {
              this.openTime = store.merchant.openTime;
            } 
            if(store.merchant.closeTime) {
              this.closeTime = store.merchant.closeTime;
            } 
          }
          
          // store.giveAwayRate = store.giveAwayRate.replace('%', '');
          if(!store.giveAwayRate) {
            this.toastr.error('Invalid rebate rate.');
          }
          store.giveAwayRate = store.giveAwayRate.replace(/\D/g,'');
          this.rebateRate = store.giveAwayRate;
          if(this.rebateRate < 3) {
            this.toastr.error('Rebate rate must be 3 or greater.');
          }
          this.coin = store.coin;
          store.taxRate = store.taxRate.replace(/\D/g,'');
          this.taxRate = store.taxRate;
          store.lockedDays = store.lockedDays.replace(/\D/g,'');
          this.lockedDays = store.lockedDays;
          this.referral = store.refAddress;
          this.hideOnStore = store.hideOnStore;
        }

      });
  }

  createMerchant() {
    const exgAddress = this.utilServ.fabToExgAddress(this.referral);
    if(!exgAddress || exgAddress.length !== 42) {
      this.toastr.info('Invalid referral address');
      return;
    }
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
      this.spinner.show();
      this.createMerchantDo(seed);
    });
  }

  createMerchantDo(seed) {
    if(this.referral == this.walletAddress) {
      return;
    }
    const id = this.web3Serv.randomHex(32);
    const address = environment.addresses.smartContract.smartConractMerchantInfo;
    const data = {
      id,
      referral: this.referral,
      paymentReceiver: this.walletAddress,
      owner: this.walletAddress,
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
      address,
      taxRate: this.taxRate,
      lockedDays: this.lockedDays,
      hideOnStore: this.hideOnStore
    };
    
    const merchantHex = hash(data);
    data['mhash'] = merchantHex;
    
    const abi = ABI.createMerchant;
    const args = [
      id, 
      '0x' + merchantHex,
      this.utilServ.fabToExgAddress(this.referral), 
      this.utilServ.fabToExgAddress(this.walletAddress)
    ];
    
    this.merchantServ.createMerchantReferral(data).subscribe(
      (ret: any) => {
        if(ret && ret._id) {
          this.kanbanSmartContractServ.execSmartContract(seed, address, abi, args).then(
            (ret: any) => {
              console.log('ret for exec smart contract:', ret);
              if(ret && ret.success && ret._body && ret._body.status == '0x1') {
                this.toastr.info('Merchant was created successfully');
                //this.clearForm();

                this.router.navigate(['/merchants/merchant-submitted']);
              } else {
                this.toastr.error('Merchant was created failed');
              }
            }
          );
        } else {
          this.toastr.error('Merchant was created failed');
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
