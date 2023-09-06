import { Component, OnInit } from '@angular/core';
import { Language } from '../../models/language';
import { TranslateService } from '@ngx-translate/core';
import { UserAuth } from '../../services/user-auth.service'
import { useAnimation } from '@angular/animations';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { StorageMap } from '@ngx-pwa/local-storage';
import { DeleteWalletModalComponent } from '../modals/delete-wallet/delete-wallet.component';
import { TimerService } from 'src/app/services/timer.service';
import { StorageService } from 'src/app/services/storage.service';
import { TransactionItem } from '../../models/transaction-item';
import { Location } from '@angular/common';
declare var $: any;
import { ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public modalRef: BsModalRef;
  languages: Language[] = [
    { value: 'en', viewValue: 'English' },
    { value: 'sc', viewValue: '简体中文' },
    { value: 'tc', viewValue: '繁體中文' }
  ];

  selectedLan = this.languages[0];
  hasWallet = false;
  pendingtransactions: TransactionItem[];
  closetransactions: TransactionItem[];
  public href: string = "";
  public langFromUrl: string = "";
  public restUrl: any;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private timerServ: TimerService,
    private storageServ: StorageService,
    private tranServ: TranslateService,
    public userAuth: UserAuth,
    private _router: Router,
    private modalService: BsModalService,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private location: Location
    ) {
    this.href = this.location.path();
    
    // this.langFromUrl = this.href.split('/')[1];

    [, this.langFromUrl, ...this.restUrl] = this.href.split('/');

    
  }

  ngOnInit() {


    this.pendingtransactions = [];
    this.closetransactions = [];
    this.timerServ.transactionStatus.subscribe(
      (txItem: any) => {
        if (txItem && txItem.txid) {
          if (txItem.status === 'pending') {
            this.pendingtransactions.push(txItem);
          } else {
            for (let i = 0; i < this.pendingtransactions.length; i++) {
              const item = this.pendingtransactions[i];
              if (item.txid === txItem.txid) {
                item.status = txItem.status;
                this.storageServ.updateTransactionHistoryList(item);
                this.pendingtransactions.splice(i, 1);
                this.closetransactions.unshift(item);
                break;
              }
            }
          }
        }
      }
    );

    this.storageServ.getTransactionHistoryList().subscribe(
      (transactionHistory: TransactionItem[]) => {
        if (transactionHistory) {
          let hasPending = false;
          const subArray = transactionHistory.reverse().slice(0, 5);
          for (let i = 0; i < subArray.length; i++) {
            const item = subArray[i];
            if (item.status === 'pending') {
              this.pendingtransactions.push(item);
              this.timerServ.checkTransactionStatus(item, 60);

              hasPending = true;
            } else {
              this.closetransactions.push(item);
            }
          }

        }

      });

    this.setLan();
    this.storage.watch('ecomwallets').subscribe((wallets: any) => {
      if (wallets && wallets.items.length > 0) {
        this.hasWallet = true;
      }
    });
  }

  ngAfterViewInit() {
    this.href = this.router.url;

    $("#dropdown").click(function () {
      $(".dropdown-menu").toggle();
    });

    $(".dropdown-item").click(function () {
      $(".dropdown-menu").toggle();
    });

  }


  tester() {

  }

  setLan() {


    const storedLan = this.langFromUrl != ""? this.langFromUrl:localStorage.getItem('_lan');
    if (storedLan) {
      if (storedLan === 'en') {
        this.selectedLan = this.languages[0];
      } else if (storedLan === 'sc') {
        this.selectedLan = this.languages[1];
      } else if (storedLan === 'tc') {
        this.selectedLan = this.languages[2];
      }
    } else {
      let userLang = navigator.language;
      userLang = userLang.substr(0, 2);
      if (userLang === 'CN' || userLang === 'cn' || userLang === 'zh') {
        this.selectedLan = this.languages[1];
        localStorage.setItem('_lan', 'sc');
        this.storage.set('_lan', 'sc');
      }
    }
    this.tranServ.use(this.selectedLan.value);
    // this.router.navigateByUrl(`/${this.selectedLan.value}${this.router.url}`);
  }

  onSelectLan(lan: Language) {
    this.selectedLan = lan;
    this.tranServ.use(lan.value);
    this.router.navigateByUrl(`/${this.selectedLan.value}/${this.restUrl.join('/')}`);

    localStorage.setItem('_lan', lan.value);
    this.storage.set('_lan', lan.value);
  }

  openConfirmDialog() {
    this.modalRef = this.modalService.show(DeleteWalletModalComponent);
    this.modalRef.content.onClose.subscribe(result => {
      if (result) {
        this.logout();
      }
    })
  }

  logout() {
    this.hasWallet = false;
    this.storage.delete('ecomwallets').subscribe(
      () => {
        this.userAuth.logout();
        this._router.navigate(['/home'])
      });
  }
}
