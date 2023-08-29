import { Component, OnInit } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { ABI, Bytecode } from '../../../../config/multisigWallet';
import { ToastrService } from 'ngx-toastr';
import { Web3Service } from 'src/app/services/web3.service';
import { PasswordModalComponent } from '../../../../shared/modals/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CoinService } from 'src/app/services/coin.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  modalRef: BsModalRef;
  name: string = 'test';
  address: string;

  private _chain: string;
  public get chain() {
    return this._chain;
  }
  public set chain(value: string) {
    console.log('value for chain=', value);
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
  confirmations: number = 1;
  owners: any = [
    {
      name: 'owner1',
      address: '0xa52a63e1Aee791DDd6DC5a753ca93C3C226eE5D2'
    },
    {
      name: 'owner2',
      address: '0x008a137b0216e3b8b11428304a57a9ffe5f12eaa'
    }
  ];
  wallet: any;
  wallets: any;
  constructor(
    private localSt: LocalStorage, 
    private toastrServ: ToastrService, 
    private web3Serv: Web3Service,
    private coinServ: CoinService,
    private utilServ: UtilService,
    private modalServ: BsModalService
  ) { }

  ngOnInit(): void {
    this.chain = 'KANBAN';
    this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

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

  confirm() {
    
    const addresses = this.owners.filter(item => item.address).map(item => item.address);
    if(addresses.length < this.confirmations) {
      this.toastrServ.error('Invalid confirmations');
      return;
    }
    const args = [
      addresses,
      this.confirmations
    ];

    console.log('args===', args);
    const data = this.web3Serv.formCreateSmartContractABI(ABI, Bytecode.trim(), args);

    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
      
    this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
        this.createSmartContractDo(seed, data);
    });

  }

  createSmartContractDo(seed: Buffer, data: string) {

    let chain = this.chain;

    if(chain == 'KANBAN') {
      chain = 'FAB';
    }
    if(chain == 'BNB') {
      chain = 'ETH';
    }
    
    const keyPair = this.coinServ.getKeyPairs(chain, seed, 0, 0, 'b');
    console.log('keyPair===', keyPair);
    let privateKey: any = keyPair.privateKeyBuffer;

    if(privateKey.privateKey) {
      privateKey = privateKey.privateKey;
    }
    
    console.log('privateKey===', privateKey);
    let address = keyPair.address;
    if(address.indexOf('0x') < 0) {
      address = this.utilServ.fabToExgAddress(address);
    }
    this.web3Serv.formCreateSmartContractRawTx(this.chain, privateKey, address, data, this.gasPrice, this.gasLimit).subscribe(
      (rawtx: string) => {
        this.web3Serv.submitMultisigCreation(this.chain, this.name, this.owners, this.confirmations, rawtx).subscribe(
          (txid: string) => {
            console.log('txid===', txid);
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
