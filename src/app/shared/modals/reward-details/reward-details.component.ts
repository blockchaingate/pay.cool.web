import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StarService } from 'src/app/services/star.service';
import { UtilService } from 'src/app/services/util.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { StoreService } from 'src/app/services/store.service';
import { SendRewardsSummaryComponent } from '../send-rewards-summary/send-rewards-summary.component';
import BigNumber from 'bignumber.js';

@Component({
    selector: 'app-reward-details',
    templateUrl: './reward-details.component.html',
    styleUrls: ['./reward-details.component.scss']
  })
  export class RewardDetailsComponent implements OnInit {
    orderId: string;
    paidCoinType: number;
    totalRewards: number;
    rewardCoinType: number;
    totalRewardsInRewardCoin: number;
    paidCoinValue: number;
    rewardCoinValue:  number;
    lockedDays: number;
    rewards: any;
    customer: string;
    merchant: string;
    merchantRef: string;
    lvs: any;
    constructor(
      private modalService:BsModalService,
      private utilServ: UtilService,
      private starServ: StarService,
      private kanbanServ: KanbanService,
      private storeServ: StoreService,
      private modalRef: BsModalRef) {
    }

    sendRewards() {
      let rewards = [];
      let releaseTime;


      for(let i = 0; i < this.rewards.length; i++) {
        const reward = this.rewards[i];


        releaseTime = reward.releaseTime;
        const user = reward.user;
        const shouldGet = reward.shouldGet;
        const actualGet = Number(this.showAmount(reward.amount[0]));
        const amount = Number(new BigNumber(shouldGet).minus(new BigNumber(actualGet)).toFixed(5));

        let existed = false;
        for(let j = 0; j < rewards.length; j++) {
          if(rewards[j].user == user) {
            existed = true;
            rewards[j].amount = new BigNumber(rewards[j].amount).minus(new BigNumber(actualGet)).toNumber();
          }
        }

        if(!existed) {
          if(amount > 0) {
            const item = {
              user,
              amount
            };
            rewards.push(item);
          }
        }
      }

      rewards = rewards.filter(item => item.amount > 0);
      this.close();

    const initialState = {
      rewards,
      releaseTime,
      orderId: this.orderId,
      rewardCoinType: this.rewardCoinType
    };          
    
    this.modalRef = this.modalService.show(SendRewardsSummaryComponent, { initialState });
    }

    shouldGet(totalRewards: number, userTypes: any) {
      let shouldGet = 0;
      for(let i = 0; i < userTypes.length; i++) {
        const userType = userTypes[i];
        if(userType == 'Customer') {
          shouldGet = new BigNumber(shouldGet).plus(new BigNumber(totalRewards).multipliedBy(0.66)).toNumber();
        }
        if(userType == 'Merchant') {
          shouldGet = new BigNumber(shouldGet).plus(new BigNumber(totalRewards).multipliedBy(0.13)).toNumber();
        }
        if(userType == 'Merchant referral') {
          shouldGet = new BigNumber(shouldGet).plus(new BigNumber(totalRewards).multipliedBy(0.04)).toNumber();
        }
        if(userType == 'Level 1') {
          shouldGet = new BigNumber(shouldGet).plus(new BigNumber(totalRewards).multipliedBy(0.03)).toNumber();
        }
        if(userType == 'Level 2') {
          shouldGet = new BigNumber(shouldGet).plus(new BigNumber(totalRewards).multipliedBy(0.06)).toNumber();
        }
        if(userType == 'Level 3') {
          shouldGet = new BigNumber(shouldGet).plus(new BigNumber(totalRewards).multipliedBy(0.016)).toNumber();
        }
        if(userType == 'Level 4') {
          shouldGet = new BigNumber(shouldGet).plus(new BigNumber(totalRewards).multipliedBy(0.014)).toNumber();
        }
        if(userType == 'Level 5') {
          shouldGet = new BigNumber(shouldGet).plus(new BigNumber(totalRewards).multipliedBy(0.011)).toNumber();
        }
        if(userType == 'Level 6') {
          shouldGet = new BigNumber(shouldGet).plus(new BigNumber(totalRewards).multipliedBy(0.0055)).toNumber();
        }
        if(userType == 'Level 7') {
          shouldGet = new BigNumber(shouldGet).plus(new BigNumber(totalRewards).multipliedBy(0.0035)).toNumber();
        }
        if(userType == 'Level 8') {
          shouldGet = new BigNumber(shouldGet).plus(new BigNumber(totalRewards).multipliedBy(0.0025)).toNumber();
        }
      }

      return shouldGet;
    }
    ngOnInit(): void {
      this.lvs = [];
      this.starServ.getRewardsByOrderId(this.orderId).subscribe(
        (ret: any) => {
          if(ret.ok) {
            this.rewards = ret._body;
            if(this.rewards && this.rewards.length > 0) {
              const txid = this.rewards[this.rewards.length - 1].txids[0];

              this.rewardCoinType = this.rewards[0].coinType[0];
              this.kanbanServ.decode(txid).subscribe(
                (ret: any) => {
                  if(ret && ret.ok) {
                    const body = ret._body;
                    this.customer = body.from;
                    const to = body.to;
                    const blockNumber = body.blockNumber;
                    if(!body.input) {
                      return;
                    }
                    const rewardInfo = body.input.rewardInfo;
                    this.lockedDays = parseInt(rewardInfo.substring(2, 6), 16);

                    const rewardBeneficiary = body.input.rewardBeneficiary;


                    for(let i = 0; i < rewardBeneficiary.length; i++) {
                      const lv = rewardBeneficiary[i];
                      const address = this.utilServ.exgToFabAddress('0x' + lv.substring(lv.length - 40));
                      this.lvs.push(address);
                    }

                    this.totalRewards = new BigNumber(rewardInfo.substring(6, 6+64), 16).shiftedBy(-18).toNumber();

                    this.storeServ.getStoreByFeeCharger(to).subscribe(
                      (ret: any) => {
                        if(ret && ret.ok) {
                          const store = ret._body;
                          this.merchant = store.owner;
                          this.merchantRef = store.refAddress;


                          this.starServ.getCoinValue(this.rewardCoinType, blockNumber).subscribe(
                            (ret: any) => {
                              const hex = ret.data;
                              this.rewardCoinValue = new BigNumber(hex, 16).shiftedBy(-8).toNumber();
      
                              this.starServ.getCoinValue(this.paidCoinType, blockNumber).subscribe(
                                (ret: any) => {
                                  const hex = ret.data;
                                  this.paidCoinValue = new BigNumber(hex, 16).shiftedBy(-8).toNumber();
                                  this.totalRewardsInRewardCoin = new BigNumber(this.totalRewards).multipliedBy(new BigNumber(this.paidCoinValue)).dividedBy(new BigNumber(this.rewardCoinValue)).toNumber(); 


                                  for(let i = 0; i < this.rewards.length; i++) {
                                    const userTypes = this.getUserType(this.rewards[i].user);
                                    this.rewards[i]['shouldGet'] = this.shouldGet(this.totalRewardsInRewardCoin, userTypes);
                                  }
                                }
                              );  
      
                            }
                          );
                          
                        }
                      }
                    );



                  



                  }
                }
              );
            }
          }
        }
      );
    }

    getUserType(user: string) {
      const userTypes = [];
      if(this.customer == user) {
        userTypes.push('Customer');
      }
      if(this.merchant == user) {
        userTypes.push('Merchant');
      }
      if(this.merchantRef == user) {
        userTypes.push('Merchant referral');
      }
      if(this.lvs) {
        if(this.lvs.length >= 1) {
          if(this.lvs[0] == user) {
            userTypes.push('Level 1');
          }
        }
        if(this.lvs.length >= 2) {
          if(this.lvs[1] == user) {
            userTypes.push('Level 2');
          }
        }
        if(this.lvs.length >= 3) {
          if(this.lvs[2] == user) {
            userTypes.push('Level 3');
          }
        }
        if(this.lvs.length >= 4) {
          if(this.lvs[3] == user) {
            userTypes.push('Level 4');
          }
        }
        if(this.lvs.length >= 5) {
          if(this.lvs[4] == user) {
            userTypes.push('Level 5');
          }
        }
        if(this.lvs.length >= 6) {
          if(this.lvs[5] == user) {
            userTypes.push('Level 6');
          }
        }

        if(this.lvs.length >= 7) {
          if(this.lvs[6] == user) {
            userTypes.push('Level 7');
          }
        }
        if(this.lvs.length >= 8) {
          if(this.lvs[7] == user) {
            userTypes.push('Level 8');
          }
        }
      }
      return userTypes;
    }


    close() {
        this.modalRef.hide();
    }

    showAmount(amount: any) {
      return this.utilServ.toNumber(this.utilServ.showAmount(amount, 18));
    }

    showReleaseTime(reward: any) {
      const releaseTime = reward.releaseTime;
      const thetime = new Date(releaseTime * 1000).toLocaleDateString("en-US");
      return thetime;
    }

    showId(id: string) {
      return id.substring(0,3) + '...' + id.substring(id.length - 3);
    }

    getTxidUrl(txid: string) {
      return environment.endpoints.website + 'explorer/tx-detail/' + txid; 
    }

    showDetail(reward: any) {
      this
      let detail ='';
      for(let i = 0; i < reward.amount.length;i++) {
        const rewardAmount = reward.amount[i];
        const rewardCoinType = reward.coinType[i];

        if(rewardAmount > 0) {
          detail += this.showAmount(rewardAmount);
        }
        if(i != reward.amount.length - 1) {
          detail += '   '
        }
      }
      return detail;
    }

    getCoinName(coinType) {
      return this.utilServ.getCoinNameByTypeId(coinType);
    }

    showStatus(status: number) {
      //0: refunded 1: valid   2:  request refund  3: redeemed
      if(status == 0) {
        return 'refunded';
      }
      if(status == 1) {
        return 'valid';
      }
      if(status == 2) {
        return 'request refund';
      }
      if(status == 3) {
        return 'redeemed';
      }
    }
    
  }