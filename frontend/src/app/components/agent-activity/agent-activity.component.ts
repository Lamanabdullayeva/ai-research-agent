import { Component, input, InputSignal } from '@angular/core';
import { NgClass } from '@angular/common';
import { AgentEvent } from '../../services/research.service';
import { EventDotClassPipe } from '../../pipes/event-dot-class.pipe';
import { EventLabelPipe } from '../../pipes/event-label.pipe';
import {
  LABEL_SECTION_ACTIVITY,
  LABEL_THINKING,
  LABEL_SEARCHES_COMPLETED,
} from '../../constants/app.constants';

@Component({
  selector: 'app-agent-activity',
  imports: [NgClass, EventDotClassPipe, EventLabelPipe],
  templateUrl: './agent-activity.component.html',
  styleUrl: './agent-activity.component.scss'
})
export class AgentActivityComponent {
  events: InputSignal<AgentEvent[]> = input.required<AgentEvent[]>();
  isLoading: InputSignal<boolean> = input.required<boolean>();
  toolCallCount: InputSignal<number> = input.required<number>();
  showSearchStats: InputSignal<boolean> = input.required<boolean>();

  protected readonly sectionTitle: string = LABEL_SECTION_ACTIVITY;
  protected readonly thinkingLabel: string = LABEL_THINKING;
  protected readonly searchesCompleted: string = LABEL_SEARCHES_COMPLETED;
}
