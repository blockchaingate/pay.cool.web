import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { UtilService } from 'src/app/services/util.service';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'app-merchant-node-add',
  templateUrl: './merchant-node-add.component.html',
  styleUrls: ['./merchant-node-add.component.scss']
})
export class MerchantNodeAddComponent implements OnInit {
  wallet: any;
  to: string;
  tokenType: number;
  creditScore: number;
  senior: number;
  modalRef: BsModalRef;

  tokenTypes: any = [
    {
      value: 0,
      text:'Senor'
    },
    {
      value: 1,
      text: 'Intermediate'
    }
    ,
    {
      value: 2,
      text: 'Junior'
    }
    
  ];
  constructor(
    private kanbanSmartContractServ: KanbanSmartContractService,
    private dataServ: DataService,
    private router: Router, 
    private utilServ: UtilService,
    private web3Serv: Web3Service,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 
  }

  confirm() {
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
      this.addNodeDo(seed);
    });
  }

  async addNodeDo(seed: Buffer) {
    const abi = {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "_tokenType",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "_creditScore",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_senior",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "uri",
          "type": "string"
        }
      ],
      "name": "safeMint",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };

    const args = [
      this.utilServ.fabToExgAddress(this.to), 
      this.tokenType, 
      this.creditScore,
      this.senior,
      '0x'
    ];

    const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, environment.addresses.smartContract.smartContractMerchantNode, abi, args);
    if(ret2 && ret2.ok && ret2._body && ret2._body.status == '0x1') {
      this.toastr.success('node was added successfully');
      this.router.navigate(['/admin/merchant-nodes']);
    } else {
      this.toastr.error('Error while adding merchant node');
    }
  }
}
