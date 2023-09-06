import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { ProjectService } from 'src/app/services/project.service';
import { UtilService } from 'src/app/services/util.service';
import { PasswordModalComponent } from '../../shared/modals/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss']
})
export class PackageComponent implements OnInit {
  modalRef: BsModalRef;
  package: any;
  coin: string;
  order: any;
  wallet: any;
  user: string;
  id: string;
  walletAddress: string;

  constructor(
    private route: ActivatedRoute,
    private utilServ: UtilService,
    private dataServ: DataService,
    private modalService: BsModalService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private toastr: ToastrService,
    private projectServ: ProjectService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (param: ParamMap) => {
        const id = param.get('id');
        this.id = id;
        this.projectServ.getProjectPackage(id).subscribe(
          (thepackage:any) => {
            this.package = thepackage;
            if(thepackage.coins && thepackage.coins.length > 0) {
              this.coin = thepackage.coins[0];
            }
          }
        );
      });

      this.dataServ.currentWallet.subscribe(
        (wallet: any) => {
          this.wallet = wallet;
        }
      );
      this.dataServ.currentWalletAddress.subscribe(
        (walletAddress: string) => {
          if(walletAddress) {
            this.walletAddress = walletAddress;
          }
        }
      );      
  }

  showName(name: any) {
    return this.utilServ.showName(name);
  }

  enroll() {
    if(!this.coin) {
      this.toastr.error('Coin not selected');
      return;
    }
    
    let getParam;
    if(this.user) {
      getParam = this.projectServ.getParamsFor(this.id, this.user, this.coin);
    } else {
      getParam = this.projectServ.getParams(this.id, this.walletAddress, this.coin)
    }
    
    getParam.subscribe(
      (order: any) => {
        this.order = order;

        const initialState = {
          pwdHash: this.wallet.pwdHash,
          encryptedSeed: this.wallet.encryptedSeed
        };   
        this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
        this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
          this.enrollDo(seed);
      }); 
      },
      (error: any) => {
        this.toastr.error(error.error.error);
        return;
      }
    );


  
  }

  async enrollDo(seed: Buffer) {
    if(!this.order) {
      this.toastr.error('Error for getting reward information');
      return;
    }
    const params = this.order.params;

    let ret = await this.kanbanSmartContractServ.execSmartContractAbiHex(seed, params[0].to, params[0].data);
    if(ret && ret.success && ret._body && ret._body.status == '0x1') {
      ret = await this.kanbanSmartContractServ.execSmartContractAbiHex(seed, params[1].to, params[1].data);
      if(ret && ret.success && ret._body && ret._body.status == '0x1') {
        this.toastr.success('Your payment was made successfully');
      } else {
        this.toastr.error('Failed to make payment, txid:' + ret._body.transactionHash);
      }
    } else {
      this.toastr.error('Failed to authorizeOperator, txid:' + ret._body.transactionHash);
    }
  }
}
