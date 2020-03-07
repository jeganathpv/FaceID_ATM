import { Component, OnInit, Output, Input } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-facedetection',
  templateUrl: './facedetection.component.html',
  styleUrls: ['./facedetection.component.css']
})

export class FacedetectionComponent implements OnInit {
  @Input() isLoading: boolean;
  @Output() imageinBase64 = new EventEmitter();
  @Input() showWebcam: boolean;
  @Input() enableButtonControls: boolean = false

  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    width: 1024,
    height: 768
  }

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  constructor() { }

  ngOnInit() {
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.imageinBase64.emit(webcamImage.imageAsBase64.split(',')[0])
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
