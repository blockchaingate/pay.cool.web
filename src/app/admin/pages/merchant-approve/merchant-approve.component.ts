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
import { environment } from 'src/environments/environment';
import { CoinService } from 'src/app/services/coin.service';
import { ModifyReferralModalComponent } from './modify-referral.modal';

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
          if(ret.merchantNodeId) {
            this.nodeId = ret.merchantNodeId;
          }
          
          console.log('this.merchant====', this.merchant);
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
      this.approveDo(seed);
    });
  }

  modifyReferral() {
    this.modalRef = this.modalService.show(ModifyReferralModalComponent, { });
    this.modalRef.content.onClose.subscribe( (newReferral: string) => {
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
        this.modifyReferralDo(seed, newReferral);
      });
    });
  }

  async modifyReferralDo(seed: Buffer, newReferral: string) {
    try {
      const args = [
        this.merchant.id,
        this.utilServ.fabToExgAddress(newReferral)
      ];
      
      const abi = {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "_id",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "_newReferral",
            "type": "address"
          }
        ],
        "name": "updateMerchantReferral",
        "outputs": [
          
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      };

      const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, environment.addresses.smartContract.smartConractMerchantInfo, abi, args);

      if(ret2 && ret2.success && ret2._body && ret2._body.status == '0x1') {
        this.modifyReferralInDbDo(seed, newReferral);

      } else {
        this.toastr.error('Failed to modify merchant.');
      }
    } catch(e) {
    }
  }

  modifyReferralInDbDo(seed, newReferral) {
    const data = {
      id: this.merchant.id,
      referral: newReferral
    };

    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey;

    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  

    this.merchantServ.modifyReferral(data).subscribe(
      async (res: any) => {
        if(res && res.modifiedCount) {
          this.toastr.success('the merchant\'s referral was modified.');
          this.router.navigate(['/admin/merchants']);
        } else {
          this.toastr.error('Error while deleting merchant');
        }
      },
      (error: any) => {
        console.log('error=', error);
        this.toastr.error(error.error.error);
      }
    );
  }

  delete() {
    console.log('delete merchant for ', );

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
      this.deleteDo(seed);
    });

  }

  deleteDo(seed: Buffer) {
    const data = {
      id: this.merchant.id
    };

    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey;

    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  

    this.merchantServ.delete(data).subscribe(
      async (res: any) => {
        if(res && res.deletedCount) {
          this.toastr.success('merchant was deleted successfully');
        } else {
          this.toastr.error('Error while deleting merchant');
        }
      },
      (error: any) => {
        console.log('error=', error);
        this.toastr.error(error.error.error);
      }
    );

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

      if(ret2 && ret2.success && ret2._body && ret2._body.status == '0x1') {
        this.toastr.success('the merchant was approved.');
        this.router.navigate(['/admin/merchants']);
      } else {
        this.toastr.error('Failed to approve merchant.');  
      }
    } catch(e) {
    }
  }

  showName(name) {
    return this.utilServ.showName(name);
  }
}
