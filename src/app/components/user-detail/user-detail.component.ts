import { Component, Input, OnInit } from '@angular/core';
import { statuses } from '../../config/statuses';
import { metaforceProjectId } from '../../config/projectId';
import { UserReferralService } from '../../services/userreferral.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BuyService } from 'src/app/services/buy.service';
import { UtilService } from 'src/app/services/util.service';
import { PayRewardService } from 'src/app/services/payreward.service';
import { TxRewardsComponent } from '../../me/components/tx-rewards/tx-rewards.component';
import { ChargeService } from 'src/app/services/charge.service';
import { LockerService } from 'src/app/services/locker.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { PasswordModalComponent } from '../../shared/modals/password-modal/password-modal.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  @Input() user: string;
  modalRef: BsModalRef;
  wallet: any;
  tabName: string;
  expiredAt: any;
  pv: number;
  gv: number;
  users: any;
  buys: any;
  icos: any;
  myicoRewards: any;
  myRewards: any;
  referral: string;
  status: number;
  dateCreated: any;
  statuses = statuses;

  pageSize: number = 10;
  pageNum: number = 0;
  totalCount: number;
  totalPageNum: number = 0; 
  children: any;

  myPayments: any;
  myLPLockers: any;
  myCPLockers: any;
  myLockers: any;

  constructor(
    private route: ActivatedRoute,
    private buyServ: BuyService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private router: Router,
    private lockerServ: LockerService,
    private chargeServ: ChargeService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private payRewardServ: PayRewardService,
    private userreferralServ: UserReferralService) { }

  ngOnInit(): void {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 

    this.route.paramMap.subscribe(
      (params: ParamMap) => {
          const user = params.get('id');
          if(user) {
            this.user = user;
            this.getBuys();
            this.getIcos();
            this.getMyIcoRewards();
            this.getMyRewards();
            this.getMyPayments();
            this.getMyLPLockers();
            this.getMyCPLockers();
            this.getMyLockers();
            this.changeTab('paycool');
          } else {
            this.changeTab('paycool');
            this.getBuys();
            this.getIcos();
            this.getMyIcoRewards();
            this.getMyRewards();
            this.getMyPayments();
            this.getMyLPLockers();
            this.getMyCPLockers();
            this.getMyLockers();
          }
      }
    )
    

  }

  showId(txid: string) {
    if(!txid) {
      return txid;
    }
    return txid.substring(0, 3) + '...' + txid.substring(txid.length - 3);
  }

  showIcoRwards(icoid) {
    this.payRewardServ.getAllIcoRewardsById(icoid).subscribe(
      (rewards: any) => {
        console.log('rewards===', rewards);
        const initialState = {
          rewards
        };          

        this.modalService.show(TxRewardsComponent, { initialState, class: 'modal-lg' });
      }
    );
  }

  timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }
  
  showRwards(txid) {
    this.payRewardServ.getAllRewardsByTxid(txid).subscribe(
      (rewards: any) => {
        console.log('rewards===', rewards);
        const initialState = {
          rewards
        };          

        this.modalService.show(TxRewardsComponent, { initialState, class: 'modal-lg' });
      }
    );
  }

  showCoinName(coinType) {
    return this.utilServ.getCoinNameByTypeId(coinType);
  }

  showAmount(amount) {
    return Number(this.utilServ.showAmount(amount, 18));
  }

  showName(name) {
    return this.utilServ.showName(name);
  }

  getBuys() {
    this.buyServ.getBuysByUser(this.user).subscribe(
      res => {
        this.buys = res;
      }
    );
  }

  getIcos() {
    this.buyServ.getIcosByUser(this.user).subscribe(
      res => {
        this.icos = res;
      }
    );
  }

  getMyPayments() {
    this.chargeServ.getChargesByUser(this.user).subscribe(
      (payments) => {
        this.myPayments = payments;
        console.log('payments===', payments);
      }
    );
  }
  
  getMyLPLockers() {
    this.lockerServ.getAllLpLockersByUser(this.user, 100000, 0).subscribe(
      (lockers) => {
        this.myLPLockers = lockers;
        console.log('this.myLPLockers====', this.myLPLockers);
      }
    );
  }
  
  getMyCPLockers() {
    this.lockerServ.getAllCpLockersByUser(this.user, 100, 0).subscribe(
      (lockers) => {
        this.myCPLockers = lockers;
      }
    );
  }

  getMyLockers() {
    this.lockerServ.getAllLockersByUser(this.user, 100, 0).subscribe(
      (lockers) => {
        this.myLockers = lockers;
      }
    );
  }

  getMyIcoRewards() {
    this.payRewardServ.getIcoRewardsByUser(this.user).subscribe(
      res => {
        this.myicoRewards = res;
      }
    );
  }
  
  showUrl(txid: string) {
    return 'https://' + (environment.production ? '' : 'test.') + 'exchangily.com/explorer/tx-detail/' + txid;
  }

  getMyRewards() {
    this.payRewardServ.getRewardsByUser(this.user).subscribe(
      res => {
        this.myRewards = res;
      }
    );
  }

  showStatus(status: any) {
    const statuses = this.statuses.filter(item => item.value == status);
    if(statuses && statuses.length > 0) {
      return statuses[0].text;
    }
    return '';
  }

  showFabAddress(exgAddress: string) {
    return this.utilServ.exgToFabAddress(exgAddress);
  }

  changeParentAddress(parentAddress: string) {
    this.user = parentAddress;
    this.userreferralServ.get(this.user).subscribe(
      (ret: any) => {
        this.referral = ret.referral;
        this.status = ret.status;
        this.dateCreated = ret.dateCreated;
        if(ret.newStatus && ret.newStatus > this.status) {
          this.status = ret.newStatus;
        }
      }
    );
    this.userreferralServ.getChildrenTotalCount(this.user).subscribe(
      (ret: any) => {
        this.totalCount = ret.totalCount;
        this.totalPageNum = this.totalCount / this.pageSize;
      }
    );
    this.gotoPage(0);
  }


  gotoPage(pageNum: number) {
    if(pageNum < 0 || (pageNum > this.totalPageNum)) {
      return;
    }
    this.pageNum = pageNum;
    if(this.tabName == 'paycool') {
      this.userreferralServ.getChildren(this.user, this.pageSize, this.pageNum).subscribe(
        (ret: any) => {
          this.users = ret;
        }
      );
    } else 
    if(this.tabName == 'metaforce'){
      this.userreferralServ.getProjectUserChildren(metaforceProjectId, this.user, this.pageSize, this.pageNum).subscribe(
        (ret: any) => {
          this.users = ret;
        }
      );
    }
  } 

  changeTab(tab: string) {
    this.tabName = tab;
    if(tab == 'paycool') {
      this.pv = 0;
      this.gv = 0;
      this.userreferralServ.getChildren(this.user, this.pageSize, this.pageNum).subscribe(
        (ret: any) => {
          this.users = ret;
        }
      );

      this.userreferralServ.get(this.user).subscribe(
        (ret: any) => {
          this.referral = ret.referral;
          this.status = ret.status;
          this.dateCreated = ret.dateCreated;
          this.expiredAt = '';
          if(ret.newStatus && ret.newStatus > this.status) {
            this.status = ret.newStatus;
          }
        }
      );
      this.userreferralServ.getChildrenTotalCount(this.user).subscribe(
        (ret: any) => {
          this.totalCount = ret.totalCount;
          this.totalPageNum = this.totalCount / this.pageSize;
        }
      );

    } else 
    if(tab == 'metaforce') {
      this.userreferralServ.getProjectUserChildren(metaforceProjectId, this.user, this.pageSize, this.pageNum).subscribe(
        (ret: any) => {
          this.users = ret;
        }
      );

      this.userreferralServ.getProjectUser(metaforceProjectId, this.user).subscribe(
        (ret: any) => {
          this.referral = ret.referral;
          this.pv = ret.pv;
          this.gv = ret.gv;
          this.dateCreated = ret.dateCreated;
          this.expiredAt = ret.expiredAt;
          this.status = ret.status;
          if(ret.newStatus && ret.newStatus > this.status) {
            this.status = ret.newStatus;
          }
        }
      );

      this.userreferralServ.getProjectUserChildrenTotalCount(metaforceProjectId, this.user).subscribe(
        (ret: any) => {
          this.totalCount = ret.totalCount;
          this.totalPageNum = this.totalCount / this.pageSize;
        }
      );
    }
  }


  unlock(item) {
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
      this.unlockDo(seed, item);
    });
  }

  async unlockDo(seed: Buffer, item) {
    const abi = {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_lockerId",
          "type": "uint256"
        }
      ],
      "name": "releaseLocker",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };

    const args = [
      item.id
    ];

    const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, item.address, abi, args);

    if(ret2 && ret2.success && ret2._body && ret2._body.status == '0x1') {
      this.toastr.success('locker was release successfully');
    } else {
      this.toastr.error('Error while releasing locker');
    }
  }
}
