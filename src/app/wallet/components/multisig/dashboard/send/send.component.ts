import { Component, OnInit } from '@angular/core';
import { MultisigService } from 'src/app/services/multisig.service';
import { PasswordModalComponent } from '../../../../../shared/modals/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { StorageMap } from '@ngx-pwa/local-storage';
import { SafeService } from 'src/app/services/safe.service';
import { CoinService } from 'src/app/services/coin.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import * as exaddr from '../../../../../lib/exaddr';
import BigNumber from 'bignumber.js';
@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit{
  nonce: number;
  to: string;
  toHex: string;
  decimals: number;
  amount: number;
  sendable: boolean;
  step: number = 1;
  tokenId: string;
  modalRef: BsModalRef;

  wallet: any;
  multisigwallet: any;
  ethAddress: string;
  kanbanAddress: string;
  balance: number;
  constructor(
    private multisigServ: MultisigService, 
    private safeServ: SafeService,
    private storage: StorageMap, 
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
        //this.decimals = Number(params.get('decimals'));




        this.storage.watch('multisigwallets').subscribe({next: (wallets: any) => {
          const multisigwallet = wallets.items[wallets.currentIndex];
          this.multisigwallet = multisigwallet;
          const address = multisigwallet.address;
    
          this.multisigServ.getAssets(this.multisigwallet.chain, address).subscribe(
            (ret: any) => {
              if(ret.success) {
                const data = ret.data;
                
                this.decimals = 18;
                if(this.tokenId == this.multisigwallet.chain) {
                  this.balance = new BigNumber(data.native).shiftedBy(-this.decimals).toNumber();
                } else {
                  const tokens = data.tokens;
                  for(let i = 0; i < tokens.ids.length; i++) {
                    const id = tokens.ids[i];
                    if(id == this.tokenId) {
                      if(tokens.decimals && tokens.decimals[i]) {
                        this.decimals = tokens.decimals[i];
                      }
                      this.balance = new BigNumber(tokens.balances[i]).shiftedBy(-this.decimals).toNumber();
                      break;
                    }
                  }
                }
              }
            }
          );
    
          this.multisigServ.getNonce(address).subscribe(
            {
              next: (ret: any) => {
                if(ret.success) {
                  this.nonce = ret.data;
                } else {
                  this.toastServ.info('Error while getting nonce');
                }
              },
              error: (error: any) => {
                this.toastServ.error(error);
              }
            }
          )
        }});



      }
    );


    this.storage.watch('ecomwallets').subscribe((wallets: any) => {

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

    this.toHex = this.to;
    const chain = this.multisigwallet.chain;
    if(chain == 'KANBAN') {
      try {
        this.toHex = exaddr.toLegacyAddress(this.toHex);
        this.toHex = this.utilServ.fabToExgAddress(this.toHex);

      } catch(e) {
        return this.toastServ.error('Invalid recipient address');
      }
    }

    this.step = 2;
  }

  action(event: string) {
    if(event == 'back') {
      this.step = 1;
      return;
    }


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
    this.safeServ.signTransaction(chain, smartContractAddress, privateKey, keyPair.address, this.nonce, this.toHex, this.tokenId, this.decimals, this.amount).subscribe(
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
              to: this.toHex,
              amount: this.amount,
              tokenId: this.tokenId,
              tokenName: this.utilServ.getTokenName(chain, this.tokenId)
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
                this.toastServ.success('Transaction was added to queue successfully.');
                this.router.navigate(['/wallet/multisig/dashboard/assets']);
              } else {
                this.toastServ.error(ret.message ? ret.message : 'Fail to create the proposal');
              }
            },
            error: (error) => {
              this.toastServ.error('Error while creating the proposal', error);
            }
          },
          );

        },
        error: (error) => {
          this.toastServ.error(error);
        }
      }
    );
  }

}
