import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private onlineStatus = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    // Listen for online/offline events
    const online$ = fromEvent(window, 'online').pipe(map(() => true));
    const offline$ = fromEvent(window, 'offline').pipe(map(() => false));

    // Merge online and offline observables
    merge(online$, offline$).subscribe(status => {
      this.onlineStatus.next(status);
    });
  }

  // Expose the current network status as an observable
  get isOnline$(): Observable<boolean> {
    return this.onlineStatus.asObservable();
  }
}