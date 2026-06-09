import { Component, input, InputSignal } from '@angular/core';
import { AgentEvent } from '../../services/research.service';
import { EventDotClassPipe } from '../../pipes/event-dot-class.pipe';
import { EventLabelPipe } from '../../pipes/event-label.pipe';

@Component({
  selector: 'app-agent-activity',
  imports: [EventDotClassPipe, EventLabelPipe],
  templateUrl: './agent-activity.component.html',
  styleUrl: './agent-activity.component.scss'
})
export class AgentActivityComponent {
  events: InputSignal<AgentEvent[]> = input.required<AgentEvent[]>();
  isLoading: InputSignal<boolean> = input.required<boolean>();
  toolCallCount: InputSignal<number> = input.required<number>();
  showSearchStats: InputSignal<boolean> = input.required<boolean>();
}
