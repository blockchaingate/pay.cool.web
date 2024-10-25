import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';
import { ProjectService } from 'src/app/services/project.service';
import { CoinService } from 'src/app/services/coin.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { UtilService } from 'src/app/services/util.service';
import {packageTypes} from '../../../config/packageTypes';
@Component({
  selector: 'app-project-package-add',
  templateUrl: './project-package-add.component.html',
  styleUrls: ['./project-package-add.component.scss']
})
export class ProjectPackageAddComponent implements OnInit {
  projects: any;
  project: string;
  type: number;
  selectedUSDC: boolean;
  selectedUSDT: boolean;
  selectedDUSD: boolean;
  images: any;
  name: string;
  value: number;
  nameChinese: string;
  description: string;
  descriptionChinese: string;
  wallet: any;
  modalRef: BsModalRef;
  types: any = packageTypes;

  constructor(
    private router: Router,
    private dataServ: DataService,
    private toastr: ToastrService,
    private utilServ: UtilService,
    private projectServ: ProjectService,
    private modalService: BsModalService,
    private coinServ: CoinService,
    private kanbanServ: KanbanService
  ) { }

  ngOnInit(): void {
    this.selectedUSDC = false;
    this.selectedUSDT = false;
    this.selectedDUSD = false;
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 
    this.projectServ.getAllProjects(100, 0).subscribe(
      (projects: any) => {
        this.projects = projects;
      }
    );
  }

  showName(name) {
    return this.utilServ.showName(name);
  }
  confirm() {
    if(!this.project) {
      this.toastr.error('Project not selected');
      return;
    }
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
      this.addProjectPackageDo(seed);
    });
  }

  addProjectPackageDo(seed: Buffer) {


    const data = {
      project: this.project,
      name: {
        en: this.name,
        sc: this.nameChinese
      },
      description: {
        en: this.description,
        sc: this.descriptionChinese
      },
      value: this.value,
      type: this.type
    }


    if(this.images && (this.images.length > 0)) {
      data['image'] = this.images[0];
    }
    const coins = [];
    if(this.selectedDUSD) {
      coins.push('DUSD');
    }
    if(this.selectedUSDC) {
      coins.push('USDC');
    }
    if(this.selectedUSDT) {
      coins.push('USDT');
    }
    data['coins'] = coins;
    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey;
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  

    this.projectServ.createProjectPackage(data).subscribe(
      async (res: any) => {
        if(res && res._id) {
          this.toastr.success('project package was added successfully');
          this.router.navigate(['/admin/project-packages']);
        } else {
          this.toastr.error('Error while adding project package');
        }
      }
    );

  }

}
