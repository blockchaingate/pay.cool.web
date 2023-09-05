import { Component, Input, OnInit } from '@angular/core';
import { Language } from 'src/app/models/language';
import { LanguageService } from 'src/app/services/language.service';
declare var $: any;
@Component({
  selector: 'app-cashier-header',
  templateUrl: './cashier-header.component.html',
  styleUrls: ['./cashier-header.component.scss']
})
export class CashierHeaderComponent implements OnInit {
  @Input() title: string;
  languages: Language[] = [
    { value: 'en', viewValue: 'English' },
    { value: 'sc', viewValue: '简体中文' },
    { value: 'tc', viewValue: '繁體中文' }
  ];

  selectedLan: Language = this.languages[0];

  constructor(
    private lanServ: LanguageService
  ) {

    
    this.selectedLan = lanServ.selectedLan;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    $("#dropdown").click(function () {
      $(".dropdown-menu").toggle();
    });

    $(".dropdown-item").click(function () {
      $(".dropdown-menu").toggle();
    });
  }

  onSelectLan(lang: Language) {
    this.selectedLan = lang;
    this.lanServ.selectedLan = lang;
    this.lanServ.changeLan(lang);
  }


}
