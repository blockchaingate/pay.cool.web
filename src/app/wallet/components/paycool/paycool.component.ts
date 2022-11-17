import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { KanbanService } from '../../../services/kanban.service';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from '../../../services/kanban.smartcontract.service';
import { ToastrService } from 'ngx-toastr';
import { Web3Service } from '../../../services/web3.service';
import { StarService } from '../../../services/star.service';
import { UtilService } from '../../../services/util.service';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';
import { CoinService } from 'src/app/services/coin.service';

@Component({
  selector: 'app-wallet-paycool',
  providers: [],
  templateUrl: './paycool.component.html',
  styleUrls: ['./paycool.component.scss']
})
export class PaycoolComponent implements OnInit{
    modalRef: BsModalRef;
    wallet: any;
    name: string;
    to: string;
    walletAddress: string;
    templateId: string;
    tab: string;
    data: string;
    args: any;
    order: any;
    id: string;
    transactionHistories: any;
    parents: string[];
    payType: string;

    constructor(    
        private kanbanSmartContractServ: KanbanSmartContractService,
        private dataServ: DataService,
        private route: ActivatedRoute,
        private coinServ: CoinService,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private starServ: StarService,
        private web3Serv: Web3Service,
        private utilServ: UtilService,
        public kanbanServ: KanbanService,
        private modalService: BsModalService,) {}
    ngOnInit() {
        this.tab =  'pay';
        this.parents = [];
        this.payType = 'WithFee';
        this.dataServ.currentWallet.subscribe(
            (wallet: any) => {
              this.wallet = wallet;
            }
        ); 

        this.route.queryParams.subscribe(params => {
            this.name = params['name'];
            this.to = params['to'];
            this.data = params['data'];
            this.id = params['i'];
            this.templateId = params['t'];
            console.log('ttttid=', this.templateId);
            if(this.data) {
              this.args = this.web3Serv.decodeData(['bytes32', 'uint32', 'uint256','uint256', 'address[]', 'address[]'], this.data.substring(10));
            }
        });

        this.dataServ.currentWalletAddress.subscribe(
            (walletAddress: string) => {
                if(walletAddress) {
                  this.walletAddress = walletAddress;
                  if(this.id) {
                    this.starServ.getPaycoolRewardInfo(this.id, walletAddress, this.payType).subscribe(
                      (ret: any) => {
                        console.log('ret from here=', ret);
                        this.order = ret;
                      }
                    );
                  }
                }
            }
        );

        
    }
    changePayType(type:string) {
      this.payType = type;
      this.starServ.getPaycoolRewardInfo(this.id, this.walletAddress, this.payType).subscribe(
        (ret: any) => {
          console.log('ret from here=', ret);
          this.order = ret;
        }
      );
    }

    changeTab(tab: string) {
      this.tab = tab;
      if(tab == "history") {
        this.starServ.getTransactionHisotryForCustomer(this.walletAddress).subscribe(
          (ret: any) => {
            if(ret && ret.ok) {
              this.transactionHistories = ret._body;
            }
          }
        );
      }
    }



    submit() {

        const initialState = {
            pwdHash: this.wallet.pwdHash,
            encryptedSeed: this.wallet.encryptedSeed
        };          
          
        this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
      
        this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
            this.spinner.show();
            this.submitDo(seed);
        });        
    }

    async submitDo(seed: Buffer) {
      console.log('submitDo start');
      let abi;
      let args;
      let to;
      if(this.to) {
        abi = {
          "constant": false,
          "inputs": [
            {
              "name": "_orderID",
              "type": "bytes32"
            },
            {
              "name": "_coinType",
              "type": "uint32"
            },
            {
              "name": "_totalAmount",
              "type": "uint256"
            },
            {
              "name": "_tax",
              "type": "uint256"
            },
            {
              "name": "_regionalAgents",
              "type": "address[]"
            },
            {
              "name": "_rewardBeneficiary",
              "type": "address[]"
            }
          ],
          "name": "chargeFundsWithFee",
          "outputs": [
            {
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        };

      this.args[5] = this.parents;
      
      args = [
          this.args[0],
          this.args[1],
          this.args[2],
          this.args[3],
          this.args[4],
          this.args[5]
      ];
      to = this.to;
      } else 
      if(this.id){
        const params = this.order.params;
        console.log('params==', params);

        let ret = await this.kanbanSmartContractServ.execSmartContractAbiHex(seed, params[0].to, params[0].data);
        if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
          ret = await this.kanbanSmartContractServ.execSmartContractAbiHex(seed, params[1].to, params[1].data);
          if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
            this.toastr.success('the transaction was procssed successfully');
          } else {
            this.toastr.error('Failed to chargeFund with fee, txid:' + ret._body.transactionHash);
          }
        } else {
          this.toastr.error('Failed to authorizeOperator, txid:' + ret._body.transactionHash);
        }

      } else
      if(this.templateId) {
        const ret1 = await this.starServ.createOrderFromTemplatePromise(this.templateId);
        if(ret1 && ret1._id) {
          this.id = ret1._id;
          this.starServ.getPaycoolRewardInfo(this.id, this.walletAddress, this.payType).subscribe(
            (ret: any) => {
              this.order = ret;

              this.submitDo(seed);
            }
          );
        }
        
        
      }


    }

}