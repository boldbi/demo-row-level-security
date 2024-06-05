import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebdatasourceComponent } from './webdatasource.component';

describe('WebdatasourceComponent', () => {
  let component: WebdatasourceComponent;
  let fixture: ComponentFixture<WebdatasourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebdatasourceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WebdatasourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
