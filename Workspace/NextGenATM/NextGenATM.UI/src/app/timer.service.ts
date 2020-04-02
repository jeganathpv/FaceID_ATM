import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  timerSubject = new Subject<boolean>();
  stopwatch;
  timeout;
  isRunning: boolean;
  constructor() { }

  startTimer(timeout) {
    if (this.isRunning) {
      this.clearTimer();
    }
    else {
      this.isRunning = true;
      this.timeout = timeout;
      this.stopwatch = setTimeout(() => this.timerSubject.next(true), timeout)
    }
  }

  clearTimer() {
    this.isRunning = false;
    clearTimeout(this.stopwatch);
  }

  resetTimer(timeout = this.timeout) {
    this.clearTimer();
    this.startTimer(timeout);
  }

  getTimer() {
    return this.timerSubject
  }
}
