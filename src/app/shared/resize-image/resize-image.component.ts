import { Component, OnInit, EventEmitter, } from '@angular/core';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { UploadService, DocType } from '../../services/upload.service';

@Component({
  selector: 'app-resize-image',
  templateUrl: './resize-image.component.html',
  styleUrls: ['./resize-image.component.scss']
})
export class ResizeImageComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  productId = '45fdssirfssss';

  errMsg = '';
  successMsg = '';
  url = '';
  displayUpload = false;
  uploadSuccess = false;
  imagesChange = new EventEmitter<any>();

  constructor(private uploadService: UploadService) { }

  ngOnInit(): void {
  }

  fileChangeEvent(event: any): void {
    // file changed
    console.log("fileChangeEvent");

    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    // show cropper
    console.log("imageLoaded");
    this.displayUpload = true;


  }

  cropperReady() {
    // cropper ready
    console.log("cropperReady");
  }

  loadImageFailed() {
    // show message
    console.log("loadImageFailed");
  }

  uploadImage() {

    //check if image is selected
    if (!this.croppedImage) {
      this.errMsg = 'Please select an image.';
      return;
    }

    const now = new Date();
    const milliseconds = now.getTime(); 

    //image name with current date in milliseconds
    const fileName = "Merchant" + milliseconds + ".png";
    const fileType = 'image/png';
    
    this.uploadService.applyPresignedUrl(fileName, fileType, DocType.PRODUCT, this.productId).subscribe(
      (ret: any) => {
        const signedUrl = ret.signed_request;
        this.url = ret.url;
        this.uploadService.uploadFileToSignedUrl(signedUrl, fileType, this.croppedImage).subscribe(
          retn => {
            // this.uploaded.emit(this.url);
            this.imagesChange.emit(this.croppedImage);
            this.successMsg = 'Uploaded'; 

            this.uploadSuccess = true;
          },
          err => { this.errMsg = 'Error in uploading.'; });
      },
      error => this.errMsg = 'Error happened during apply presigned url.'
    );
  }




}
