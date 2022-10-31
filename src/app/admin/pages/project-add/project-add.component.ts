import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { DataService } from 'src/app/services/data.service';
import { ProjectService } from 'src/app/services/project.service';
import { CoinService } from 'src/app/services/coin.service';
import { KanbanService } from 'src/app/services/kanban.service';

@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.scss']
})
export class ProjectAddComponent implements OnInit {
  images: any;
  projectId: string;
  name: string;
  nameChinese: string;
  description: string;
  descriptionChinese: string;
  kvalue: number;
  wallet: any;
  modalRef: BsModalRef;
  constructor(
    private kanbanSmartContractServ: KanbanSmartContractService,
    private router: Router,
    private dataServ: DataService,
    private toastr: ToastrService,
    private projectServ: ProjectService,
    private modalService: BsModalService,
    private coinServ: CoinService,
    private kanbanServ: KanbanService
  ) { }

  ngOnInit(): void {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 
  }

  confirm() {
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
      this.addProjectDo(seed);
    });
  }

  addProjectDo(seed: Buffer) {
    const abi = {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "_projectId",
          "type": "uint16"
        }
      ],
      "name": "createProject",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };

    const args = [
      this.projectId
    ];

    const data = {
      id: this.projectId,
      name: {
        en: this.name,
        sc: this.nameChinese
      },
      description: {
        en: this.description,
        sc: this.descriptionChinese
      },
      kvalue: this.kvalue
    }

    if(this.images && (this.images.length > 0)) {
      data['image'] = this.images[0];
    }
    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey;
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  

    this.projectServ.createProject(data).subscribe(
      async (res: any) => {
        if(res && res._id) {
          const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, environment.addresses.smartContract.smartConractProjectUserRelation, abi, args);
          if(ret2 && ret2.ok && ret2._body && ret2._body.status == '0x1') {
            this.toastr.success('project was added successfully');
            this.router.navigate(['/admin/projects']);
          } else {
            this.toastr.error('Error while adding project');
          }
        } else {

        }
      }
    );

  }
}
