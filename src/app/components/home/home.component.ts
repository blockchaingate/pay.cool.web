import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { UserReferralService } from 'src/app/services/userreferral.service';
import { Web3Service } from 'src/app/services/web3.service';
import { StarService } from '../../services/star.service';
declare var anime: any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  lan = 'en';
  errMsg = '';
  data = {};
  x = 0;
  y = 0;
  total = 0;

  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private storage: StorageMap, 
    private route: ActivatedRoute, 
    private userreferralServ: UserReferralService,
    private web3Serv: Web3Service,
    private starServ: StarService) {
    this.lan = localStorage.getItem('_lan');
  }

  ngOnInit() {
    this.setSize();
    
    const requestRefundId = '0x89d7e2530fc14714db77bc40b53c65ec27e4c39544278c90f4355a1e10dd8376';
    const hashForSignature = this.web3Serv.hashKanbanMessage( requestRefundId);
    
    this.route.queryParams.subscribe(
      (params: ParamMap) => {
        const refCode = params['ref'];
        if (refCode) {
          this.userreferralServ.checkAddress(refCode).subscribe(
            (res: any) => {
              if (res && res.isValid) {
                this.storage.watch('7star_ref', refCode).subscribe(() => { });
              } else {
                this.errMsg = 'Invalid referral code';
              }
            });
        }

      }
    )
      this.runAnimation();
  }

  runAnimation() {

 }
  ngAfterViewInit(): void {
  }


  setSize() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    this.x = Math.floor(width / 30);
    this.y = Math.floor(height / 30);

    // this.y = 1;
    this.total = this.x * this.y;
  }

  runAnime() {
    var tl = anime.timeline({
      easing: 'easeOutExpo',
      loop: true
    })

    tl.add({
      targets: '.el',

      scale: [
        { value: .5, easing: 'easeOutSine', duration: 500 },
        { value: .1, easing: 'easeInOutQuad', duration: 1200 }
      ],
      // delay: anime.stagger(100)
      delay: anime.stagger(200, { grid: [Math.floor(this.x / 2), Math.floor(this.y / 2)], from: 'center' }),


    }).add({
      scale: .1,
      delay: 1000
    }).add({
      targets: '.el',
      scale: [
        { value: 1, easing: 'easeOutSine', duration: 500 },
        { value: .1, easing: 'easeInOutQuad', duration: 1200 }
      ],
      delay: anime.stagger(300, { grid: [this.x, this.y], from: 'center' }),

    });
  }

}
