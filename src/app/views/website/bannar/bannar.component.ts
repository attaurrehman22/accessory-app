import { Component } from '@angular/core';

@Component({
  selector: 'app-bannar',
  templateUrl: './bannar.component.html',
  styleUrl: './bannar.component.css'
})
export class BannarComponent {
  slides: any[] = [
    {
      url: '/assets/images/tmp_5fad8a47-bd02-442b-b320-7e2885b192ac.png',
      title: 'First slide',
      description: '',
    },
    {
      url: '/assets/images/tmp_8c6e48b4-4a2d-4f46-9b3d-fac5e862ada0.png',
      title: 'Second slide',
      description: '',
    },
    {
      url: '/assets/images/tmp_64af04ac-32fa-461f-9868-f5410d168835.png',
      title: 'Third slide',
      description: '',
    }
  ];
}
