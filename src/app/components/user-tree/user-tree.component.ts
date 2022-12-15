import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UserReferralService } from '../../services/userreferral.service';
import { PasswordModalComponent } from '../../shared/modals/password-modal/password-modal.component';
import { KanbanService } from 'src/app/services/kanban.service';
import { UtilService } from 'src/app/services/util.service';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-user-tree',
  templateUrl: './user-tree.component.html',
  styleUrls: ['./user-tree.component.scss']
})
export class UserTreeComponent implements OnInit {
  wallets: any;
  wallet: any;
  refCode: string;
  refCodeComeIn = false;
  myReferralUrl: string;
  walletAddress: string;
  user: string;
  referral: string;

  errMsg: string;
  modalRef: any;

  constructor(
    private modalService: BsModalService,
    private utilServ: UtilService,
    private toastr: ToastrService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private route: ActivatedRoute, 
    private localSt: LocalStorage, private userreferralServ: UserReferralService) { }


  ngOnInit() {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const refCode = params['ref'];
        const id = params['id'];
        if (refCode) {
          if(refCode == environment.addresses.Referral_ROOT) {
            return;
          }
          this.userreferralServ.checkAddress(refCode).subscribe(
            (res: any) => {
              if (res && res.isValid) {
                this.refCode = refCode;
                this.refCodeComeIn = true;
                this.localSt.setItem('7star_ref', refCode).subscribe(() => { });
              } else {
                this.errMsg = 'Invalid referral code11';
              }
            });
        } else {
          this.localSt.getItem('7star_ref').subscribe(
            (refCode: string) => {
              console.log('refCode===',refCode);
              if(refCode) {
                this.refCode = refCode;
                this.refCodeComeIn = true;
              }
            }
          );
        }


      }
    )

    this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

      if(!wallets || (wallets.length == 0)) {
        return;
      }
      this.wallets = wallets;
      this.wallet = this.wallets.items[this.wallets.currentIndex];
      
      this.loadWallet();

    });    
  }

  loadWallet() {
    const addresses = this.wallet.addresses;
    const walletAddressItem = addresses.filter(item => item.name == 'FAB')[0];
    this.walletAddress = walletAddressItem.address;

    this.user = this.walletAddress;
    this.userreferralServ.checkAddress(this.walletAddress).subscribe(
      (res: any) => {
        console.log('res in checkAddress=', res);
        if(res && res.isValid) {
          this.myReferralUrl = window.location.href + '?ref=' + this.walletAddress;
          


        }
      }
    );
    
  }


  joinForFree() {
    if(this.refCode) {
      this.refCode = this.refCode.trim();
    }
    if(!this.refCode || this.refCode === this.walletAddress) {
      this.errMsg = "Invalid referral code";
      return;
    }

    if(this.refCode != environment.addresses.Referral_ROOT) {
    this.userreferralServ.checkAddress(this.refCode).subscribe(
      (res: any) => {
        if (res && res.isValid) {
          this.joinProcess();
        } else {
          this.errMsg = 'Invalid referral code';
          return;
        }
      });
    } else {
      this.joinProcess();
    }
  }

  joinProcess() {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: any) => {
      this.joinProcessDo(seed);
    });
  }

  joinProcessDo(seed) {
    if(!this.refCode) {
      console.log('no refCode');
      return;
    }
    const abi = {
      "inputs": [
        {
          "internalType": "address",
          "name": "_referral",
          "type": "address"
        }
      ],
      "name": "createAccount",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const hexAddress = this.utilServ.fabToExgAddress(this.refCode);
    this.kanbanSmartContractServ.execSmartContract(seed, environment.addresses.smartContract.smartConractAdressReferral, abi, [hexAddress]).then(
      (res) => {
        if(res && res.ok && res._body && res._body.status == '0x1') {
          this.toastr.success('Join as a member successfully');
        } else {
          this.toastr.error('Failed to join as a member');
        }
      }
    );
  
  }

}
