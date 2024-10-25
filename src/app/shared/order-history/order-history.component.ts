import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { UtilService } from '../../services/util.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { PasswordModalComponent } from '../modals/password-modal/password-modal.component';
import { OrderRewardsComponent } from './rewards/rewards.component';
import { RequestRefundComponent } from '../modals/request-refund/request-refund.component';
import { RefundComponent } from '../modals/refund/refund.component';
import { KanbanSmartContractService } from '../../services/kanban.smartcontract.service';
import { ToastrService } from 'ngx-toastr';
import { UserpayService } from '../../services/userpay.service';
import { CoinService } from '../../services/coin.service';
import { Web3Service } from '../../services/web3.service';
import { KanbanService } from '../../services/kanban.service';
import { OrderService } from '../../services/order.service';

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss', '../../../table.scss']
})
export class OrderHistoryComponent implements OnInit {
    @Input() transactionHistories: any;
    @Input() wallet: any;
    @Input() type: string;
    
    walletAddress: string;
    modalRef: BsModalRef;
    realOrder: any;
    refundData: any;
    requestRefundData: any;
    op: string;
    order: any;
    constructor(
        private dataServ: DataService,
        private userpayServ: UserpayService,
        private coinServ: CoinService,
        private orderServ: OrderService,
        private kanbanServ: KanbanService,
        private web3Serv: Web3Service,
        private kanbanSmartContractServ: KanbanSmartContractService,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private utilServ: UtilService) {

    }

    ngOnInit() {
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
    }

    showOrderId(orderId: string) {
      return orderId.substring(2, 26);
    } 

    
    showRewards(orderId: string) {
      this.userpayServ.getRewardsByOrderId(orderId).subscribe(
        (ret: any) => {
          if(ret && ret.ok) {
            const rewards = ret._body;

            const modalOptions = {
              initialState: {
              rewards: rewards
              },
              class: 'modal-lg'
              };
       
            
            this.modalRef = this.modalService.show(OrderRewardsComponent, modalOptions);
          }
        }
      );


    }
    showDate(date) {
        return date.toString();
      }
      showAmount(amount) {
        return Number(this.utilServ.showAmount(amount, 18));
      }
      
      showId(id: string) {
        return id.substring(0, 3) + '...' + id.substring(id.length - 3);
      }
  
      showStatus(status: number) {
        
        if(status == 0) {
          return 'refunded';
        } else
        if(status == 1) {
          return 'valid';
        } else 
        if(status == 2) {
          return 'request refund';
        }
        return '';
      }

      requestRefund(order) {

        this.userpayServ.getOrderVersion(order._id).subscribe(
          (ret: any) => {
            if(ret && ret.ok) {
              const version = ret._body.version;
              if(!version) { //version 0
                this.op = 'requestRefund';
                this.order = order;
                this.getPassword();
              } else 
              if(version == 2){ //version 2

                const realOrderId = order.id.substring(2, 26);
                this.orderServ.get(realOrderId).subscribe(
                  (ret: any) => {
                    if(ret && ret.ok) {
                      this.realOrder = ret._body;
                      const initialState = {
                        order: order,
                        realOrder: this.realOrder
                      };          
                      
                      this.modalRef = this.modalService.show(RequestRefundComponent, { initialState });
                      this.modalRef.content.onClose.subscribe( async (requestRefundData: any) => {

                        this.op = 'requestRefundV2';
                        this.order = order;
                        this.requestRefundData = requestRefundData;
                        this.getPassword();
                      });
                    }
                  }
                );



              }

            }
          }
        );

      }

      cancelRequestRefund(order) {
        this.op = 'cancelRequestRefund';
        this.order = order;
        this.getPassword();       
      }

      refund(order) {
        this.userpayServ.getOrderVersion(order._id).subscribe(
          (ret: any) => {
            if(ret && ret.ok) {
              const version = ret._body.version;
              if(!version) { //version 0
                this.op = 'refund';
                this.order = order;
                this.getPassword();   
              } else { //version 2
                const realOrderId = order.id.substring(2, 26);
                this.orderServ.get(realOrderId).subscribe(
                  (ret: any) => {
                    if(ret && ret.ok) {
                      this.realOrder = ret._body;
                      const initialState = {
                        order: order,
                        realOrder: this.realOrder
                      };          
                      
                      this.modalRef = this.modalService.show(RefundComponent, { initialState });
                      this.modalRef.content.onClose.subscribe( async (refundData: any) => {

                        this.op = 'refundV2';
                        if(!order.merchantGet) {
                          this.op = 'refundCreditV2';
                        }
                        this.order = order;
                        this.refundData = refundData;
                        this.getPassword();
                      });
                    }
                  }
                );
              }
            }
          });        
      }

      checkSignature(smartContractAddress: string, customer: string, orderId: string, r: string, s: string, v: string) {
        const abi = {
          "inputs": [
            {
              "internalType": "address",
              "name": "_user",
              "type": "address"
            },
            {
              "internalType": "bytes32",
              "name": "_msg",
              "type": "bytes32"
            },
            {
              "internalType": "uint8",
              "name": "v",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "r",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
            }
          ],
          "name": "validateSignature",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "pure",
          "type": "function"
        }
        const args = [customer, orderId, v, r, s];
        const abiData = this.web3Serv.getGeneralFunctionABI(abi, args);
        this.kanbanServ.kanbanCall(smartContractAddress, abiData).subscribe(
          (ret: any) => {
          }
        );
      }

      getPassword(){
        const initialState = {
          pwdHash: this.wallet.pwdHash,
          encryptedSeed: this.wallet.encryptedSeed
        };          
        
        this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
    
        this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
          if(this.op == 'requestRefund') {
            this.requestRefundDo(seed);
          }else 
          if(this.op == 'requestRefundV2') {
            this.requestRefundV2Do(seed);
          } else
          if(this.op == 'refundV2') {
            this.refundV2Do(seed);
          } else
          if(this.op == 'refundCreditV2') {
            this.refundCreditV2Do(seed);
          } else
          if(this.op == 'cancelRequestRefund') {
            this.cancelRequestRefundDo(seed);
          }else
          if(this.op == 'refund') {
            this.refundDo(seed);
          }
        });
      }

      refundCreditV2Do(seed) {
        if(!this.refundData) {
          return;
        }
        const realOrderId = this.order.id.substring(2, 26);
        this.orderServ.getRefund(realOrderId).subscribe(
          async (retRefund: any) => {
            
            if(retRefund && retRefund.ok) {
              const body = retRefund._body;
              const newOrderID = body.newOrderID
              const originalOrderID = body.originalOrderID;
              const customer = body.customer;
              const paidCoin = this.coinServ.getCoinTypeIdByName(body.paidCoin);
              const refundAmount = body.refundAmount
              const refundTax = body.refundTax;
              const refundRewardInPaidCoin = body.refundRewardInPaidCoin;
              const originalOrderInfo = body.originalOrderInfo;
              const refundInfo = body.refundInfo;
              const mainAddresses = body.mainAddresses;
              const regionalAgents = body.regionalAgents;
              const rewardBeneficiary = body.rewardBeneficiary;
              const v = body.v;
              const r = body.r;
              const s = body.s;
              const rewardInfo = body.rewardInfo;
              this.checkSignature(this.order.address, customer, newOrderID, r, s, v);
              let abi;
              let args;
              if(body.refundAll) {
                abi = {
                  "inputs": [
                  {
                    "internalType": "bytes32",
                    "name": "_newOrderID",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "_originalOrderID",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "address",
                    "name": "_customer",
                    "type": "address"
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
                    "name": "_refundTax",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "_refundRewardInPaidCoin",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address[3]",
                    "name": "_mainAddresses",
                    "type": "address[3]"
                  },
                  {
                    "internalType": "address[]",
                    "name": "_regionalAgents",
                    "type": "address[]"
                  },
                  {
                    "internalType": "address[]",
                    "name": "_rewardBeneficiary",
                    "type": "address[]"
                  },
                  {
                    "internalType": "uint8",
                    "name": "v",
                    "type": "uint8"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "r",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "s",
                    "type": "bytes32"
                  }
                  ],
                  "name": "refundAllFromCredit",
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
                  newOrderID, originalOrderID, customer, paidCoin, refundAmount, refundTax, 
                  refundRewardInPaidCoin, mainAddresses, regionalAgents, rewardBeneficiary, v, r, s
                ];
              } else {
                abi = {
                  "inputs": [
                  {
                    "internalType": "bytes32",
                    "name": "_newOrderID",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "_originalOrderID",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "address",
                    "name": "_customer",
                    "type": "address"
                  },
                  {
                    "internalType": "uint32",
                    "name": "_paidCoin",
                    "type": "uint32"
                  },
                  {
                    "internalType": "uint256[3]",
                    "name": "_originalOrderInfo",
                    "type": "uint256[3]"
                  },
                  {
                    "internalType": "uint256[2]",
                    "name": "_refundInfo",
                    "type": "uint256[2]"
                  },
                  {
                    "internalType": "address[3]",
                    "name": "_mainAddresses",
                    "type": "address[3]"
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
                    "internalType": "uint8",
                    "name": "v",
                    "type": "uint8"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "r",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "s",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "bytes",
                    "name": "_rewardInfo",
                    "type": "bytes"
                  }
                  ],
                  "name": "refundSomeFromCredit",
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
                  newOrderID, originalOrderID, customer, paidCoin, originalOrderInfo, refundInfo, 
                  mainAddresses, regionalAgents, rewardBeneficiary, v, r, s, rewardInfo
                ];
              }

              const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.order.address, abi, args);

              if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
                this.order.status = 2;
                this.toastr.success('Refund was made successfully');
              } else {
                this.toastr.error('Failed to refund');
                
              }
            } else {
              this.toastr.error('Failed to get request refund information');
            }
          }
        );
      }
      refundV2Do(seed) {
        if(!this.refundData) {
          return;
        }
        const realOrderId = this.order.id.substring(2, 26);
        this.orderServ.getRefund(realOrderId).subscribe(
          async (retRefund: any) => {
            
            if(retRefund && retRefund.ok) {
              const body = retRefund._body;
              const newOrderID = body.newOrderID;
              const originalOrderID = body.originalOrderID;
              const customer = body.customer;
              const paidCoin = this.coinServ.getCoinTypeIdByName(body.paidCoin);
              const refundAmount = body.refundAmount
              const refundTax = body.refundTax;
              const refundRewardInPaidCoin = body.refundRewardInPaidCoin;
              const originalOrderInfo = body.originalOrderInfo;
              const refundInfo = body.refundInfo;
              const regionalAgents = body.regionalAgents;
              const rewardBeneficiary = body.rewardBeneficiary;
              const mainAddresses = body.mainAddresses;
              const v = body.v;
              const r = body.r;
              const s = body.s;
              const rewardInfo = body.rewardInfo;
              this.checkSignature(this.order.address, customer, newOrderID, r, s, v);
              let abi;
              let args;
              if(body.refundAll) {
                abi = {
                  "inputs": [
                  {
                    "internalType": "bytes32",
                    "name": "_newOrderID",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "_originalOrderID",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "address",
                    "name": "_customer",
                    "type": "address"
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
                    "name": "_refundTax",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "_refundRewardInPaidCoin",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address[3]",
                    "name": "_mainAddresses",
                    "type": "address[3]"
                  },
                  {
                    "internalType": "address[]",
                    "name": "_regionalAgents",
                    "type": "address[]"
                  },
                  {
                    "internalType": "address[]",
                    "name": "_rewardBeneficiary",
                    "type": "address[]"
                  },
                  {
                    "internalType": "uint8",
                    "name": "v",
                    "type": "uint8"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "r",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "s",
                    "type": "bytes32"
                  }
                  ],
                  "name": "refundAllWithSig",
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
                  newOrderID, originalOrderID, customer, paidCoin, refundAmount, refundTax, 
                  refundRewardInPaidCoin, mainAddresses, regionalAgents, rewardBeneficiary, v, r, s
                ];
              } else {
                abi = {
                  "inputs": [
                  {
                    "internalType": "bytes32",
                    "name": "_newOrderID",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "_originalOrderID",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "address",
                    "name": "_customer",
                    "type": "address"
                  },
                  {
                    "internalType": "uint32",
                    "name": "_paidCoin",
                    "type": "uint32"
                  },
                  {
                    "internalType": "uint256[3]",
                    "name": "_originalOrderInfo",
                    "type": "uint256[3]"
                  },
                  {
                    "internalType": "uint256[2]",
                    "name": "_refundInfo",
                    "type": "uint256[2]"
                  },
                  {
                    "internalType": "address[3]",
                    "name": "_mainAddresses",
                    "type": "address[3]"
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
                    "internalType": "uint8",
                    "name": "v",
                    "type": "uint8"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "r",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "s",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "bytes",
                    "name": "_rewardInfo",
                    "type": "bytes"
                  }
                  ],
                  "name": "refundSomeWithSig",
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
                  newOrderID, originalOrderID, customer, paidCoin, originalOrderInfo, refundInfo, 
                  mainAddresses, regionalAgents, rewardBeneficiary, v, r, s, rewardInfo
                ];
              }
              const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.order.address, abi, args);

              if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
                this.order.status = 2;
                this.toastr.success('Refund was made successfully');
              } else {
                this.toastr.error('Failed to refund');
                
              }
            } else {

              this.toastr.error('Failed to get request refund information');
            }
          }
        );
      }
      requestRefundV2Do(seed: Buffer) {
        const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
        const privateKey = keyPair.privateKeyBuffer.privateKey;
        let requestRefundId = this.utilServ.genRanHex(64);
        //const requestRefundSig = this.web3Serv.signKanbanMessageHashWithPrivateKey(requestRefundId, privateKey);


        //requestRefundId = '528ea5c51829ee3374d696d72a2fcbba9448970fc10df62b49aa4cfc40aad251';
        const hashForSignature = this.web3Serv.hashKanbanMessage('0x' + requestRefundId);
        const requestRefundSig = this.web3Serv.signKanbanMessageHashWithPrivateKey(hashForSignature, privateKey);

        const data = {
          refundAll: this.requestRefundData.refundAll,
          items: this.requestRefundData.items.filter(item => item.quantity > 0),
          requestRefundId: '0x' + requestRefundId,
          r: requestRefundSig.r,
          s: requestRefundSig.s,
          v: requestRefundSig.v
        };
        const sig = this.kanbanServ.signJsonData(privateKey, data);

        data['sig'] = sig.signature;   
        this.orderServ.requestRefund(this.realOrder._id, data).subscribe(
          (ret: any) => {
            if(ret && ret.ok && ret._body && ret._body._id) {
              this.toastr.success('Request refund was made successfully');
            } else {
              this.toastr.error('Failed to request refund');
            }
          }
        );
      }
      
      async requestRefundDo(seed: Buffer) {

        
        const abi = {
            "constant": false,
            "inputs": [
              {
                "name": "_orderID",
                "type": "bytes32"
              }
            ],
            "name": "requestRefund",
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

        const args = [
          this.order.id
        ];
        
        const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.order.address, abi, args);

        if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
          this.order.status = 2;
          this.toastr.success('Request refund was made successfully');
        } else {
          this.toastr.error('Failed to request refund');
          
        }
    
      }

      async cancelRequestRefundDo(seed: Buffer) {
        this.userpayServ.getOrderVersion(this.order._id).subscribe(
          async (ret: any) => {
            if(ret && ret.ok) {
              const version = ret._body.version;
              if(!version) { //version 0
                await this.cancelRequestRefundV1Do(seed);
              } else
              if(version == 2) {
                await this.cancelRequestRefundV2Do(seed);
              }
            }
          });  
      }

      async cancelRequestRefundV2Do(seed: Buffer) {
        const realOrderId = this.order.id.substring(2, 26);
        const data = {
          id: realOrderId
        }
        const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
        const privateKey = keyPair.privateKeyBuffer.privateKey;
        const sig = this.kanbanServ.signJsonData(privateKey, data);
        data['sig'] = sig.signature;   
        this.orderServ.cancelrequestRefundV2(data).subscribe(
          (ret: any) => {
            if(ret && ret.ok && ret._body && ret._body._id) {
              this.toastr.success('Request refund was canceled successfully');
            } else {
              this.toastr.error('Failed to cancel request refund');
            }
          }
        );
      }

      async cancelRequestRefundV1Do(seed: Buffer) {
      
        const abi = {
          "constant": false,
          "inputs": [
            {
              "name": "_orderID",
              "type": "bytes32"
            }
          ],
          "name": "cancelRefundRequest",
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

        const args = [
          this.order.id
        ];
        const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.order.address, abi, args);

        if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
          this.order.status = 1;
          this.toastr.success('Request refund was cancelled successfully');
        } else {
          this.toastr.error('Failed to cancel request refund');
        }
    
      }

      async refundDo(seed: Buffer) {
        const abi = {
          "constant": false,
          "inputs": [
            {
              "name": "_orderID",
              "type": "bytes32"
            }
          ],
          "name": "refund",
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

        const args = [
          this.order.id
        ];
        const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.order.address, abi, args);

        if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
          this.order.status = 0;
          this.toastr.success('Refund was processed successfully');
        } else {
          this.toastr.error('Failed to make the refund');
        }
    
      }
}