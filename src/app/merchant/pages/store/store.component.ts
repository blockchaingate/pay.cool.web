import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CoinService } from '../../../services/coin.service';
import { KanbanService } from '../../../services/kanban.service';
import { KanbanSmartContractService } from '../../../services/kanban.smartcontract.service';
import { StorageService } from '../../../services/storage.service';
import { UtilService } from '../../../services/util.service';
import { DataService } from '../../../services/data.service';
import { StoreService } from '../../../services/store.service';
import { environment } from '../../../../environments/environment';
import { ABI as feeChargerABI, Bytecode as feeChargerBytecode, version } from '../../../config/feeCharger2';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { coins } from '../../../config/coins';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-store',
  providers: [],
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  token: string;
  isEditable = true;
  isLinear = true;
  version = version;

  lockedDays: number;
  store: any;
  address: string;
  contactName: string;
  addressChinese: string;
  contactNameChinese: string;
  businessContentsChinese: string;
  phone: string;
  fax: string;
  email: string;
  website: string;
  merchant: any;
  openTime: string;
  closeTime: string;
  businessContents: string;
  options: any;
  taxRate: number;
  name: string;
  images: any;
  nameChinese: string;
  currentTab: string;
  hideOnStore = true;
  giveAwayRate: number;
  feeChargerSmartContractAddress: string;
  smartContractAddress: string;
  refAddress: string;
  walletAddress: string;

  coin: string;
  id: string;
  modalRef: BsModalRef;
  wallet: any;
  objectId: string;

  coins = coins;

  constructor(
    private coinServ: CoinService,
    private toastr: ToastrService,
    private translateServ: TranslateService,
    private modalService: BsModalService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private utilServ: UtilService,
    private kanbanServ: KanbanService,
    private router: Router,
    private dataServ: DataService,
    private storeageServ: StorageService,
    private storeServ: StoreService) {
  }


  initStore(store) {
    
    
    this.store = store;
    this.merchant = store.merchant;
    this.id = store._id;
    this.coin = store.coin;
    this.hideOnStore = store.hideOnStore;
    this.taxRate = store.taxRate;
    if(store.name) {
      this.name = store.name.en;
      this.nameChinese = store.name.sc;  
    }
    if(store.image) {
      this.images = [store.image];
    }
    this.feeChargerSmartContractAddress = store.feeChargerSmartContractAddress;     
    this.smartContractAddress = store.smartContractAddress; 
    this.refAddress = store.refAddress;
    this.giveAwayRate = store.giveAwayRate;
    this.lockedDays = store.lockedDays;
    this.objectId = store.objectId;   
    if(this.merchant) {
      if(this.merchant.addressLan) {
        this.address = this.merchant.addressLan.en;
        this.addressChinese = this.merchant.addressLan.sc;
      }
      if(this.merchant.contactNameLan) {
        this.contactName = this.merchant.contactNameLan.en;
        this.contactNameChinese = this.merchant.contactNameLan.sc;
      }
      this.phone = this.merchant.phone;
      this.fax = this.merchant.fax;
      this.email = this.merchant.email;
      this.website = this.merchant.website;
      this.openTime = this.merchant.openTime;
      this.closeTime = this.merchant.closeTime;
      if(this.merchant.businessContentsLan) {
        this.businessContents = this.merchant.businessContentsLan.en;
        this.businessContentsChinese = this.merchant.businessContentsLan.sc;
      }
    }

    this.hideOnStore = store.hideOnStore;
  }

  ngOnInit() {
    this.hideOnStore = true;
    this.images = [];
    this.storeageServ.getStoreRef().subscribe(
      (refAddress: string) => {
        if(refAddress) {
          this.refAddress = refAddress;
        }
      }
    );
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
    this.dataServ.currentMyStore.subscribe(
      (store: any) => {
        if(store && store._id) {
          this.initStore(store);
        }
      }
    );
    this.currentTab = 'EN';

  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  async addStoreDo(seed: Buffer) {
    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey;

    const id = this.id;
    let createNew = true;
    if(id) {
      createNew = false;
      if(this.version != this.store.version) {
        createNew = true;
      }
    }

    if(!createNew) {
      const data: any = {
        name: {
          en: this.name,
          sc: this.nameChinese
        },
        address: {
          en: this.address,
          sc: this.addressChinese
        },
        contactName: {
          en: this.contactName,
          sc: this.contactNameChinese
        },
        phone: this.phone,
        fax: this.fax,
        email: this.email,
        giveAwayRate: this.giveAwayRate,
        lockedDays: this.lockedDays,
        website: this.website,
        openTime: this.openTime,
        closeTime: this.closeTime,
        businessContents: {
          en:this.businessContents,
          sc: this.businessContentsChinese
        },
        taxRate: this.taxRate ? this.taxRate : 0,
        coin: this.coin,
        hideOnStore: this.hideOnStore
      };
      if(this.images && this.images.length > 0) {
        data.image = this.images[0];
      } else {
        this.toastr.info(
          this.translateServ.instant('Please upload your logo'));
        return;
      }


      const sig = this.kanbanServ.signJsonData(privateKey, data);
      data['sig'] = sig.signature;  

      this.storeServ.update(this.id, data).subscribe(
        async (res: any) => {
          if (res.ok) {
            /*
            (await this.iddockServ.updateIdDock(seed, this.objectId, 'things', null, data, null)).subscribe((res: any) => {
              if(res) {
                if(res.ok) {
                  this.spinner.hide();
                  this.toastr.success('Store was updated.');
                }
              }
            });    
            */
            this.toastr.success('Store was updated.');        
          }
        }
      ); 

    } else {

      const data: any = {
        name: {
          en: this.name,
          sc: this.nameChinese
        },
        address: {
          en: this.address,
          sc: this.addressChinese
        },
        contactName: {
          en: this.contactName,
          sc: this.contactNameChinese
        },
        phone: this.phone,
        fax: this.fax,
        version: this.version,
        lockedDays: this.lockedDays,
        email: this.email,
        website: this.website,
        openTime: this.openTime,
        closeTime: this.closeTime,
        businessContents: {
          en:this.businessContents,
          sc: this.businessContentsChinese
        },
        coin: this.coin,
        giveAwayRate: this.giveAwayRate,
        taxRate: this.taxRate ? this.taxRate : 0,
        refAddress: this.refAddress,
        hideOnStore: this.hideOnStore
      };      
      if(!this.coin) {
        this.toastr.error('Coin not selected', 'Ok');
        return;
      }
      if(this.images && this.images.length > 0) {
        data.image = this.images[0];
      }
      const proxyAddress = environment.addresses.smartContract.sevenStarProxy2;
      let args2 = [
        proxyAddress,
        environment.addresses.smartContract.feeDistribution2,
        environment.addresses.smartContract.merchantCredit2,
        this.utilServ.fabToExgAddress(this.walletAddress),
        this.utilServ.fabToExgAddress(this.refAddress),
        '0x1'
      ];

      const resp2: any = await this.kanbanSmartContractServ.deploySmartContract(seed, feeChargerABI, feeChargerBytecode, args2);
  
      if(resp2 && resp2.ok && resp2._body && resp2._body.status == '0x1') { 
        const body = resp2._body;
  
        const txid = body.transactionHash;
        this.kanbanSmartContractServ.getTransactionReceipt(txid).subscribe(
          async (receipt: any) => {
            if(receipt && receipt.transactionReceipt) {
              if(receipt.transactionReceipt.contractAddress) {
                const feeChargerSmartContractAddress = receipt.transactionReceipt.contractAddress;
                data.feeChargerSmartContractAddress = feeChargerSmartContractAddress;
                data.status = 0;
                this.taxRate = 0;

                /*
                const { datahash, sign, txhex } = await this.iddockServ.signIdDock(seed, 'things', null, data, null);
                const newData = {
                    ...data,
                    datahash, 
                    sign,
                    txhex
                };
                */
                if(this.id) {

                  const sig = this.kanbanServ.signJsonData(privateKey, data);
                  data['sig'] = sig.signature;  
                  this.storeServ.update(this.id, data).subscribe(
                    (res: any) => {
                      if (res && res.ok) {
                        this.initStore(res._body);
                        this.toastr.success('Store was updated successfully.');
                      }
                    }
                );  
                } else {
                  const sig = this.kanbanServ.signJsonData(privateKey, data);
                  data['sig'] = sig.signature;  
                  this.storeServ.create(data).subscribe(
                    (res: any) => {
                      if (res && res.ok) {
                        this.initStore(res._body);
                        this.toastr.success('Store was created.');
                      }
                    }
                );  
                }

              }
              else {
                  this.toastr.error('Error with creating smart contract.', 'Ok');
              }
            }
          });
      } else {
        this.toastr.error('Error with creating smart contract.', 'Ok');
      }

    }
  }

  addStore() {

    if(!this.id && (this.refAddress == this.walletAddress)) {
      this.toastr.info('You cannot refer yourself.');
      return;
    }
    if(!this.refAddress) {
      this.toastr.info('Your ref address is empty.');
      return;      
    }
    let refAddressHex = '';
    try {
      refAddressHex = this.utilServ.fabToExgAddress(this.refAddress);
    } catch(e) {

    }
    if(!refAddressHex || (refAddressHex.length != 42)) {
      this.toastr.error('Your referral address is not in correct format.');
      return;        
    }

    if((this.giveAwayRate < 3) || (this.giveAwayRate >= 100) || !Number.isInteger(Number(this.giveAwayRate))) {
      this.toastr.info('Rebate rate is incorrect, it must be a integer between 3 and 100.');
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
      this.addStoreDo(seed);
    });

  }

  deleteStore() {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onCloseFabPrivateKey.subscribe( (privateKey: any) => {
      this.deleteStoreDo(privateKey);
    });
  }

  deleteStoreDo(privateKey: any) {
    const data = {
      id: this.id
    };
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  

    this.storeServ.deleteStore(data).subscribe(
      (res: any) => {
        if (res && res.ok) {
          //this.router.navigate(['/merchant/store']);

          //this.toastr.success('Store was deleted.');
          //this.smartContractAddress = store.smartContractAddress;
        }
      }
    );  
  }
}
