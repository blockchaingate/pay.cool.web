import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { KanbanService } from '../../../services/kanban.service';
import { KanbanSmartContractService } from '../../../services/kanban.smartcontract.service';
import { UtilService } from '../../../services/util.service';
import { Web3Service } from '../../../services/web3.service';
import { MerchantService } from '../../../services/merchant.service';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';
import { environment } from 'src/environments/environment';
import { CoinService } from 'src/app/services/coin.service';

@Component({
  selector: 'app-merchant-approve',
  templateUrl: './merchant-approve.component.html',
  styleUrls: ['./merchant-approve.component.scss']
})
export class MerchantApproveComponent implements OnInit {
  proxyAddress: string;
  isCoinPoolOwner: boolean;
  modalRef: BsModalRef;
  wallet: any;
  merchant: any;
  nodeId: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private kanbanServ: KanbanService,
    private web3Serv: Web3Service,
    private utilServ: UtilService,
    private dataServ: DataService,
    private coinServ: CoinService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private merchantServ: MerchantService) { }

  ngOnInit() {
    this.dataServ.currentWallet.subscribe(
      (wallet: string) => {
        this.wallet = wallet;
      }
    ); 

    this.isCoinPoolOwner = false;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.merchantServ.getMerchant(id).subscribe(
        async (ret: any) => {
          this.merchant = ret;
        }
      );
    }
  }

  approve() {

    if(!this.nodeId) {
      this.toastr.error('Node id should be provided.');
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

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
      this.spinner.show();
      this.approveDo(seed);
    });
  }

  enableCredit() {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
      this.spinner.show();
      this.enableCreditDo(seed);
    });    
  }

  async enableCreditDo(seed: Buffer) {
    try {
      const args = [
        this.merchant.id
      ];
      const abi = {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "_id",
            "type": "bytes32"
          }
        ],
        "name": "enableCredit",
        "outputs": [
          
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      };
  
      const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, environment.addresses.smartContract.smartConractMerchantInfo, abi, args);
  
      if(ret2 && ret2.ok && ret2._body && ret2._body.status == '0x1') {
        this.toastr.success('the merchant was enabled credit.');
        this.router.navigate(['/admin/merchants']);
      } else {
        this.toastr.error('Failed to enable credit merchant.');
        this.spinner.hide();  
      }
    } catch(e) {
      this.spinner.hide();
    }
    }

async approveDo(seed: Buffer) {
  try {
    const args = [
      this.merchant.id,
      this.nodeId
    ];
    
    const abi = {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_id",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "_merchantNodeId",
          "type": "uint256"
        }
      ],
      "name": "approveMerchant",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };

    const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, environment.addresses.smartContract.smartConractMerchantInfo, abi, args);

    if(ret2 && ret2.ok && ret2._body && ret2._body.status == '0x1') {
      this.toastr.success('the merchant was approved.');
      this.router.navigate(['/admin/merchants']);
      this.spinner.hide();
    } else {
      this.toastr.error('Failed to approve merchant.');
      this.spinner.hide();  
    }
  } catch(e) {
    this.spinner.hide();
  }
  }

  showName(name) {
    return this.utilServ.showName(name);
  }
}
