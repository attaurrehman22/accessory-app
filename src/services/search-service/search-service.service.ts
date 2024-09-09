import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchServiceService {
  private searchQuery = new BehaviorSubject<string>('');
  currentSearchQuery = this.searchQuery.asObservable();

  changeSearchQuery(query: string) {
    this.searchQuery.next(query);
  }
}
