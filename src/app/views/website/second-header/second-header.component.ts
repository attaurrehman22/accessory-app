import { Component } from '@angular/core';
import { SearchServiceService } from 'src/services/search-service/search-service.service';

@Component({
  selector: 'app-second-header',
  templateUrl: './second-header.component.html',
  styleUrls: ['./second-header.component.css']
})
export class SecondHeaderComponent {
  searchQuery: string = '';

  constructor(private searchService: SearchServiceService) {}

  onSearch(query: string) {
    this.searchService.changeSearchQuery(query);
  }

  onSearchChange() {
    this.onSearch(this.searchQuery);
  }
}
