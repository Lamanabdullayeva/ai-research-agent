import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentActivity } from './agent-activity';

describe('AgentActivity', () => {
  let component: AgentActivity;
  let fixture: ComponentFixture<AgentActivity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentActivity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentActivity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
