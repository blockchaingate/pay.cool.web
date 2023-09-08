import { Component, OnInit } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { ToastrService } from 'ngx-toastr';
import { Web3Service } from 'src/app/services/web3.service';
import { PasswordModalComponent } from '../../../../shared/modals/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CoinService } from 'src/app/services/coin.service';
import { UtilService } from 'src/app/services/util.service';
import * as exaddr from '../../../../lib/exaddr';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  step: number = 1;
  modalRef: BsModalRef;
  contractAddress: string;
  name: string = '';
  
  address: string;
  txid: string;
  addresses: any;
  private _chain: string;
  public get chain() {
    return this._chain;
  }
  public set chain(value: string) {
    this._chain = value;
    if(value == 'KANBAN') {
      this.gasPrice = 0.05;
      this.gasLimit = 20000000;
    } else
    if(value == 'ETH') {
      this.gasPrice = 5;
      this.gasLimit = 5000000;
    } else
    if(value == 'BNB') {
      this.gasPrice = 10;
      this.gasLimit = 5000000;
    }
  }

  gasPrice: number = 0.05;
  gasLimit: number = 20000000;
  confirmations: number = 2;
  owners: any = [
    {
      name: 'owner1',
      address: ''
    },
    {
      name: 'owner2',
      address: ''
    }
  ];
  wallet: any;
  wallets: any;
  constructor(
    private storage: StorageMap, 
    private toastrServ: ToastrService, 
    private web3Serv: Web3Service,
    private coinServ: CoinService,
    private utilServ: UtilService,
    private modalServ: BsModalService
  ) { }

  ngOnInit() {
    this.chain = 'KANBAN';






    this.storage.watch('ecomwallets').subscribe((wallets: any) => {

      if (!wallets || (wallets.length == 0)) {
        return;
      }
      this.wallets = wallets;
      this.wallet = wallets.items[wallets.currentIndex];

      this.loadWallet();

    });
  }

  loadWallet() {
    const addresses = this.wallet.addresses;
    let chain = this.chain;
    if(chain == 'KANBAN') {
      chain = 'FAB';
    }
    if(chain == 'BNB') {
      chain = 'ETH';
    }
    const addressItems = addresses.filter(item => item.name == chain);
    if(!addressItems || (addressItems.length == 0)) {
      return;
    }
    const address = addressItems[0].address;
    this.address = address;
  }

  stepUpdated(event) {
    if(event == 1) {
      this.confirm();
    } else {
      this.step += event;
    }
    
    
  }

  create() {
    let addresses = this.owners.filter(item => item.address).map(item => item.address);
    if(addresses.length < this.confirmations) {
      this.toastrServ.error('Invalid confirmations');
      return;
    }
    
    if(this.chain == 'KANBAN') {
      try {
        addresses = addresses.map(item => {
          const fabAddress = exaddr.toLegacyAddress(item);
          const exgAddress = this.utilServ.fabToExgAddress(fabAddress);
          return exgAddress;
        });
      } catch(e) {
        return this.toastrServ.error('Invalid addresses');
      }

    }
    this.addresses = addresses;
    this.step = 2;
  }

  confirm() {
    

    const data = this.web3Serv.formCreateSafeContractABI(this.chain, this.addresses, this.confirmations);
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
      
    this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
        this.createSmartContractDo(seed, this.addresses, data);
    });

  }

  createSmartContractDo(seed: Buffer, addresses: any, data: string) {

    let chain = this.chain;

    const owners = [];

    for(let i = 0; i < this.owners.length; i++) {
      owners.push(
        {
          name: this.owners[i].name,
          address: addresses[i]
        }
      );
    }

    if(chain == 'KANBAN') {
      chain = 'FAB';
    }
    if(chain == 'BNB') {
      chain = 'ETH';
    }
    
    const keyPair = this.coinServ.getKeyPairs(chain, seed, 0, 0, 'b');

    let privateKey: any = keyPair.privateKeyBuffer;

    if(privateKey.privateKey) {
      privateKey = privateKey.privateKey;
    }
    
    let address = keyPair.address;
    if(address.indexOf('0x') < 0) {
      address = this.utilServ.fabToExgAddress(address);
    }



    this.web3Serv.formCreateSmartContractRawTx(this.chain, privateKey, address, data, this.gasPrice, this.gasLimit).subscribe(
      (rawtx: string) => {
        this.web3Serv.submitMultisigCreation(this.chain, this.name, owners, this.confirmations, rawtx).subscribe(
          (res: any) => {
            if(res.success) {

              const data = res.data;
              this.txid = data.txid;
              this.step = 3;
            } else {
              let message = 'Error while creating the wallet';
              if(res.message) {
                message = res.message;
              }
              return this.toastrServ.error(message);
            }
          }
        );
      }
    );
  }

  onWalletChange(walletIndex) {
    this.wallet = this.wallets.items[walletIndex];
    this.loadWallet();
  }

}
