import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { LockerService } from 'src/app/services/locker.service';
import { UtilService } from 'src/app/services/util.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { ToastrService } from 'ngx-toastr';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';

@Component({
  selector: 'app-lplockers',
  templateUrl: './lplockers.component.html',
  styleUrls: ['./lplockers.component.scss']
})
export class LplockersComponent implements OnInit {

  locker: any;
  lockers: any;
  wallet: any;
  modalRef: BsModalRef;
  constructor(
    private utilServ: UtilService,
    private dataServ: DataService,
    private router: Router,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private lockerServ: LockerService
  ) { }

  ngOnInit(): void {
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.lockerServ.getAllLpLockersByUser(walletAddress, 100, 0).subscribe(
            (lockers) => {
              this.lockers = lockers;
            }
          );
        }
      }
    );

    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 
  }

  showCoinName(coinType) {
    return this.utilServ.getCoinNameByTypeId(coinType);
  }

  showAmount(amount) {
    return this.utilServ.showAmount(amount, 18);
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

  unlock(item) {
    this.locker = item;
    console.log('this.locker===', this.locker);
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
      this.unlockDo(seed);
    });
  }

  async unlockDo(seed: Buffer) {
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
      this.locker.id
    ];

    const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, this.locker.address, abi, args);

    if(ret2 && ret2.ok && ret2._body && ret2._body.status == '0x1') {
      this.toastr.success('locker was release successfully');
    } else {
      this.toastr.error('Error while releasing locker');
    }
  }

}