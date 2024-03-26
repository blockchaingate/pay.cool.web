import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { environment } from 'src/environments/environment';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from 'src/app/services/util.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-user-referral-edit',
  templateUrl: './user-referral-edit.component.html',
  styleUrls: ['./user-referral-edit.component.scss']
})
export class UserReferralEditComponent implements OnInit {
  id: string;
  wallet: any;
  modalRef: BsModalRef;
  newReferral: string;
  constructor(
    private router: Router,
    private dataServ: DataService,
    private toastr: ToastrService,
    private utilServ: UtilService,  
    private kanbanSmartContractServ: KanbanSmartContractService,
    private modalService: BsModalService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 

    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const id = params.get('id');
        this.id = id;
      }
    );
  }

  modifyReferral() {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
      this.modifyReferralDo(seed);
    });
  }

  async modifyReferralDo(seed) {
    const abi = {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_newReferral",
          "type": "address"
        }
      ],
      "name": "modifyReferral",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
    const args = [
      this.utilServ.fabToExgAddress(this.id),
      this.utilServ.fabToExgAddress(this.newReferral)
    ];
    const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, environment.addresses.smartContract.smartConractAdressReferral, abi, args);
    if(ret2 && ret2.success && ret2._body && ret2._body.status == '0x1') {
      this.toastr.success('user referral was change successfully');
      this.router.navigate(['/admin/users']);
    } else {
      this.toastr.error('Error while changing user referral');
    }
  }
}
