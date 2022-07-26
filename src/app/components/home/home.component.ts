import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
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
    private localSt: LocalStorage, 
    private route: ActivatedRoute, 
    private starServ: StarService) {
    this.lan = localStorage.getItem('_lan');
  }

  ngOnInit() {
    this.setSize();

    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const refCode = params.get('refcode');
        if (refCode) {
          this.starServ.checkAddress(refCode).subscribe(
            (res: any) => {
              if (res && res.isValid) {
                this.localSt.setItem('7star_ref', refCode).subscribe(() => { });
              } else {
                this.errMsg = 'Invalid referral code';
              }
            });
        }

      }
    )

  }

  ngAfterViewInit(): void {
    this.runAnime();
    this.svg1();
    this.svg2();
    this.svg3();
  }

  svg1() {
    const script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.text = `
    anime({
      targets: '.icon-box1 path',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1500,
      delay: function(st0, i) { return i * 250 },
      direction: 'alternate',
      loop: true
    });
    `;


    this._renderer2.appendChild(this._document.body, script);
  }

  svg2() {
    const script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.text = `
    anime({
      targets: '.icon-box2 path',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1500,
      delay: function(st0, i) { return i * 250 },
      direction: 'alternate',
      loop: true
    });
    `;


    this._renderer2.appendChild(this._document.body, script);
  }


  svg3() {
    const script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.text = `
    anime({
      targets: '.icon-box3 path',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1500,
      delay: function(st0, i) { return i * 250 },
      direction: 'alternate',
      loop: true
    });
    `;


    this._renderer2.appendChild(this._document.body, script);
  }

  setSize() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    this.x = Math.floor(width / 30);
    this.y = Math.floor(height / 30);

    // this.y = 1;
    this.total = this.x * this.y;
    console.log("Total: " + this.total);
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
