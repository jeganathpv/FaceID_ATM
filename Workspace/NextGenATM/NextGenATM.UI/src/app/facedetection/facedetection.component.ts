import { Component, OnInit } from '@angular/core';
import { HelperService } from '../helper.service';
import { MiddlewareService } from '../middleware.service';
import { Subject, Observable } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';

@Component({
  selector: 'app-facedetection',
  templateUrl: './facedetection.component.html',
  styleUrls: ['./facedetection.component.css']
})
export class FacedetectionComponent implements OnInit {

  constructor(private helperService: HelperService, private middlewareService: MiddlewareService) { }
  isLoading: boolean;
  public showWebcam = false;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public faceCount: number;
  public videoOptions: MediaTrackConstraints = {
    width: 1024,
    height: 768
  }
  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  ngOnInit() {
    this.helperService.isLoading$.subscribe((value) => {
      this.isLoading = value
    })
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    console.log(webcamImage);
    this.getFaceCount();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  hideWebcam() {
    this.showWebcam = false;
  }

  showWebcamfun() {
    this.showWebcam = true;
  }

  getFaceCount() {
    this.middlewareService.getFaceCount(this.webcamImage.imageAsDataUrl.split(',')[1]).then((res: any) => {
      console.log(res);
      this.faceCount = res.faceCount;
    })
  }

}
