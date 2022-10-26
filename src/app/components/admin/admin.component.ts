import { Component, OnInit } from '@angular/core';
import { PasswordModalComponent } from '../../shared/modals/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Web3Service } from '../../services/web3.service';
import { UtilService } from '../../services/util.service';
import { environment } from '../../../environments/environment';
import { StarService } from '../../services/star.service';
import { UserReferralService } from 'src/app/services/userreferral.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  walletAddr: string;
  rootWalletAddr: string;
  referal: string;
  from: string;
  children: any;
  noFollower: boolean;
  to: string;
  txid: string;
  followers: any;
  isContractOwner: boolean;
  smartContractAddr: string;
  walletAdd: string;
  modalRef: BsModalRef;
  coins: any;
  wallet: any;
  constructor(
    private toastr: ToastrService,
    private localSt: LocalStorage,
    private web3Serv: Web3Service,
    private starServ: StarService,
    public utilServ: UtilService,
    private userreferralServ: UserReferralService,
    private kanbanSmartContractServ:KanbanSmartContractService,
    private modalService: BsModalService) { }

  tranformAddress(address: string) {
    if(address.indexOf('0x') < 0) {
      address = this.utilServ.fabToExgAddress(address);
    }
    return address;
  }

  ngOnInit(): void {
    this.smartContractAddr = environment.addresses.smartContract.SEVENSTAR_ENROLLMENT;
    this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {
      if (!wallets || (wallets.length == 0)) {
        return;
      }
      this.wallet = wallets.items[wallets.currentIndex];
      this.walletAdd = this.wallet.addresses.filter(c => c.name === 'FAB')[0].address;
      this.starServ.isContractOwner(this.walletAdd).subscribe(
        (res: any) => {
          console.log('res==', res);
          this.isContractOwner = res.isContractOwner;
        }
      );      
    });

    this.rootWalletAddr = environment.production ? '0x9d95ee21e4f1b05bbfd0094daf4ce110deb00931' : '0x0000000000000000000000000000000000000001';
    this.userreferralServ.getTree(this.rootWalletAddr).subscribe(
      (res: any) => {
        this.children = res;
      }
    );
  }

  async execSmartContract(seed, abi, args) {
    const abihex = this.web3Serv.getGeneralFunctionABI(abi, 
      args);
    console.log('abihex=', abihex);

    const ret = await this.kanbanSmartContractServ.execSmartContractAbiHex(seed, this.smartContractAddr, abihex);
    if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
      this.txid = ret._body.transactionHash;
      this.referal = '';
      this.walletAddr = '';
      this.from = '';
      this.to = '';
      this.toastr.success('Transaction was made, txid is: ' + this.txid);
    } else {
      this.toastr.error('Transaction failed');
    }

  }
  
  join() {

    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };   

    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
      //console.log('seed===', seed);
      const abi = {
        "constant": false,
        "inputs": [
          {
            "name": "_walletAddr",
            "type": "address"
          },
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
      };
      const args =
        [
          this.tranformAddress(this.walletAddr), 
          this.tranformAddress(this.referal)
        ];
      this.execSmartContract(seed, abi, args);
    }); 
  }

  deleteLink() {

    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };   

    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
      //console.log('seed===', seed);
      const abi = {
        "constant": false,
        "inputs": [
          {
            "name": "_walletAddr",
            "type": "address"
          }
        ],
        "name": "deleteLink",
        "outputs": [
          
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      };
      const args = [
          this.tranformAddress(this.walletAddr)
        ];
      this.execSmartContract(seed, abi, args);
    }); 
  }

  joinSubtree() {

    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };   

    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
      //console.log('seed===', seed);
      const abi = {
        "constant": false,
        "inputs": [
          {
            "name": "_walletAddr",
            "type": "address"
          },
          {
            "name": "_referral",
            "type": "address"
          }
        ],
        "name": "joinSubtree",
        "outputs": [
          
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      };
      const args = 
        [
          this.tranformAddress(this.walletAddr), 
          this.tranformAddress(this.referal)
        ];
      this.execSmartContract(seed, abi, args);
    }); 
  }

  modifyReferRecord() {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };  

    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
      //console.log('seed===', seed);
      const abi = {
        "constant": false,
        "inputs": [
          {
            "name": "_walletAddr",
            "type": "address"
          },
          {
            "name": "_referral",
            "type": "address"
          },
          {
            "name": "_coinType",
            "type": "uint32"
          }
        ],
        "name": "transferToJoin",
        "outputs": [
          
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
      const args = 
        [
          this.tranformAddress(this.from), 
          this.tranformAddress(this.to)
        ];
      this.execSmartContract(seed, abi, args);
    }); 
  }

  getFollowers() {
    this.followers = [];
    this.noFollower = false;
    const abi = {
      "constant": true,
      "inputs": [
        {
          "name": "_walletAddr",
          "type": "address"
        }
      ],
      "name": "getMyFollower",
      "outputs": [
        {
          "name": "",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    };
    const args = 
      [
        this.tranformAddress(this.rootWalletAddr)
      ]; 
    const to = environment.addresses.smartContract.SEVENSTAR_ENROLLMENT; 
    this.kanbanSmartContractServ.call(to, abi, args).subscribe(
      (ret: any) => {
        console.log('ret==', ret);
        const data = ret.data;
        const decoded = this.web3Serv.decodeParameter('address[]', data);
        console.log('decoded==', decoded);
        if(!decoded || decoded.length == 0) {
          this.noFollower = true;
          return;
        }
        this.followers = decoded.map(
          item => this.utilServ.exgToFabAddress(item)
        );

      }
    );
  }
}
