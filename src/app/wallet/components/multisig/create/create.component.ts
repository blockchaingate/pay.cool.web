import { Component, OnInit } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { ABI, Bytecode } from '../../../../config/multisigWallet';
import { ToastrService } from 'ngx-toastr';
import { Web3Service } from 'src/app/services/web3.service';
import { PasswordModalComponent } from '../../../../shared/modals/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  modalRef: BsModalRef;
  address: string;
  chain: string = 'KANBAN';
  gasPrice: number = 40;
  gasLimit: number = 100000;
  confirmations: number = 1;
  owners: any = [
    {
      name: '',
      address: ''
    },
    {
      name: '',
      address: ''
    }
  ];
  wallet: any;
  wallets: any;
  constructor(
    private localSt: LocalStorage, 
    private toastrServ: ToastrService, 
    private web3Serv: Web3Service,
    private modalServ: BsModalService
  ) { }

  ngOnInit(): void {
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

  }

  onWalletChange(walletIndex) {
    this.wallet = this.wallets.items[walletIndex];
    this.loadWallet();
  }

}
