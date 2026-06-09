import { Pipe, PipeTransform } from '@angular/core';
import { AgentEvent } from '../services/research.service';
import {
  LABEL_EVENT_SEARCHING,
  LABEL_EVENT_RETRIEVED,
} from '../constants/app.constants';

@Pipe({
  name: 'eventLabel',
  standalone: true,
})
export class EventLabelPipe implements PipeTransform {
  transform(event: AgentEvent): string {
    switch (event.type) {
      case 'status':      return event.message ?? '';
      case 'tool_call':   return `${LABEL_EVENT_SEARCHING} ${event.query}`;
      case 'tool_result': return `${LABEL_EVENT_RETRIEVED} ${event.query}`;
      case 'error':       return event.message ?? 'An error occurred';
      default:            return '';
    }
  }
}
