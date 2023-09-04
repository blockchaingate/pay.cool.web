import { Component, OnInit } from '@angular/core';
import { MultisigService } from 'src/app/services/multisig.service';
import { PasswordModalComponent } from '../../../../../shared/modals/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { SafeService } from 'src/app/services/safe.service';
import { CoinService } from 'src/app/services/coin.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit{
  nonce: number;
  to: string;
  amount: number;
  sendable: boolean;
  step: number = 1;
  tokenId: string;
  modalRef: BsModalRef;

  wallet: any;
  multisigwallet: any;
  ethAddress: string;
  kanbanAddress: string;
  constructor(
    private multisigServ: MultisigService, 
    private safeServ: SafeService,
    private localSt: LocalStorage, 
    private utilServ: UtilService,
    private coinServ: CoinService,
    private router: Router,
    private route: ActivatedRoute,
    private toastServ: ToastrService,
    private modalServ: BsModalService) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.tokenId = params.get('id');
      }
    );
    this.localSt.getItem('multisigwallets').subscribe({next: (wallets: any) => {
      const multisigwallet = wallets.items[wallets.currentIndex];
      this.multisigwallet = multisigwallet;
    }});

    this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

      if (!wallets || (wallets.length == 0)) {
        return;
      }
      this.wallet = wallets.items[wallets.currentIndex];
      //this.loadWallet();
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

    const smartContractAddress = this.multisigwallet.address;
    this.safeServ.signTransaction(chain, smartContractAddress, privateKey, keyPair.address, this.nonce, this.to, '', 18, this.amount).subscribe(
      {
        next: (retOfSig: any) => {

          const transaction = retOfSig.transaction;
          const transactionHash = retOfSig.transactionHash;
          const signature = retOfSig.signature;
          const body = {
            from: keyPair.address,
            address: this.multisigwallet.address,
            request: {
              type: 'Send',
              to: this.to,
              amount: this.amount,
              tokenId: this.tokenId,
              tokenName: this.tokenId
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
