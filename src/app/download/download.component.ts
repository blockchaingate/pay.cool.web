import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VersionModel } from 'src/app/models/version';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {

  breakpoint: any;
  clickCount = 0;

  items: VersionModel[] = [];
   lastestApk!: VersionModel;
   testApk!: VersionModel;
 

   constructor(
    private http: HttpClient,
    public dialog: MatDialog
  ) {
    
   }

  getFiles() {
    return this.http.get('https://pay.cool/download/version.json');
    // return this.http.get('/assets/version.json');
   }


   ngOnInit() {
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 3;

    this.getFiles().subscribe((data: any) => {

      this.lastestApk = data.find((obj: { versionName: string; }) => obj.versionName === "Realize");
      this.testApk = data.find((obj: { versionName: string; }) => obj.versionName === "Candidate");
      this.items = data.filter((obj: { versionName: string; }) => obj.versionName != "Realize" && obj.versionName != "Candidate");
    });
  }

  openTest(){
    this.clickCount ++;
  }


}
