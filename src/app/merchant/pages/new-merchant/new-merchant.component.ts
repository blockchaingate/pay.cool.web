import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { UtilService } from 'src/app/services/util.service';
import { Web3Service } from 'src/app/services/web3.service';
import { environment } from 'src/environments/environment';
import { coins } from '../../../config/coins';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ABI } from '../../../utils/abi';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
const hash = require('object-hash');
@Component({
  selector: 'app-new-merchant',
  templateUrl: './new-merchant.component.html',
  styleUrls: ['./new-merchant.component.scss']
})
export class NewMerchantComponent implements OnInit {

  modalRef: any;
  wallet: any;
  name: string = '';
  account: string = '';
  referral: string = '';
  txHash: string = '';
  timeoutHandle: any;
  images: any;
  address: string;
  businessAddress: string;
  contactName: string;
  phone: string;
  fax: string;
  email: string;
  website: string;
  openTime: string;
  closeTime: string;
  businessContents: string;
  rebateRate: number;
  coin: string;
  rewardCoin: string;
  taxRate: number;
  id: string;
  walletAddress: string;
  lockedDays: number;
  coins = coins;
  
  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private web3Serv: Web3Service, 
    private dataServ: DataService,
    private utilServ: UtilService) { }

  ngOnInit(): void {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    );
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        this.walletAddress = walletAddress;
      }
    );
  }

  createMerchant() {
    if(!this.images || this.images.length === 0) {
      this.toastr.info('no merchant logo');
      return;
    }
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.toastr.info('no wallet');
      //this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
      this.spinner.show();
      this.createMerchantDo(seed);
    });
  }

  createMerchantDo(seed) {
    if(this.referral == this.account) {
      return;
    }
    const id = this.web3Serv.randomHex(32);
    const address = environment.addresses.smartContract.smartConractMerchantInfo;
    const data = {
      id,
      referral: this.referral,
      paymentReceiver: this.account,
      owner: this.account,
      name: this.name,
      image: this.images[0],
      businessAddress: this.businessAddress,
      contactName: this.contactName,
      phone: this.phone,
      email: this.email,
      website: this.website,
      openTime: this.openTime,
      closeTime: this.closeTime,
      businessContents: this.businessContents,
      rebateRate: this.rebateRate,
      coin: this.coin,
      rewardCoin: this.rewardCoin,
      address,
      taxRate: this.taxRate,
      lockedDays: this.lockedDays
    };

    
    const merchantHex = hash(data);
    data['mhash'] = merchantHex;
    
    const abi = ABI.createMerchant;
    const args = [
      id, 
      '0x' + merchantHex,
      this.utilServ.fabToExgAddress(this.referral), 
      this.utilServ.fabToExgAddress(this.walletAddress)
    ];
    
    this.kanbanSmartContractServ.execSmartContract(seed, address, abi, args).then(
      (ret: any) => {
        console.log('ret for exec smart contract:', ret);
      }
    );

  }
}
