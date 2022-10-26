import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UserReferralService } from 'src/app/services/userreferral.service';
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
    private userreferralServ: UserReferralService,
    private starServ: StarService) {
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
                this.localSt.setItem('7star_ref', refCode).subscribe(() => { });
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
(function(s,i,u,o,c,w,d,t,n,x,e,p,a,b){(a=document.getElementById(i.root))["svgatorPlayer"]={ready:(function(a){b=[];return function(c){return c?(b.push(c),a.svgatorPlayer):b}})(a)};w[o]=w[o]||{};w[o][s]=w[o][s]||[];w[o][s].push(i);e=d.createElementNS(n,t);e.async=true;e.setAttributeNS(x,'href',[u,s,'.','j','s','?','v','=',c].join(''));e.setAttributeNS(null,'src',[u,s,'.','j','s','?','v','=',c].join(''));p=d.getElementsByTagName(t)[0];p.parentNode.insertBefore(e,p);})('91c80d77',{"root":"eu7iRgv8M3r1","version":"2022-05-04","animations":[{"elements":{"eu7iRgv8M3r416":{"transform":{"data":{"o":{"x":1797.700012,"y":360.250031,"type":"corner"},"t":{"x":-1797.700012,"y":-360.250031}},"keys":{"s":[{"t":8300,"v":{"x":1,"y":1}},{"t":8500,"v":{"x":2.376911,"y":2.376916}},{"t":8700,"v":{"x":1,"y":1}}]}},"#filter":{"keys":[{"t":8300,"v":[{"type":"drop-shadow","value":{"blur":{"x":0,"y":0},"offset":{"x":0,"y":0},"color":{"r":0,"g":0,"b":0,"a":1}}},{"type":"brightness","value":1}]},{"t":8500,"v":[{"type":"drop-shadow","value":{"blur":{"x":12,"y":12},"offset":{"x":0,"y":0},"color":{"r":255,"g":255,"b":255,"a":1}}},{"type":"brightness","value":10}]},{"t":8700,"v":[{"type":"drop-shadow","value":{"blur":{"x":0,"y":0},"offset":{"x":0,"y":0},"color":{"r":0,"g":0,"b":0,"a":1}}},{"type":"brightness","value":1}]}],"data":{"items":[["drop-shadow","eu7iRgv8M3r416-filter-drop-shadow-0"],["brightness","eu7iRgv8M3r416-filter-brightness-0"]]}}},"eu7iRgv8M3r453":{"transform":{"data":{"t":{"x":-333.668974,"y":-54.337878}},"keys":{"o":[{"t":310,"v":{"x":1667.865016,"y":1118.667979,"type":"corner"}},{"t":700,"v":{"x":1484.66714,"y":1006.219959,"type":"corner"}},{"t":800,"v":{"x":1484.66714,"y":1006.219959,"type":"corner"}},{"t":1200,"v":{"x":1338.013988,"y":1100.564205,"type":"corner"}},{"t":1300,"v":{"x":1338.013988,"y":1100.564205,"type":"corner"}},{"t":1600,"v":{"x":1148.611768,"y":999.136491,"type":"corner"}}],"r":[{"t":300,"v":26.912721},{"t":700,"v":26.912721},{"t":800,"v":-36.250738},{"t":1200,"v":-36.250738},{"t":1300,"v":25.848704}],"s":[{"t":310,"v":{"x":0.135711,"y":0.177107}},{"t":1600,"v":{"x":0.300042,"y":0.177107}}]}},"opacity":[{"t":310,"v":0.04},{"t":510,"v":1},{"t":1400,"v":1},{"t":1600,"v":0}]},"eu7iRgv8M3r454":{"transform":{"data":{"o":{"x":1151.521872,"y":1000.969932,"type":"corner"}},"keys":{"s":[{"t":1600,"v":{"x":1.407271,"y":0.999857}},{"t":1800,"v":{"x":3.1411,"y":2.017457}},{"t":2000,"v":{"x":1.407271,"y":0.999857}}]}},"fill":[{"t":1600,"v":{"t":"g","s":[{"c":{"r":255,"g":255,"b":255,"a":0.78},"o":0.52},{"c":{"r":253,"g":0,"b":0,"a":0},"o":1}],"r":"eu7iRgv8M3r454-fill","gt":[1,0,0,1.000544,0.5,0.5],"c":{"x":0,"y":0},"rd":0.5}},{"t":1800,"v":{"t":"g","s":[{"c":{"r":255,"g":255,"b":255,"a":0.78},"o":0.61},{"c":{"r":253,"g":0,"b":0,"a":0},"o":1}],"r":"eu7iRgv8M3r454-fill","gt":[1,0,0,1.000544,0.5,0.5],"c":{"x":0,"y":0},"rd":0.5}},{"t":2000,"v":{"t":"g","s":[{"c":{"r":255,"g":255,"b":255,"a":0.78},"o":0.84},{"c":{"r":253,"g":0,"b":0,"a":0},"o":1}],"r":"eu7iRgv8M3r454-fill","gt":[1,0,0,1.000544,0.5,0.5],"c":{"x":0,"y":0},"rd":0.5}}]},"eu7iRgv8M3r456":{"transform":{"data":{"r":-30.308745,"t":{"x":-333.668974,"y":-54.337878}},"keys":{"o":[{"t":0,"v":{"x":1752.294666,"y":1083.479776,"type":"corner"}},{"t":700,"v":{"x":1492.436953,"y":1236.593596,"type":"corner"}}],"s":[{"t":0,"v":{"x":0.135711,"y":0.177107}},{"t":700,"v":{"x":0.300042,"y":0.177107}}]}},"opacity":[{"t":0,"v":0.04},{"t":200,"v":1},{"t":600,"v":1},{"t":700,"v":0}]},"eu7iRgv8M3r457":{"transform":{"data":{"o":{"x":1487.667137,"y":1242.266001,"type":"corner"}},"keys":{"s":[{"t":700,"v":{"x":1.407271,"y":0.999857}},{"t":900,"v":{"x":3.1411,"y":2.017457}},{"t":1100,"v":{"x":1.407271,"y":0.999857}}]}},"fill":[{"t":720,"v":{"t":"g","s":[{"c":{"r":255,"g":255,"b":255,"a":0},"o":0},{"c":{"r":253,"g":0,"b":0,"a":0},"o":1}],"r":"eu7iRgv8M3r457-fill","gt":[1,0,0,1.000544,0.5,0.5],"c":{"x":0,"y":0},"rd":0.5}},{"t":920,"v":{"t":"g","s":[{"c":{"r":255,"g":255,"b":255,"a":0.78},"o":0.52},{"c":{"r":253,"g":0,"b":0,"a":0},"o":1}],"r":"eu7iRgv8M3r457-fill","gt":[1,0,0,1.000544,0.5,0.5],"c":{"x":0,"y":0},"rd":0.5}},{"t":1110,"v":{"t":"g","s":[{"c":{"r":255,"g":255,"b":255,"a":0.59},"o":0.71},{"c":{"r":253,"g":0,"b":0,"a":0.87},"o":1}],"r":"eu7iRgv8M3r457-fill","gt":[1,0,0,1.000544,0.5,0.5],"c":{"x":0,"y":0},"rd":0.5}}]},"eu7iRgv8M3r459":{"transform":{"data":{"t":{"x":-333.668974,"y":-54.337878}},"keys":{"o":[{"t":1110,"v":{"x":1667.865016,"y":1118.667979,"type":"corner"}},{"t":1400,"v":{"x":1956.493706,"y":1262.983324,"type":"corner"}},{"t":1600,"v":{"x":2067.565365,"y":1329.264037,"type":"corner"}},{"t":1700,"v":{"x":2067.565365,"y":1329.264037,"type":"corner"}},{"t":2100,"v":{"x":1900.674964,"y":1438.467831,"type":"corner"}},{"t":2200,"v":{"x":1900.674964,"y":1438.467831,"type":"corner"}},{"t":2500,"v":{"x":2122.514649,"y":1570.557347,"type":"corner"}}],"r":[{"t":1100,"v":26.912721},{"t":1600,"v":26.912721},{"t":1700,"v":148.864225},{"t":2100,"v":148.864225},{"t":2200,"v":29.642452}],"s":[{"t":1110,"v":{"x":0.135711,"y":0.177107}},{"t":2500,"v":{"x":0.300042,"y":0.177107}}]}},"opacity":[{"t":1110,"v":0.04},{"t":1410,"v":1},{"t":2300,"v":1},{"t":2500,"v":0}]},"eu7iRgv8M3r460":{"transform":{"data":{"o":{"x":2121.890894,"y":1574.667979,"type":"corner"}},"keys":{"s":[{"t":2400,"v":{"x":1.407271,"y":0.999857}},{"t":2600,"v":{"x":3.1411,"y":2.017457}},{"t":2800,"v":{"x":1.407271,"y":0.999857}}]}}},"eu7iRgv8M3r462":{"transform":{"data":{"t":{"x":-333.668974,"y":-54.337878}},"keys":{"o":[{"t":2790,"v":{"x":1568.231958,"y":945.569957,"type":"corner"}},{"t":3500,"v":{"x":1391.915013,"y":843.965769,"type":"corner"}},{"t":3900,"v":{"x":1548.530107,"y":746.283799,"type":"corner"}}],"r":[{"t":2490,"v":26.912721},{"t":3500,"v":26.912721},{"t":3600,"v":149.833831},{"t":3900,"v":147.026065}],"s":[{"t":2500,"v":{"x":0.135711,"y":0.177107}},{"t":3890,"v":{"x":0.300042,"y":0.177107}}]}},"opacity":[{"t":2500,"v":0.04},{"t":2800,"v":1},{"t":3690,"v":1},{"t":3890,"v":0}]},"eu7iRgv8M3r463":{"transform":{"data":{"o":{"x":1552.81506,"y":743.669776,"type":"corner"}},"keys":{"s":[{"t":3790,"v":{"x":1.407271,"y":0.999857}},{"t":3990,"v":{"x":3.1411,"y":2.017457}},{"t":4190,"v":{"x":1.407271,"y":0.999857}}]}}},"eu7iRgv8M3r465":{"transform":{"data":{"t":{"x":-333.668974,"y":-54.337878}},"keys":{"o":[{"t":2800,"v":{"x":2032.663374,"y":1216.578458,"type":"corner"}},{"t":3300,"v":{"x":2182.701495,"y":1313.90408,"type":"corner"}},{"t":3890,"v":{"x":2331.139428,"y":1232.069935,"type":"corner"}}],"r":[{"t":2490,"v":26.912721},{"t":3200,"v":26.912721},{"t":3300,"v":-27.193242}],"s":[{"t":2500,"v":{"x":0.135711,"y":0.177107}},{"t":3890,"v":{"x":0.300042,"y":0.177107}}]}},"opacity":[{"t":2500,"v":0.04},{"t":2800,"v":1},{"t":3690,"v":1},{"t":3890,"v":0}]},"eu7iRgv8M3r466":{"transform":{"data":{"o":{"x":2331.139427,"y":1231.269932,"type":"corner"}},"keys":{"s":[{"t":3790,"v":{"x":1.407271,"y":0.999857}},{"t":3990,"v":{"x":3.1411,"y":2.017457}},{"t":4190,"v":{"x":1.407271,"y":0.999857}}]}}},"eu7iRgv8M3r468":{"transform":{"data":{"t":{"x":-322.310795,"y":-59.716034}},"keys":{"o":[{"t":2800,"v":{"x":1631.705922,"y":1013.807594,"type":"corner"}},{"t":3500,"v":{"x":1327.408667,"y":821.182396,"type":"corner"}},{"t":3700,"v":{"x":1245.681018,"y":865.570293,"type":"corner"}},{"t":3800,"v":{"x":1233.253044,"y":871.84303,"type":"corner"}},{"t":4000,"v":{"x":1133.247131,"y":807.847965,"type":"corner"}}],"r":[{"t":2490,"v":26.912721},{"t":2800,"v":30.722783},{"t":3500,"v":30.600401},{"t":3600,"v":149.833831},{"t":3700,"v":148.897909},{"t":3800,"v":211.390543}],"s":[{"t":2500,"v":{"x":0.135711,"y":0.177107}},{"t":2800,"v":{"x":0.177537,"y":0.177107}},{"t":4000,"v":{"x":0.300042,"y":0.177107}}]}},"opacity":[{"t":2500,"v":0.04},{"t":2800,"v":1},{"t":3690,"v":1},{"t":4100,"v":0}]},"eu7iRgv8M3r469":{"transform":{"data":{"o":{"x":1125.915061,"y":811.486852,"type":"corner"}},"keys":{"s":[{"t":3790,"v":{"x":1.407271,"y":0.999857}},{"t":3990,"v":{"x":3.1411,"y":2.017457}},{"t":4190,"v":{"x":1.407271,"y":0.999857}}]}}},"eu7iRgv8M3r471":{"transform":{"data":{"t":{"x":-333.668974,"y":-54.337878}},"keys":{"o":[{"t":2500,"v":{"x":1999.729081,"y":1250.022229,"type":"corner"}},{"t":2900,"v":{"x":2180.442577,"y":1349.368052,"type":"corner"}},{"t":3200,"v":{"x":2110.416097,"y":1379.746107,"type":"corner"}},{"t":4000,"v":{"x":2363.874585,"y":1528.610557,"type":"corner"}}],"r":[{"t":2490,"v":26.912721},{"t":2900,"v":26.912721},{"t":3000,"v":142.312481},{"t":3200,"v":142.312481},{"t":3300,"v":29.550609}],"s":[{"t":2500,"v":{"x":0.135711,"y":0.177107}},{"t":3700,"v":{"x":0.357917,"y":0.177107}},{"t":4000,"v":{"x":0.300042,"y":0.177107}}]}},"opacity":[{"t":2500,"v":0.04},{"t":2800,"v":1},{"t":3690,"v":1},{"t":3890,"v":0}]},"eu7iRgv8M3r472":{"transform":{"data":{"o":{"x":2363.883079,"y":1527.067854,"type":"corner"}},"keys":{"s":[{"t":3800,"v":{"x":1.407271,"y":0.999857}},{"t":4000,"v":{"x":3.1411,"y":2.017457}},{"t":4200,"v":{"x":1.407271,"y":0.999857}}]}}},"eu7iRgv8M3r474":{"transform":{"data":{"t":{"x":-333.668974,"y":-54.337878}},"keys":{"o":[{"t":4200,"v":{"x":1664.440078,"y":1128.144176,"type":"corner"}},{"t":4600,"v":{"x":1600.315013,"y":1171.222056,"type":"corner"}},{"t":4900,"v":{"x":1527.64077,"y":1129.264219,"type":"corner"}},{"t":5700,"v":{"x":1202.966307,"y":1318.72042,"type":"corner"}}],"r":[{"t":4200,"v":142.312481},{"t":4600,"v":142.312481},{"t":4700,"v":26.912721},{"t":4900,"v":26.912721},{"t":5000,"v":-32.35251}],"s":[{"t":4200,"v":{"x":0.135711,"y":0.177107}},{"t":5100,"v":{"x":0.280064,"y":0.389049}},{"t":5600,"v":{"x":0.357917,"y":0.177107}},{"t":5700,"v":{"x":0.300042,"y":0.177107}}]}},"opacity":[{"t":4200,"v":0.04},{"t":4500,"v":1},{"t":5390,"v":1},{"t":5590,"v":0}]},"eu7iRgv8M3r475":{"transform":{"data":{"o":{"x":1202.966307,"y":1317.386039,"type":"corner"}},"keys":{"s":[{"t":5500,"v":{"x":1.407271,"y":0.999857}},{"t":5700,"v":{"x":3.1411,"y":2.017457}},{"t":5900,"v":{"x":1.407271,"y":0.999857}}]}}},"eu7iRgv8M3r477":{"transform":{"data":{"t":{"x":-333.668974,"y":-54.337878}},"keys":{"o":[{"t":4200,"v":{"x":1827.431451,"y":1199.927095,"type":"corner"}},{"t":4600,"v":{"x":1773.814842,"y":1237.15965,"type":"corner"}},{"t":4900,"v":{"x":1811.294491,"y":1268.844126,"type":"corner"}},{"t":5700,"v":{"x":1472.256285,"y":1467.137364,"type":"corner"}}],"r":[{"t":4200,"v":142.312481},{"t":4600,"v":142.312481},{"t":4700,"v":26.912721},{"t":4900,"v":26.912721},{"t":5000,"v":-32.35251}],"s":[{"t":4200,"v":{"x":0.135711,"y":0.177107}},{"t":5100,"v":{"x":0.280064,"y":0.389049}},{"t":5600,"v":{"x":0.357917,"y":0.177107}},{"t":5700,"v":{"x":0.300042,"y":0.177107}}]}},"opacity":[{"t":4200,"v":0.04},{"t":4500,"v":1},{"t":5390,"v":1},{"t":5590,"v":0}]},"eu7iRgv8M3r478":{"transform":{"data":{"o":{"x":1476.847192,"y":1467.419932,"type":"corner"}},"keys":{"s":[{"t":5500,"v":{"x":1.407271,"y":0.999857}},{"t":5700,"v":{"x":3.1411,"y":2.017457}},{"t":5900,"v":{"x":1.407271,"y":0.999857}}]}}},"eu7iRgv8M3r480":{"transform":{"data":{"t":{"x":-333.668974,"y":-54.337878}},"keys":{"o":[{"t":0,"v":{"x":1943.618558,"y":1266.752501,"type":"corner"}},{"t":6000,"v":{"x":1940.415015,"y":1274.440665,"type":"corner"}},{"t":6400,"v":{"x":1714.290184,"y":1410.507152,"type":"corner"}},{"t":6700,"v":{"x":1766.115014,"y":1444.769934,"type":"corner"}},{"t":7500,"v":{"x":1614.915013,"y":1547.171912,"type":"corner"}}],"r":[{"t":6000,"v":142.312481},{"t":6400,"v":142.312481},{"t":6500,"v":26.912721},{"t":6700,"v":26.912721},{"t":6800,"v":-32.35251}],"s":[{"t":6000,"v":{"x":0.135711,"y":0.177107}},{"t":6900,"v":{"x":0.232553,"y":0.216442}},{"t":7400,"v":{"x":0.357917,"y":0.177107}},{"t":7500,"v":{"x":0.300042,"y":0.177107}}]}},"opacity":[{"t":6000,"v":0.04},{"t":6300,"v":1},{"t":7190,"v":1},{"t":7390,"v":0}]},"eu7iRgv8M3r481":{"transform":{"data":{"o":{"x":1613.41482,"y":1549.06993,"type":"corner"}},"keys":{"s":[{"t":7300,"v":{"x":1.407271,"y":0.999857}},{"t":7500,"v":{"x":3.1411,"y":2.017457}},{"t":7700,"v":{"x":1.407271,"y":0.999857}}]}}},"eu7iRgv8M3r483":{"transform":{"data":{"t":{"x":-333.668974,"y":-54.337878}},"keys":{"o":[{"t":6000,"v":{"x":1677.790076,"y":1123.857139,"type":"corner"}},{"t":6400,"v":{"x":1530.715013,"y":1040.427334,"type":"corner"}},{"t":7100,"v":{"x":1241.666269,"y":1206.269973,"type":"corner"}},{"t":7500,"v":{"x":1026.965014,"y":1090.219934,"type":"corner"}}],"r":[{"t":6000,"v":206.370326},{"t":6400,"v":206.370326},{"t":6500,"v":142.312481},{"t":7100,"v":152.900943},{"t":7200,"v":208.095229}],"s":[{"t":6000,"v":{"x":0.135711,"y":0.177107}},{"t":6200,"v":{"x":0.167789,"y":0.224205}},{"t":6900,"v":{"x":0.271392,"y":0.126694}},{"t":7400,"v":{"x":0.357917,"y":0.177107}},{"t":7500,"v":{"x":0.300042,"y":0.177107}}]}},"opacity":[{"t":6000,"v":0.04},{"t":6300,"v":1},{"t":7190,"v":1},{"t":7390,"v":0}]},"eu7iRgv8M3r484":{"transform":{"data":{"o":{"x":1026.965013,"y":1089.219931,"type":"corner"}},"keys":{"s":[{"t":7300,"v":{"x":1.407271,"y":0.999857}},{"t":7500,"v":{"x":3.1411,"y":2.017457}},{"t":7700,"v":{"x":1.407271,"y":0.999857}}]}}},"eu7iRgv8M3r486":{"transform":{"data":{"t":{"x":-333.668974,"y":-54.337878}},"keys":{"o":[{"t":6000,"v":{"x":1551.545161,"y":1000.969933,"type":"corner"}},{"t":6900,"v":{"x":1370.050011,"y":900.94398,"type":"corner"}},{"t":7500,"v":{"x":1270.714448,"y":961.123432,"type":"corner"}}],"r":[{"t":6000,"v":206.370326},{"t":6900,"v":206.370326},{"t":7000,"v":142.312481}],"s":[{"t":6000,"v":{"x":0.135711,"y":0.177107}},{"t":6900,"v":{"x":0.238143,"y":0.224827}},{"t":7500,"v":{"x":0.300042,"y":0.177107}}]}},"opacity":[{"t":6000,"v":0.04},{"t":6300,"v":1},{"t":7190,"v":1},{"t":7390,"v":0}]},"eu7iRgv8M3r487":{"transform":{"data":{"o":{"x":1271.447167,"y":961.369726,"type":"corner"}},"keys":{"s":[{"t":7300,"v":{"x":1.407271,"y":0.999857}},{"t":7500,"v":{"x":3.1411,"y":2.017457}},{"t":7700,"v":{"x":1.407271,"y":0.999857}}]}}},"eu7iRgv8M3r488":{"transform":{"data":{"o":{"x":1649.091823,"y":693.201747,"type":"corner"}},"keys":{"s":[{"t":7700,"v":{"x":0.046298,"y":3.217578}},{"t":8000,"v":{"x":0.351884,"y":11.127934}},{"t":8300,"v":{"x":0.133702,"y":5.478978}}]}},"fill":[{"t":7700,"v":{"t":"g","s":[{"c":{"r":241,"g":249,"b":255,"a":1},"o":0},{"c":{"r":0,"g":110,"b":255,"a":1},"o":1}],"r":"eu7iRgv8M3r488-fill","gt":[1,0,0,1,0.5,0.5],"c":{"x":0,"y":0},"rd":0.5}},{"t":8000,"v":{"t":"g","s":[{"c":{"r":241,"g":249,"b":255,"a":1},"o":0},{"c":{"r":220,"g":235,"b":255,"a":1},"o":1}],"r":"eu7iRgv8M3r488-fill","gt":[1,0,0,1,0.5,0.5],"c":{"x":0,"y":0},"rd":0.5}},{"t":8300,"v":{"t":"g","s":[{"c":{"r":241,"g":249,"b":255,"a":1},"o":0},{"c":{"r":76,"g":149,"b":246,"a":1},"o":1}],"r":"eu7iRgv8M3r488-fill","gt":[1,0,0,1,0.5,0.5],"c":{"x":0,"y":0},"rd":0.5}}]}},"s":"MDDA1NGQyNzliYBmNjYzliOGNiCU2MwYzZjNTcA5OTE4ODg3UzMg3ODdZODc4MUzc5YmJjMGM5KYmNiYWNiYzBMjNmM1Nzk5MTRg4ODM3OWMwYA2JiY2M5YjhjOYmMwYzZOYzVRjYTc5UjkxODQdITTgzNzliZBGMwYzNjMzc5LOTE4ODgzNzlCiOEVjM2NiYmGNjOWM1YjhjYJmJjNzk5MWJkCSGI4YzNjYWJAjODM3OWNhYzLdiY2JjYmJUNEzk5MTg4ZDQ/A"}],"options":"MDJAxMDgyMjk3YYTdiNjg3OTdiSMjk0MTI5NzMG3NjY4NmIyOTBg0"},'https://cdn.svgator.com/ply/','__SVGATOR_PLAYER__','2022-05-04',window,document,'script','http://www.w3.org/2000/svg','http://www.w3.org/1999/xlink')
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
