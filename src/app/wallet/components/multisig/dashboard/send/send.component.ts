import { Component, OnInit } from '@angular/core';
import { MultisigService } from 'src/app/services/multisig.service';
import { PasswordModalComponent } from '../../../../../shared/modals/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { SafeService } from 'src/app/services/safe.service';
import { CoinService } from 'src/app/services/coin.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit{
  nonce: number;
  to: string;
  amount: number;

  step: number = 1;
  modalRef: BsModalRef;

  wallet: any;
  multisigwallet: any;
  constructor(
    private multisigServ: MultisigService, 
    private safeServ: SafeService,
    private localSt: LocalStorage, 
    private coinServ: CoinService,
    private router: Router,
    private toastServ: ToastrService,
    private modalServ: BsModalService) {}

  ngOnInit(): void {

    this.localSt.getItem('multisigwallets').subscribe({next: (wallets: any) => {
      const multisigwallet = wallets.items[wallets.currentIndex];
      this.multisigwallet = multisigwallet;
      console.log('multisigwallet==', multisigwallet);
    }});

    this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

      if (!wallets || (wallets.length == 0)) {
        return;
      }
      this.wallet = wallets.items[wallets.currentIndex];

    });
  }
  next(event: any) {
    this.nonce = event.nonce;
    this.to = event.to;
    this.amount = event.amount;
    this.step = 2;
  }

  action(event: string) {
    if(event == 'back') {
      this.step = 1;
      return;
    }
    console.log('lets sign');

    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
      
    this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
        this.signDo(seed);
    });

  }

  signDo(seed: Buffer) {
    const chain = this.multisigwallet.chain;

    const keyPair = this.coinServ.getKeyPairs(chain, seed, 0, 0, 'b');

    let privateKey: any = keyPair.privateKeyBuffer;

    if(privateKey.privateKey) {
      privateKey = privateKey.privateKey;
    }

    
    this.safeServ.signTransaction(chain, privateKey, this.nonce, this.to, '', 18, this.amount).subscribe(
      {
        next: (retOfSig: any) => {

          const transaction = retOfSig.transaction;
          const transactionHash = retOfSig.transactionHash;
          const signature = retOfSig.signature;
          const body = {
            from: keyPair.address,
            address: this.multisigwallet.address,
            request: {
              type: 'tokenTransfer',
              to: this.to,
              amount: this.amount,
              tokenId: '',
              tokenName: 'ETH'
            },
            transaction,
            transactionHash,
            signatures: [ {
              signer: keyPair.address,
              data: signature
            }]
          };
          this.multisigServ.createProposal(body).subscribe(
            {next: (ret: any) => {
              if(ret.success) {
                const data = ret.data;
                console.log('data==', data);
                this.toastServ.success('Transaction was added to queue successfully.');
                this.router.navigate(['/wallet/multisig/dashboard/assets']);
              } else {
                this.toastServ.error('Fail to create the proposal');
              }
            },
            error: (error) => {
              this.toastServ.error('Error while creating the proposal', error);
            }
          },

          );

        },
        error: (error) => {
          console.log('error in signTransaction, ', error);
        }
      }
    );
  }

}
