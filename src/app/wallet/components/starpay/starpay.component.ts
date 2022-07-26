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
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-wallet-starpay',
  providers: [],
  templateUrl: './starpay.component.html',
  styleUrls: ['./starpay.component.scss']
})
export class StarpayComponent implements OnInit{
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
            if(this.data) {
              this.args = this.web3Serv.decodeData(['bytes32', 'uint32', 'uint256','uint256', 'address[]', 'address[]'], this.data.substring(10));
            }
        });

        this.dataServ.currentWalletAddress.subscribe(
            (walletAddress: string) => {
                if(walletAddress) {
                  this.walletAddress = walletAddress;
                  if(this.id) {
                    this.starServ.get7StarPayOrder(this.id, walletAddress).subscribe(
                      (ret: any) => {
                        console.log('ret from here=', ret);
                        if(ret && ret.ok) {
                          this.order = ret._body;
                        }
                      }
                    );
                  } else {
                    this.starServ.getParents(walletAddress).subscribe(
                        (ret: any) => {
                            console.log('ret for getParents=', ret);
                            this.parents = ret.map(item => this.utilServ.fabToExgAddress(item));
                        }
                    );
                  }
                }
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
        abi = {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "_orderID",
              "type": "bytes32"
            },
            {
              "internalType": "uint32",
              "name": "_paidCoin",
              "type": "uint32"
            },
            {
              "internalType": "uint256",
              "name": "_totalAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_totalTax",
              "type": "uint256"
            },
            {
              "internalType": "address[]",
              "name": "_regionalAgents",
              "type": "address[]"
            },
            {
              "internalType": "bytes32[]",
              "name": "_rewardBeneficiary",
              "type": "bytes32[]"
            },
            {
              "internalType": "bytes",
              "name": "_rewardInfo",
              "type": "bytes"
            }
          ],
          "name": "chargeFundsWithFee",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        };
        console.log('this.order====', this.order);
        args = [
          '0x' + this.id,
          this.coinServ.getCoinTypeIdByName(this.order.currency),
          '0x' + new BigNumber(this.order.totalAmount).shiftedBy(18).toString(16),
          '0x' + new BigNumber(this.order.totalTax).shiftedBy(18).toString(16),
          this.order.regionalAgents,
          this.order.rewardBeneficiary,
          this.order.rewardInfo
        ];
        to = this.order.feeChargerSmartContractAddress;
      } else
      if(this.templateId) {
        const ret1 = await this.starServ.createOrderFromTemplatePromise(this.templateId);
        if(ret1 && ret1.ok) {
          const order = ret1._body;
          const ret2 = await this.starServ.get7StarPayOrderPromise(order._id, this.walletAddress);
          if(ret2.ok) {
            const payorder = ret2._body;
            abi = {
              "inputs": [
                {
                  "internalType": "bytes32",
                  "name": "_orderID",
                  "type": "bytes32"
                },
                {
                  "internalType": "uint32",
                  "name": "_paidCoin",
                  "type": "uint32"
                },
                {
                  "internalType": "uint256",
                  "name": "_totalAmount",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "_totalTax",
                  "type": "uint256"
                },
                {
                  "internalType": "address[]",
                  "name": "_regionalAgents",
                  "type": "address[]"
                },
                {
                  "internalType": "bytes32[]",
                  "name": "_rewardBeneficiary",
                  "type": "bytes32[]"
                },
                {
                  "internalType": "bytes",
                  "name": "_rewardInfo",
                  "type": "bytes"
                }
              ],
              "name": "chargeFundsWithFee",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            };
            args = [
              '0x' + order._id,
              this.coinServ.getCoinTypeIdByName(payorder.currency),
              '0x' + new BigNumber(payorder.totalAmount).shiftedBy(18).toString(16),
              '0x' + new BigNumber(payorder.totalTax).shiftedBy(18).toString(16),
              payorder.regionalAgents,
              payorder.rewardBeneficiary,
              payorder.rewardInfo
            ];
            to = payorder.feeChargerSmartContractAddress;
          }
        }
        
        
      }

      const ret = await this.kanbanSmartContractServ.execSmartContract(seed, to, abi, args);
      this.spinner.hide();
      if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
        this.toastr.success('the transaction was procssed successfully');
      } else {
        this.toastr.error('Failed to process the transaction, txid:' + ret._body.transactionHash);
      }
    }

}