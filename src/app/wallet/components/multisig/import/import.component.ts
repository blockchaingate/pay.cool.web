import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MultisigService } from 'src/app/services/multisig.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  step = 1;
  address: string;
  constructor(
    private multisigServ: MultisigService,
    private toastServ: ToastrService
    ) { }

  ngOnInit(): void {
  }

  import() {
    this.multisigServ.getByAddress(this.address).subscribe(
      {
        next: (ret: any) => {
          if(ret.success) {
            const data = ret.data;
          } else {
            this.toastServ.error('Error while getting multisig wallet by addess');
          }
        },
        error: (error: any) => {
          this.toastServ.error(error);
        }
      }
    );
  }
}
