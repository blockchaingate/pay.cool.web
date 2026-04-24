import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { UserReferralService } from 'src/app/services/userreferral.service';
import { Web3Service } from 'src/app/services/web3.service';
declare var anime: any;
declare var AOS: any;
declare var $: any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  lan = 'en';
  errMsg = '';
  data = {};
  x = 0;
  y = 0;
  total = 0;

  constructor(
    private storage: StorageMap, 
    private route: ActivatedRoute, 
    private userreferralServ: UserReferralService,
    private web3Serv: Web3Service) {
    this.lan = localStorage.getItem('_lan');
  }

  ngOnInit() {
    this.setSize();
    
    
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
    this.refreshPageEffects();
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

  private refreshPageEffects() {
    // The legacy theme script initializes AOS on window load only once.
    // When Angular navigates back to Home later, data-aos nodes may remain hidden
    // unless we explicitly refresh the library after the view is rendered.
    window.setTimeout(() => {
      if (typeof AOS !== 'undefined') {
        if (typeof AOS.refreshHard === 'function') {
          AOS.refreshHard();
        } else if (typeof AOS.refresh === 'function') {
          AOS.refresh();
        } else if (typeof AOS.init === 'function') {
          AOS.init({
            duration: 1000,
            mirror: true
          });
        }
      }

      this.initPartnerSlider();
    });
  }

  private initPartnerSlider() {
    if (typeof $ === 'undefined' || !$.fn?.owlCarousel) {
      return;
    }

    const partnerSlider = $('.partner-slider');
    if (!partnerSlider.length) {
      return;
    }

    if (partnerSlider.hasClass('owl-loaded')) {
      partnerSlider.trigger('refresh.owl.carousel');
      return;
    }

    partnerSlider.owlCarousel({
      loop: true,
      nav: false,
      dots: false,
      autoplay: true,
      autoplayTimeout: 4000,
      smartSpeed: 1200,
      autoplayHoverPause: true,
      lazyLoad: true,
      responsive: {
        0: {
          items: 2
        },
        768: {
          items: 3
        },
        992: {
          items: 4
        },
        1200: {
          items: 5
        }
      }
    });
  }

}
