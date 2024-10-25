import { Component, OnInit } from '@angular/core';
import { UserpayService } from 'src/app/services/userpay.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../shared/modals/password-modal/password-modal.component';
import { ToastrService } from 'ngx-toastr';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { Web3Service } from 'src/app/services/web3.service';
import { UtilService } from 'src/app/services/util.service';
import { UserReferralService } from 'src/app/services/userreferral.service';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit {
  walletAdd: string;
  isValidMember: boolean;
  referral: string;
  wallet: any;
  modalRef: BsModalRef;
  to: string;

  constructor(
    private modalService: BsModalService,
    private toastr: ToastrService,    
    private utilServ: UtilService,
    private storage: StorageMap,
    private web3Serv: Web3Service,
    private kanbanSmartContractServ:KanbanSmartContractService,
    private userreferalServ: UserReferralService) { }

  ngOnInit(): void {
    this.to = '0x6864ac918b94976e175001468aa45733b142fa49';
    this.storage.get('ecomwallets').subscribe((wallets: any) => {
      if (!wallets || (wallets.length == 0)) {
        return;
      }
      this.wallet = wallets.items[wallets.currentIndex];
      this.walletAdd = this.wallet.addresses.filter(c => c.name === 'FAB')[0].address;
      this.userreferalServ.checkAddress(this.walletAdd).subscribe(
        (ret: any) => {
          this.isValidMember = ret.isValid;
        }
      );
    });
    
  }

  join() {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {

      const abihex = this.web3Serv.getGeneralFunctionABI(
        {
          "constant": false,
          "inputs": [
            {
              "name": "_referral",
              "type": "address"
            }
          ],
          "name": "join",
          "outputs": [
            
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        }, [this.utilServ.fabToExgAddress(this.referral)]
      );
      const ret = await this.kanbanSmartContractServ.execSmartContractAbiHex(seed, this.to, abihex);

    });    
  }
}
