import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPanel } from './report-panel';

describe('ReportPanel', () => {
  let component: ReportPanel;
  let fixture: ComponentFixture<ReportPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
