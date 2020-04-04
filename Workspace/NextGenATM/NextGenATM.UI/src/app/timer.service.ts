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
  /**
   * Starts the timer with the given timeout
   * @param timeout the required time in microseconds
   */
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
  /**
   * Stops the timer
   */
  clearTimer() {
    this.isRunning = false;
    clearTimeout(this.stopwatch);
  }
  /**
   * Start the timer with given timeout or default timeout
   * @param timeout optional the time in microseconds
   */
  resetTimer(timeout = this.timeout) {
    this.clearTimer();
    this.startTimer(timeout);
  }
  /**
   * Returns the instance of the timer
   */
  getTimer() {
    return this.timerSubject
  }
}
