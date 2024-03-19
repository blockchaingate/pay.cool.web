import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { UtilService } from 'src/app/services/util.service';
import { UserReferralService } from 'src/app/services/userreferral.service';

@Component({
  selector: 'app-user-node-link-add',
  templateUrl: './user-node-link-add.component.html',
  styleUrls: ['./user-node-link-add.component.scss']
})
export class UserNodeLinkAddComponent implements OnInit {
  wallet: any;
  user: string;
  userNodeId: number;
  modalRef: BsModalRef;

  constructor(
    private kanbanSmartContractServ: KanbanSmartContractService,
    private dataServ: DataService,
    private router: Router, 
    private utilServ: UtilService,
    private activeRoute: ActivatedRoute,
    private modalService: BsModalService,
    private userreferralServ: UserReferralService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 
    
    this.activeRoute.paramMap.subscribe((params: ParamMap) => {
      if(params) {
        if(params.get('address')) {
          this.user = params.get('address');
        }
        if(params.get('userNodeId')) {
          this.userNodeId = Number(params.get('userNodeId'));
        }
      } 
      
      
    });

  }

  confirm() {
    if(!this.user) {
      this.toastr.error('User cannot be empty');
      return;
    }

    const initialState = { 
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.userreferralServ.get(this.user).subscribe(
      (ret: any) => { 
        if(!ret || !ret.status) {
          this.toastr.error('User is not in paycool');
          return;
        }

        const status = ret.status % 8;

        this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
          this.addNodeLinkDo(seed, status);
        });
      }
    );

  }

  async addNodeLinkDo(seed: Buffer, status: number) {
    const abi = {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "internalType": "uint16",
          "name": "_newStatus",
          "type": "uint16"
        }
      ],
      "name": "modifyStatus",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };

    const args = [
      this.utilServ.fabToExgAddress(this.user), 
      this.userNodeId * 8 + status
    ];

    const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, environment.addresses.smartContract.smartConractAdressReferral, abi, args);
    if(ret2 && ret2.success && ret2._body && ret2._body.status == '0x1') {
      this.toastr.success('node link was added successfully');
      this.router.navigate(['/admin/user-node-links']);
    } else {
      this.toastr.error('Error while adding user node link');
    }
  }
}
