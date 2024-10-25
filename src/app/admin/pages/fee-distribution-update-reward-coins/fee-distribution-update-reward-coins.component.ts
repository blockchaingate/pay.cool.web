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
  selector: 'app-fee-distribution-update-reward-coins',
  templateUrl: './fee-distribution-update-reward-coins.component.html',
  styleUrls: ['./fee-distribution-update-reward-coins.component.css']
})
export class FeeDistributionUpdateRewardCoinsComponent implements OnInit {
  modalRef: BsModalRef;
  to: string;
  walletAddress: string;
  owner: string;
  wallet: any;
  coin1: string;
  percentage1: number;
  coin2: string;
  percentage2: number;
  coin3: string;
  percentage3: number;  

  
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
        this.coin1 = params.coin1;
        this.coin2 = params.coin2;
        this.coin3 = params.coin3;
        this.percentage1 = params.percentage1;
        this.percentage2 = params.percentage2;
        this.percentage3 = params.percentage3;
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
          "name": "_tokens",
          "type": "uint32[]"
        },
        {
          "name": "_tokenPercents",
          "type": "uint256[]"
        }
      ],
      "name": "updateTokensAndPercents",
      "outputs": [
        
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const args = [[
      this.coinServ.getCoinTypeIdByName(this.coin1),
      this.coinServ.getCoinTypeIdByName(this.coin2),
      this.coinServ.getCoinTypeIdByName(this.coin3)
    ], [
      this.percentage1,
      this.percentage2,
      this.percentage3
    ]];
    const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.to, abi, args);
    if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
      this.toastr.success('reward coins was updated successfully');
      this.router.navigate(['/admin/fee-distribution']);
    } else {
      this.toastr.error('Error while updating reward coin');
    }
  }
}
