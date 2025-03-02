import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarClickSubject = new Subject<void>();
  sidebarClick$ = this.sidebarClickSubject.asObservable();

  emitSidebarClick() {
    this.sidebarClickSubject.next();
  }

  constructor() { }
}
