import { Component, Input, OnInit } from '@angular/core';
import { PasswordModalComponent } from '../../../../../../../../shared/modals/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit{
  @Input() proposal: any;
  kanbanAddress: string;
  ethAddress: string;
  wallet: any;
  confirmable: boolean;
  confirmedByMe: boolean;
  constructor(
    private localSt: LocalStorage, 
    private utilServ: UtilService,
    private modalServ: BsModalService
  ) {}
  ngOnInit(): void {
    this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

      if (!wallets || (wallets.length == 0)) {
        return;
      }
      this.wallet = wallets.items[wallets.currentIndex];

      this.loadWallet();

    });
  }

  loadWallet() {
    console.log('this.wallet=', this.wallet);
    const addresses = this.wallet.addresses;
    for(let i = 0; i < addresses.length;i++) {
      const item = addresses[i];
      const name = item.name;
      const address = item.address;
      if(name == 'ETH') {
        this.ethAddress = address;
      } 
      else if(name == 'FAB') {
        this.kanbanAddress = this.utilServ.fabToExgAddress(address);
      }
    }




    const chain = this.proposal.multisig.chain;
    const selfAddress = ((chain == 'KANBAN') ? this.kanbanAddress : this.ethAddress);
    if(!selfAddress) {
      return false;
    }
    const owners = this.proposal.multisig.owners;
    const confirmations = this.proposal.multisig.confirmations;
    const signatures = this.proposal.signatures;
    console.log("owners=", owners);
    console.log("selfAddress=", selfAddress);

    this.confirmable = false;

    for(let i = 0; i < owners.length; i++) {
      const address = owners[i].address;
      if(address.toLowerCase() == selfAddress.toLowerCase()) {
        this.confirmable = true;
      }
    }

    this.confirmedByMe = false;

    for(let i = 0; i < signatures.length; i++) {
      const address = signatures[i].signer;
      console.log('address of signer=', address);
      if(address.toLowerCase() == selfAddress.toLowerCase()) {
        this.confirmedByMe = true;
        return;
      }
    }
  }

}
