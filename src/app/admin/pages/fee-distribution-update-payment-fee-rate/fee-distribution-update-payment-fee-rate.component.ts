import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoinService } from '../../../services/coin.service';
import { DataService } from '../../../services/data.service';
import { KanbanService } from '../../../services/kanban.service';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from '../../../services/kanban.smartcontract.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Web3Service } from '../../../services/web3.service';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-fee-distribution-update-payment-fee-rate',
  templateUrl: './fee-distribution-update-payment-fee-rate.component.html',
  styleUrls: ['./fee-distribution-update-payment-fee-rate.component.css']
})
export class FeeDistributionUpdatePaymentFeeRateComponent implements OnInit {

  modalRef: BsModalRef;
  to: string;
  walletAddress: string;
  owner: string;
  wallet: any;
  paymentFeeRate: number;
  
  constructor(
    private dataServ: DataService,
    private coinServ: CoinService,
    private utilServ: UtilService,
    private kanbanServ: KanbanService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private router: Router,
    private web3Serv: Web3Service,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.to = environment.addresses.smartContract.feeDistribution2;
    this.checkOwner();
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        this.walletAddress = walletAddress;
      }
    ); 
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 
    this.route.queryParamMap.subscribe(
      (map: any) => {
        const params = map.params;
        this.paymentFeeRate = params.paymentFeeRate;
      }
    );
  }

  checkOwner() {
    const abi = {
      "constant": true,
      "inputs": [
        
      ],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    };
    const args = [];
    const abiData = this.web3Serv.getGeneralFunctionABI(abi, args);
    this.kanbanServ.kanbanCall(this.to, abiData).subscribe(
      (ret: any) => {
        const kanbanAddress = '0x' + ret.data.substring(ret.data.length - 40);
        this.owner = this.utilServ.exgToFabAddress(kanbanAddress);
      }
    );
  }  

  update() {
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
      this.updateDo(seed);
    });
  }

  async updateDo(seed: Buffer) {
    
    const abi = {
      "constant": false,
      "inputs": [
        {
          "name": "_paymentFeeRate",
          "type": "uint256"
        }
      ],
      "name": "updatePaymentFeeRate",
      "outputs": [
        
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const args = [this.paymentFeeRate];
    const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.to, abi, args);
    if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
      this.toastr.success('Payment fee rate was updated successfully');
      this.router.navigate(['/admin/fee-distribution']);
    } else {
      this.toastr.error('Error while updating payment fee rate');
    }
  }

}
