import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { CoinService } from 'src/app/services/coin.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  reinvestrate = 20;
  wallet: any;
  modalRef: BsModalRef;
  constructor(
    private dataServ: DataService,
    private coinServ: CoinService,
    private kanbanServ: KanbanService,
    private settingServ: SettingService,
    private modalService: BsModalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 

    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.settingServ.getSetting(walletAddress).subscribe(
            (res: any) => {
              if(res && res.reinvestrate) {
                this.reinvestrate = res.reinvestrate;
              }
            }
          );
        }
      }
    ); 
  }

  change() {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
      this.changeDo(seed);
    });
  }

  changeDo(seed: Buffer) {


    const data = {
      reinvestrate: this.reinvestrate
    }

    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey;
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  

    this.settingServ.createOrUpdate(data).subscribe(
      (res: any) => {
        console.log('res====', res);
      }
    );


  }
}
