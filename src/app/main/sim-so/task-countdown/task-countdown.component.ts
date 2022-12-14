import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { clearInterval } from 'timers';

@Component({
  selector: 'app-task-countdown',
  templateUrl: './task-countdown.component.html',
  styleUrls: ['./task-countdown.component.scss']
})
export class TaskCountdownComponent implements AfterViewInit, OnInit, OnDestroy {
  
  date: any;
  now: any;
  @Input() endDate;
  targetDate: any ;
  targetTime: any;
  difference: number;

  interval: any;

  @ViewChild('days', { static: true }) days: ElementRef;
  @ViewChild('hours', { static: true }) hours: ElementRef;
  @ViewChild('minutes', { static: true }) minutes: ElementRef;
  @ViewChild('seconds', { static: true }) seconds: ElementRef;

  ngOnInit(): void {
    // this.targetDate = new Date(this.endDate);
    this.targetTime = Math.trunc(Date.parse(this.endDate) / 1000);
  }

  ngAfterViewInit() {
    this.interval = setInterval(() => {
      this.tickTock();
      this.difference = this.targetTime - this.now - 7*60*60;
      if(this.difference <=0) {
        this.difference = 0;        
      }
      // !isNaN(this.days.nativeElement.innerText)
      //   ? (this.days.nativeElement.innerText = Math.floor(this.difference))
      //   : (this.days.nativeElement.innerHTML = `<img src="https://i.gifer.com/VAyR.gif" />`);
    }, 1000);
  }

  tickTock() {
    // if(this.difference <=0) {
    //   this.difference = 0;
    //   clearInterval(this.interval);
    // }
    this.date = new Date();
    
    this.now = Math.trunc(this.date.getTime() / 1000) ;
    this.days.nativeElement.innerText = Math.trunc(this.difference / 60 / 60 / 24);
    this.hours.nativeElement.innerText = Math.trunc(this.difference / 60 / 60) % 24;
    this.minutes.nativeElement.innerText = Math.trunc(this.difference / 60) % 60;
    this.seconds.nativeElement.innerText = Math.trunc(this.difference) % 60;
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
