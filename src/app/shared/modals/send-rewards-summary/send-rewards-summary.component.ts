import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { UtilService } from 'src/app/services/util.service';
import BigNumber from 'bignumber.js';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-send-rewards-summary',
    templateUrl: './send-rewards-summary.component.html',
    styleUrls: ['./send-rewards-summary.component.scss']
  })
  export class SendRewardsSummaryComponent implements OnInit {
      rewards: any;
      releaseTime: number;
      orderId: string;
      lockPeriod: number;
      rewardCoinType: number;
      wallet: any;
      constructor(
          private router: Router,
          private utilServ: UtilService,
          private kanbanSmartContractServ: KanbanSmartContractService,
          private dataServ: DataService,
          private modalService:BsModalService,
          private toastr: ToastrService,
          private modalRef: BsModalRef
          ) {

      }

      showId(id: string) {
          return id.substring(0, 3) + '...' + id.substring(id.length - 3);
      }
      ngOnInit(): void {
        this.dataServ.currentWallet.subscribe(
            (wallet: any) => {
              this.wallet = wallet;
            }
        ); 

        this.lockPeriod = Math.floor((this.releaseTime - Math.floor(new Date().getTime() / 1000)) / 60 / 60 / 24) - 1;
        console.log('lockPeriod=', this.lockPeriod);
        console.log('this.releaseTime=', this.releaseTime);
        console.log('Math.floor(new Date().getTime() / 1000)====', Math.floor(new Date().getTime() / 1000));
      }

      showReleaseTime(releaseTime: any) {
        const thetime = new Date(releaseTime * 1000).toLocaleDateString("en-US");
        return thetime;
      }

      send() {
        this.close();

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
            await this.sendDo(seed);
          });
      }

      async sendDo(seed: Buffer) {
        let success = true;
        for(let i = 0; i < this.rewards.length; i++) {
            const reward = this.rewards[i];
            const ret = await this.sendReward(seed, reward);
            if(ret == 0) {
              success = false;
              this.toastr.error('Sending rewards failed');
              break;
            }
        }
        if(success) {
          this.toastr.success('Sending rewards succeeded');
        }
      }

      async sendReward(seed, reward) {
        const abi = {
            "inputs": [
              {
                "internalType": "bytes32",
                "name": "_ID",
                "type": "bytes32"
              },
              {
                "internalType": "address",
                "name": "_lockerOwner",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "_lockPeriod",
                "type": "uint256"
              },
              {
                "internalType": "uint32",
                "name": "_rewardCoin",
                "type": "uint32"
              },
              {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
              }
            ],
            "name": "createLocker",
            "outputs": [
              
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          };

          if(!environment.production) {
            this.lockPeriod = Math.abs(this.lockPeriod)
          }
          if(this.lockPeriod <= 0) {
              return;
          }
          const args = [
              this.orderId, 
              this.utilServ.fabToExgAddress(reward.user), 
              this.lockPeriod,
              this.rewardCoinType,
              '0x' + new BigNumber(reward.amount).shiftedBy(18).toString(16)
          ];

          console.log('args===', args);
          const ret = await this.kanbanSmartContractServ.execSmartContract(
              seed, 
              environment.addresses.smartContract.regularLocker2, 
              abi, args);
        
          if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
            //this.toastr.success('Sending rewards succeeded');
            return 1;
          } else {
            return 0;
              //this.toastr.error('Sending rewards failed');
          }
        //console.log('ret for sendlocker===', ret);
      }

      close() {
        this.modalRef.hide();
    }
  }