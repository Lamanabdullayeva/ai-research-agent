import { Component, input } from '@angular/core';
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
  events = input.required<AgentEvent[]>();
  isLoading = input.required<boolean>();
  toolCallCount = input.required<number>();
  showSearchStats = input.required<boolean>();
}
