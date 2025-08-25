import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HoverStateService {

  private hoverState = new BehaviorSubject<boolean>(false);
  hoverState$ = this.hoverState.asObservable();

  setHoverState(state: boolean) {
    this.hoverState.next(state);
  }
}
