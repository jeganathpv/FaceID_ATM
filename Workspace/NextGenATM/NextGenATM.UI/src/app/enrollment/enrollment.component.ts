import { Component, OnInit } from '@angular/core';
import { MiddlewareService } from '../middleware.service';
import { SelectItem } from 'primeng/api';
import { Subject, Observable } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css']
})
export class EnrollmentComponent implements OnInit {
  authStatus: any;
  selectedBank: any;
  username: string;
  balance: number;
  selectedBankDetails: any;
  banksList: any;
  cities1: SelectItem[];
  wizardCurrentIndex: number;
  bankSelectorList: SelectItem[] = [];
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public faceCount: number;
  public videoOptions: MediaTrackConstraints = {
    width: 1024,
    height: 768
  }
  wizardSteps: MenuItem[];
  validImage: boolean;
  validImageBaseString: string;
  isDetecting: boolean;
  hasGenerated: boolean = false;
  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  constructor(private middlewareService: MiddlewareService) {
    // this.cities1 = [
    //   { label: 'Select City', value: null },
    //   { label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } },
    //   { label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } },
    //   { label: 'London', value: { id: 3, name: 'London', code: 'LDN' } },
    //   { label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } },
    //   { label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } }
    // ];
  }

  ngOnInit() {
    // this.showIndexing = false;
    this.authStatus = this.middlewareService.getAuthStatus();
    console.log(this.authStatus);
    // this.initEnrollment();

    this.wizardSteps = [
      {
        label: 'Branch Selection',
        command: (event: any) => {
          this.wizardCurrentIndex = 0;
        },
      },
      {
        label: 'Details',
        command: (event: any) => {
          this.wizardCurrentIndex = 1;
        },
      },
      {
        label: 'Face Detection',
        command: (event: any) => {
          this.wizardCurrentIndex = 2;
        },
      }

    ]
  }

  onstateChange() {
    this.authStatus = this.middlewareService.getAuthStatus();
    if (this.authStatus == 1) {
      this.initEnrollment();
    }
  }
  initEnrollment() {
    this.middlewareService.getBankDetails().subscribe((data: any) => {
      this.banksList = data.BankDetails;

      this.banksList.forEach(element => {
        // console.log(element.location)
        let currentBank: SelectItem = {};
        currentBank.label = element.location;
        currentBank.value = element;
        this.bankSelectorList.push(currentBank);

      });

    })
    console.log(this.bankSelectorList);
  }

  createAccount() {
    let lastAccountNumber = this.selectedBankDetails.lastAddedAcNo;
    this.middlewareService.createAccount({
      "branchCode": this.selectedBankDetails.branchCode,
      "accountNo": lastAccountNumber,
      "name": this.username,
      "balance": this.balance,
    }).then((res: any) => {
      console.log(res);
      this.selectedBankDetails.customerId = res.customerID;
      this.selectedBankDetails.isAccountComplete = false;
    })
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    console.log(webcamImage);
    this.middlewareService.detectFace(this.webcamImage.imageAsDataUrl.split(',')[1]).then((res: any) => {
      console.log(res)
      if (res.Status == 1) {
        this.validImage = true;
        this.validImageBaseString = this.webcamImage.imageAsDataUrl.split(',')[1];
        console.log(this.selectedBankDetails.customerId + "selected cust id")
        this.isDetecting = true;
        this.middlewareService.indexFace(this.selectedBankDetails.customerId, this.validImageBaseString).then((res: any) => {
          if (res.Status == 1) {
            this.isDetecting = false;
            this.selectedBankDetails.isAccountComplete = true;
          }
        })
      }
    })
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
  generateQrDetails(generateButton) {
    this.middlewareService.getQrDetails(this.selectedBankDetails.customerId).subscribe((res: any) => {
      if (res.accountNo) {
        this.hasGenerated = true;
      }
      this.middlewareService.generateQrCode(this.selectedBankDetails.customerId).subscribe(qr => {
        console.log(qr)
      })
      this.selectedBankDetails.accountNo = res.accountNo;
      this.selectedBankDetails.name = res.name;
    })
  }

}
