import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
}
