import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-user-node-add',
  templateUrl: './user-node-add.component.html',
  styleUrls: ['./user-node-add.component.scss']
})
export class UserNodeAddComponent implements OnInit {
  wallet: any;
  id: string;
  to: string;
  tokenType: number;
  creditScore: number;
  senior: number;
  amount: number;
  root: string;
  modalRef: BsModalRef;
  mode: string;

  tokenTypes: any = [
    {
      value: 0,
      text:'Global'
    },
    {
      value: 1,
      text: 'National'
    }
    ,
    {
      value: 2,
      text: 'Regional'
    }
  ];
  constructor(
    private kanbanSmartContractServ: KanbanSmartContractService,
    private dataServ: DataService,
    private router: Router, 
    private utilServ: UtilService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.mode = 'create';
    this.route.paramMap.subscribe(
      (param: ParamMap) => {
        this.id = param.get('id');
        if(this.id) {
          this.mode = 'update';
        }
      }
    );
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
    let abi;
    let args;
    if(this.mode == 'create') {
      if(!this.to) {
        this.toastr.error('To cannot be empty');
        return;
      }
      abi = {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
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
            "internalType": "address",
            "name": "_root",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      };

      args = [
        this.utilServ.fabToExgAddress(this.to), 
        this.id, 
        this.amount,
        this.tokenType, 
        this.creditScore,
        this.senior,
        this.utilServ.fabToExgAddress(this.root),
        '0x'
      ];
    } else {
      abi = {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_tokenId",
            "type": "uint256"
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
            "internalType": "address",
            "name": "_root",
            "type": "address"
          }
        ],
        "name": "setTokenInfo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      };
      args = [
        this.id, 
        this.tokenType,
        this.creditScore,
        this.senior,
        this.utilServ.fabToExgAddress(this.root)
      ];
    }

    const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, environment.addresses.smartContract.smartContractUserNode, abi, args);
    if(ret2 && ret2.success && ret2._body && ret2._body.status == '0x1') {
      this.toastr.success('user node was added successfully');
      this.router.navigate(['/admin/user-nodes']);
    } else {
      this.toastr.error('Error while adding user node');
    }
  }
}
