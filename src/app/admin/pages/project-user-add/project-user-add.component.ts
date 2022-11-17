import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { DataService } from 'src/app/services/data.service';
import { UtilService } from 'src/app/services/util.service';
import { statuses } from '../../../config/statuses';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-user-add',
  templateUrl: './project-user-add.component.html',
  styleUrls: ['./project-user-add.component.scss']
})
export class ProjectUserAddComponent implements OnInit {
  statuses = statuses;
  projectId: string;
  projects: any;
  user: string;
  status: number;

  wallet: any;
  modalRef: BsModalRef;
  constructor(
    private utilServ: UtilService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private router: Router,
    private dataServ: DataService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private projectServ: ProjectService
  ) { }

  ngOnInit(): void {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 

    this.projectServ.getAllProjects(100,0).subscribe(
      projects => this.projects = projects
    );
  }

  showName(name) {
    return this.utilServ.showName(name);
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

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
      this.addProjectDo(seed);
    });
  }

  async addProjectDo(seed: Buffer) {
    const abi = {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "internalType": "uint16",
          "name": "_projectId",
          "type": "uint16"
        },
        {
          "internalType": "uint8",
          "name": "_projectStatus",
          "type": "uint8"
        }
      ],
      "name": "updateProjectStatusOfUser",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };

    const args = [
      this.utilServ.fabToExgAddress(this.user),
      this.projectId,
      this.status
    ];

    const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, environment.addresses.smartContract.smartConractProjectUserRelation, abi, args);
    if(ret2 && ret2.ok && ret2._body && ret2._body.status == '0x1') {
      this.toastr.success('project user was added successfully');
      this.router.navigate(['/admin/project-users']);
    } else {
      this.toastr.error('Error while adding project user');
    }
  }

}
