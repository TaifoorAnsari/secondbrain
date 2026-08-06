import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineDetailComponent } from './timeline-detail.component';

describe('TimelineDetailComponent', () => {
  let component: TimelineDetailComponent;
  let fixture: ComponentFixture<TimelineDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
