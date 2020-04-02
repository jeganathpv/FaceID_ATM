import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { MiddlewareService } from '../middleware.service';
import { Subject, Observable } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';



@Component({
  selector: 'app-facedetection',
  templateUrl: './facedetection.component.html',
  styleUrls: ['./facedetection.component.css']
})
export class FacedetectionComponent implements OnInit {
  @Input() buttonControlEnabled: boolean = false;
  @Input() isLoading: string;
  // outputs image as base64 string
  @Output() image = new EventEmitter();

  constructor(private middlewareService: MiddlewareService) { }
  public showWebcam = true;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    width: 1024,
    height: 768
  }
  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  ngOnInit() {

  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.image.emit(webcamImage.imageAsBase64);
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

}
