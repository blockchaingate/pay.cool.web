import { Component, AfterContentInit, ViewChild } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { CoinService } from '../../../services/coin.service';
import { KanbanService } from '../../../services/kanban.service';
import { ScannerQRCodeConfig, ScannerQRCodeSelectedFiles, NgxScannerQrcodeService, ScannerQRCodeResult, NgxScannerQrcodeComponent} from 'ngx-scanner-qrcode';

@Component({
  selector: 'app-qrscanner-modal',
  templateUrl: './qrscanner-modal.component.html',
  styleUrls: ['./qrscanner-modal.component.scss']
})
export class QrscannerModalComponent implements AfterContentInit {
    modalRef: BsModalRef;

       // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
       public config: ScannerQRCodeConfig = {
        // fps: 1000,
        vibrate: 400,
        // isBeep: true,
        // decode: 'macintosh',
        deviceActive: 1,
        constraints: { 
          audio: false,
          video: {
            width: window.innerWidth
          }
        } 
      };
    
      public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
      public qrCodeResult2: ScannerQRCodeSelectedFiles[] = [];
    
      @ViewChild('action') action: NgxScannerQrcodeComponent;

    constructor(private modalService: BsModalService, private qrcode: NgxScannerQrcodeService){
    }

    ngAfterContentInit() {}

    public onEvent(e: ScannerQRCodeResult[]): void {
      console.log(e);
    }
  
    public handle(action: any, fn: string): void {
      action[fn]().subscribe(console.log, alert);
    }
  
    public onDowload(action): void {
      action.download().subscribe(console.log, alert);
    }
  
    public onSelects(files: any): void {
      this.qrcode.loadFiles(files).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
        this.qrCodeResult = res;
      });
    }
  
    public onSelects2(files: any): void {
      this.qrcode.loadFilesToScan(files, this.config).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
        console.log(res);
        this.qrCodeResult2 = res;
      });
    }
}
