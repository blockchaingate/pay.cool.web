import { Component, OnInit } from '@angular/core';
import { PasswordModalComponent } from '../../shared/modals/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Web3Service } from '../../services/web3.service';
import { UtilService } from '../../services/util.service';
import { environment } from '../../../environments/environment';
import { UserReferralService } from 'src/app/services/userreferral.service';
import { statuses } from '../../config/statuses';
import { ProjectService } from 'src/app/services/project.service';
import { metaforceProjectId } from '../../config/projectId';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  statusOfMetaforce: number;
  status: number;
  statuses: any = statuses;

  referal: string;
  user: string;
  users: string;
  txid: string;
  isContractOwner: boolean;
  smartContractAddr: string;
  walletAdd: string;
  userreferal: string;
  children: any;
  modalRef: BsModalRef;
  wallet: any;

  constructor(
    private toastr: ToastrService,
    private localSt: LocalStorage,
    private web3Serv: Web3Service,
    private userReferralServ: UserReferralService,
    private projectServ: ProjectService,
    public utilServ: UtilService,
    private kanbanSmartContractServ:KanbanSmartContractService,
    private modalService: BsModalService) { }

  tranformAddress(address: string) {
    if(address.indexOf('0x') < 0) {
      address = this.utilServ.fabToExgAddress(address);
    }
    return address;
  }

  ngOnInit(): void {
    this.smartContractAddr = environment.addresses.smartContract.smartConractAdressReferral;
    this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {
      if (!wallets || (wallets.length == 0)) {
        return;
      }
      this.wallet = wallets.items[wallets.currentIndex];
      this.walletAdd = this.wallet.addresses.filter(c => c.name === 'FAB')[0].address;
      this.userReferralServ.isContractOwner(this.walletAdd).subscribe(
        (res: any) => {
          console.log('res==', res);
          this.isContractOwner = res.isContractOwner;
        }
      );      
    });

  }

  async execSmartContract(seed, abi, args) {
    const abihex = this.web3Serv.getGeneralFunctionABI(abi, 
      args);
    console.log('abihex=', abihex);

    const ret = await this.kanbanSmartContractServ.execSmartContractAbiHex(seed, this.smartContractAddr, abihex);
    if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
      this.txid = ret._body.transactionHash;
      this.referal = '';
      this.user = '';
      this.toastr.success('Transaction was made, txid is: ' + this.txid);
    } else {
      this.toastr.error('Transaction failed');
    }

  }
  
  doWithAbiArgs(abi, args) {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };   

    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
      //console.log('seed===', seed);

      this.execSmartContract(seed, abi, args);
    }); 
  }

  createAccountByAdmin() {
    if(!this.status) {
      this.toastr.info('Status not selected');
      return;
    }
    const abi = {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_referral",
          "type": "address"
        },
        {
          "internalType": "uint16",
          "name": "_status",
          "type": "uint16"
        }
      ],
      "name": "createAccountByAdmin",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };

    const args =
      [
        this.tranformAddress(this.user), 
        this.tranformAddress(this.referal),
        this.status
    ];
    console.log('args for createAccountByAdmin====', args);
    this.doWithAbiArgs(abi, args);
  }

  modifyReferRecord() {
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
    };
    const args = 
      [
        this.tranformAddress(this.user), 
        this.tranformAddress(this.referal)
    ];
    this.doWithAbiArgs(abi, args);
  }

  modifyReferralAndStatus() {
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
        },
        {
          "internalType": "uint16",
          "name": "_newStatus",
          "type": "uint16"
        }
      ],
      "name": "modifyReferralAndStatus",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const args = 
      [
        this.tranformAddress(this.user), 
        this.tranformAddress(this.referal),
        this.status
    ];
    this.doWithAbiArgs(abi, args);
  }

  modifyStatus() {
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
    const args = 
      [
        this.tranformAddress(this.user), 
        this.status
    ];
    this.doWithAbiArgs(abi, args);
  }

  createMultipleAccounts() {
    const abi = {
      "inputs": [
        {
          "internalType": "bytes32[]",
          "name": "_users",
          "type": "bytes32[]"
        },
        {
          "internalType": "address",
          "name": "_referral",
          "type": "address"
        }
      ],
      "name": "createMultipleAccounts",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const users = this.users.split(',').map(item => this.utilServ.fabToExgAddress(item.trim()));
    const args = [
      users,
      this.tranformAddress(this.referal)
    ]
    this.doWithAbiArgs(abi, args);
  }

  modifyReferralForUsers() {
    const abi = {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_users",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "_newReferral",
          "type": "address"
        }
      ],
      "name": "modifyReferralForUsers",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const users = this.users.split(',').map(item => this.utilServ.fabToExgAddress(item.trim()));
    const args = [
      users,
      this.tranformAddress(this.referal)
    ]
    this.doWithAbiArgs(abi, args);
  }

  getReferral() {
    this.userreferal = '';
    this.userReferralServ.get(this.user).subscribe(
      (user: any) => {
        this.userreferal = user.referral;
      }
    );
  }

  getChildren() {
    this.children = null;
    this.userReferralServ.getChildren(this.user, 100, 0).subscribe(
      (users: any) => {
        if(users && users.length > 0) {
          this.children = users.map(item => item.user);
        }
      }
    );
  }

  getStatusOfMetaforce() {
    this.projectServ.getProjectUser(metaforceProjectId, this.user).subscribe(
      (user: any) => {
        if(!user) {
          this.statusOfMetaforce = -1;
          return;
        }
        let status = user.newStatus;
        if(user.status > status) {
          status = user.status;
        }
        this.statusOfMetaforce = status;
      }
    );
  }
}
