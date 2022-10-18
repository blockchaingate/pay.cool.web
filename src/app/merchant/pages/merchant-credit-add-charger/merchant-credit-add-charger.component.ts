import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-merchant-credit-add-charger',
  templateUrl: './merchant-credit-add-charger.component.html',
  styleUrls: ['./merchant-credit-add-charger.component.scss']
})
export class MerchantCreditAddChargerComponent implements OnInit {
  address: string;
  modalRef: BsModalRef;
  merchantId: string;
  wallet: any;

  constructor(
    private dataServ: DataService,
    private router: Router,
    private utilServ: UtilService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private modalService: BsModalService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 
    this.dataServ.currentMyStore.subscribe(
      (store: any) => {
        if(store && store._id) {
          this.merchantId = store.id;
         if(store.status != 2) {
          this.toastr.error('your store is not approved');
         }
        }
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
      this.addCreditChargerDo(seed);
    });
  }

  async addCreditChargerDo(seed: Buffer) {
    const abi = {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_id",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "_creditCharger",
          "type": "address"
        }
      ],
      "name": "addCreditCharger",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };

    const args = [
      this.merchantId, 
      this.utilServ.fabToExgAddress(this.address), 
    ];

    console.log('args====', args);
    const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, environment.addresses.smartContract.smartConractMerchantInfo, abi, args);
    if(ret2 && ret2.ok && ret2._body && ret2._body.status == '0x1') {
      this.toastr.success('merchant credit charger was added successfully');
      this.router.navigate(['/merchants/merchant-credit']);
    } else {
      this.toastr.error('Error while adding merchant credit charger');
    }
  }  
}
