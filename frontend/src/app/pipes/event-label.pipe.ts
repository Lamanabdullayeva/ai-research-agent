import { Pipe, PipeTransform } from '@angular/core';
import { AgentEvent } from '../services/research.service';

@Pipe({
  name: 'eventLabel',
  standalone: true,
})
export class EventLabelPipe implements PipeTransform {
  transform(event: AgentEvent): string {
    switch (event.type) {
      case 'status':      return event.message ?? '';
      case 'tool_call':   return `Searching: ${event.query}`;
      case 'tool_result': return `Retrieved results for: ${event.query}`;
      case 'error':       return event.message ?? 'An error occurred';
      default:            return '';
    }
  }
}
