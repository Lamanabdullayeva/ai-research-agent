import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { AgentEvent } from '../../services/research.service';
import { EventDotClassPipe } from '../../pipes/event-dot-class.pipe';
import { EventLabelPipe } from '../../pipes/event-label.pipe';
import {
  LABEL_SECTION_ACTIVITY,
  LABEL_THINKING,
  LABEL_WRITING_REPORT,
  LABEL_SEARCHES_COMPLETED,
  LABEL_SEARCH_OF,
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
  maxSearches: InputSignal<number> = input.required<number>();

  // Array of step numbers [1, 2, 3] derived from maxSearches
  searchSteps: Signal<number[]> = computed(() =>
    Array.from({ length: this.maxSearches() }, (_, i) => i + 1)
  );

  showProgress: Signal<boolean> = computed(() =>
    this.isLoading() || this.toolCallCount() > 0
  );

  // While searching show "Thinking...", once all searches are done show "Writing report..."
  activityLabel: Signal<string> = computed(() =>
    this.toolCallCount() >= this.maxSearches() ? LABEL_WRITING_REPORT : LABEL_THINKING
  );

  protected readonly sectionTitle: string = LABEL_SECTION_ACTIVITY;
  protected readonly searchesCompleted: string = LABEL_SEARCHES_COMPLETED;
  protected readonly searchOf: string = LABEL_SEARCH_OF;
}
