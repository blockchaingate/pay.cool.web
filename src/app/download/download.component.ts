import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VersionModel } from 'src/app/models/version';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {

  breakpoint: any;
  clickCount = 0;
  totalDownloads: number = 0;

  items: VersionModel[] = [];
  lastestApk!: VersionModel;
  testApk!: VersionModel;

  showOlder = false;
  isLoaded = false;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog
  ) {
    //scroll to top
    window.scrollTo(0, 0);
  }

  getFiles() {
    return this.http.get('https://pay.cool/download/version.json');

    // return this.http.get('/assets/version.json');
  }


  ngOnInit() {
    console.log("DownloadComponent ngOnInit!");
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 3;

    this.getFiles().subscribe((data: any) => {
      console.log("data: ", data);
      // string to json 
      const newData = JSON.parse(data);

      this.lastestApk = newData.find((obj: { versionName: string; }) => obj.versionName === "Realize");

      console.log("this.lastestApk");
      console.log(this.lastestApk);

      this.testApk = newData.find((obj: { versionName: string; }) => obj.versionName === "Candidate");
      this.items = newData.filter((obj: { versionName: string; }) => obj.versionName != "Realize" && obj.versionName != "Candidate");
      this.getDownloadCount(newData[0].versionNumber);

      this.isLoaded = true;
    });

  }

  openTest() {
    this.clickCount++;
  }

  getDownloadCount(number: String) {
    let parts = number.split('+');

    const url = environment.endpoints.api + "appInsight/stats/1";

    this.http.get(url).subscribe((data: any) => {

      this.totalDownloads = data.data.record.downloadCount ?? 0;

    });
  }


  async setDownloadCount(number: String) {
    const url = environment.endpoints.api + "appInsight/downloadApp";

    this.http.get("http://www.geoplugin.net/json.gp").subscribe((data: any) => {
      const param = {
        appId: "1",
        version: number,
        ipAddress: data["geoplugin_request"],
        downloadSource: "1",
        campaign: "N/A",
      };
      this.http.put(url, param);
    });

  }

  donwloadAPK() {
    this.totalDownloads++;
    this.setDownloadCount(this.lastestApk.versionNumber);

    window.location.href = "https://pay.cool/download/latest.apk";
  }


  showOlderVersions() {
    this.showOlder = !this.showOlder;
  }
}
