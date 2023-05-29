import { Component, OnInit, EventEmitter, Output,Input, SimpleChanges} from '@angular/core';
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

  @Input() images: any;
  errMsg = '';
  successMsg = '';
  url = '';
  displayUpload = false;
  uploadSuccess = false;
  @Output()
  imagesChange = new EventEmitter<any>();

  constructor(private uploadService: UploadService) { }

  ngOnInit(): void {
    console.log('thissss.images=', this.images);
    if (!this.images || (this.images.length == 0)) {
      this.images = [];
    } else {
      this.croppedImage = this.images[0];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const {images} = changes;
    if (images && images.currentValue && (images.currentValue.length > 0)) {
        this.images = images.currentValue;
        this.croppedImage = this.images[0];
    }
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

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
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
        console.log('retttt=', ret);
        const signedUrl = ret.signed_request;
        this.url = ret.url;
        const file = this.dataURLtoFile(this.croppedImage, fileName);
        this.uploadService.uploadFileToSignedUrl(signedUrl, fileType, file).subscribe(
          retn => {

            this.images = [this.url];
            // this.uploaded.emit(this.url);
            // this.imagesChange.emit(this.croppedImage);
            this.imagesChange.emit(this.images);
            this.successMsg = 'Uploaded'; 

            this.uploadSuccess = true;
          },
          err => { 
            console.log('err=', err);
            this.errMsg = 'Error in uploading.'; });
      },
      error => this.errMsg = 'Error happened during apply presigned url.'
    );
  }




}
