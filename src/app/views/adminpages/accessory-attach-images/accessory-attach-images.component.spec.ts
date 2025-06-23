import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryAttachImagesComponent } from './accessory-attach-images.component';

describe('AccessoryAttachImagesComponent', () => {
  let component: AccessoryAttachImagesComponent;
  let fixture: ComponentFixture<AccessoryAttachImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessoryAttachImagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessoryAttachImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
