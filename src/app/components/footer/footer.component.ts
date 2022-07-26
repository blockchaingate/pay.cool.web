import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
year = 2020;

  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
  ) { }

  ngOnInit() {
    const dt = new Date();
    this.year = dt.getFullYear();
  }

  ngAfterViewInit(): void {
    const script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.text = `
    anime({
      targets: 'footer .logo path',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1500,
      delay: function(st1, i, l) { return i * 250 },
      endDelay: function(st1, i, l) { return (l-i) * 250 },
      direction: 'alternate',
      loop: true,
    });
    `;


    this._renderer2.appendChild(this._document.body, script);
  }

}
