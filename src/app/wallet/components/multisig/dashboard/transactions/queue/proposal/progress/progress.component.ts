import { Component, Input, OnInit } from '@angular/core';
import { PasswordModalComponent } from '../../../../../../../../shared/modals/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UtilService } from 'src/app/services/util.service';
import { SafeService } from 'src/app/services/safe.service';
import { CoinService } from 'src/app/services/coin.service';
import { ToastrService } from 'ngx-toastr';
import { MultisigService } from 'src/app/services/multisig.service';
import { Router } from '@angular/router';

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
  confirmations: number;
  modalRef: BsModalRef;

  constructor(
    private localSt: LocalStorage, 
    private utilServ: UtilService,
    private safeServ: SafeService,
    private coinServ: CoinService,
    private toastServ: ToastrService,
    private multisigServ: MultisigService,
    private modalServ: BsModalService,
    private router: Router
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
    this.confirmations = confirmations;
    const signatures = this.proposal.signatures;

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
      if(address.toLowerCase() == selfAddress.toLowerCase()) {
        this.confirmedByMe = true;
        return;
      }
    }
  }

  confirm() {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
      
    this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
        this.confirmDo(seed);
    });
  }

  execute() {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
      
    this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
        this.executeDo(seed);
    });
  }

  executeDo(seed: Buffer) {
    const chain = this.proposal.multisig.chain;

    const keyPair = this.coinServ.getKeyPairs(chain, seed, 0, 0, 'b');

    let privateKey: any = keyPair.privateKeyBuffer;

    if(privateKey.privateKey) {
      privateKey = privateKey.privateKey;
    }
    
    this.safeServ.executeTransaction(chain, privateKey, keyPair.address, this.proposal).subscribe(
      {
        next: (ret: any) => {
          console.log('ret of execute===', ret);
        },
        error: (error: any) => {
          this.toastServ.error(error);
        }
      }
    );
  }

  confirmDo(seed: Buffer) {

    const chain = this.proposal.multisig.chain;

    const keyPair = this.coinServ.getKeyPairs(chain, seed, 0, 0, 'b');

    let privateKey: any = keyPair.privateKeyBuffer;

    if(privateKey.privateKey) {
      privateKey = privateKey.privateKey;
    }

    const signature = this.safeServ.confirmTransaction(chain, privateKey, this.proposal);

    const body = {
      _id: this.proposal._id,
      signer: keyPair.address,
      data: signature
    }

    this.multisigServ.confirmProposal(body).subscribe(
      {next: (ret: any) => {
        if(ret.success) {
          const data = ret.data;
          console.log('data==', data);
          this.toastServ.success('Transaction was confirmed successfully.');
          this.router.navigate(['/wallet/multisig/dashboard/assets']);
        } else {
          this.toastServ.error('Fail to confirm the proposal');
        }
      },
      error: (error) => {
        this.toastServ.error('Error while confirming the proposal', error);
      }
    });

  }
}
