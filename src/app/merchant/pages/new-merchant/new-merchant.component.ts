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
const hash = require('object-hash');
@Component({
  selector: 'app-new-merchant',
  templateUrl: './new-merchant.component.html',
  styleUrls: ['./new-merchant.component.scss']
})
export class NewMerchantComponent implements OnInit {

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
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private merchantServ: MerchantService,
    private storeServ: StoreService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private web3Serv: Web3Service, 
    private dataServ: DataService,
    private utilServ: UtilService) { }

  ngOnInit(): void {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    );
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        this.walletAddress = walletAddress;
      }
    );
  }

  import() {
    this.storeServ.getStoresByAddress(this.walletAddress).subscribe(
      (ret: any) => {
          console.log('rettt for stores=', ret);
        if(ret && ret.ok) {
          const store = ret._body[0];
          console.log('store==', store);
          this.name = store.name.sc ? store.name.sc : store.name.en;
          this.images = [store.image];
          this.phone = store.phone;
          this.fax = store.fax;
          this.email = store.email;
          this.website = store.website;
          this.openTime = store.openTime;
          this.closeTime = store.closeTime;
          if(store.merchant) {
            this.businessAddress = store.merchant.addressLan.sc ? store.merchant.addressLan.sc : store.merchant.addressLan.en;
            this.contactName = store.merchant.contactNameLan.sc ? store.merchant.contactNameLan.sc : store.merchant.contactNameLan.en;
            this.businessContents = store.merchant.businessContentsLan.sc ? store.merchant.businessContentsLan.sc : store.merchant.businessContentsLan.en;
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
          

          this.rebateRate = store.giveAwayRate;
          this.coin = store.coin;
          this.rewardCoin = store.rewardCoin;
          this.taxRate = store.taxRate;
          this.lockedDays = store.lockedDays;
          this.referral = store.refAddress;
          this.hideOnStore = store.hideOnStore;
        }

      });
  }

  createMerchant() {
    if(!this.images || this.images.length === 0) {
      this.toastr.info('no merchant logo');
      return;
    }
    if(!this.rewardCoin) {
      this.toastr.info('no reward coin');
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
      name: this.name,
      image: this.images[0],
      businessAddress: this.businessAddress,
      contactName: this.contactName,
      phone: this.phone,
      email: this.email,
      website: this.website,
      openTime: this.openTime,
      closeTime: this.closeTime,
      businessContents: this.businessContents,
      rebateRate: this.rebateRate,
      coin: this.coin,
      rewardCoin: this.rewardCoin,
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
              if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
                this.toastr.info('Merchant was created successfully');
        
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
}
