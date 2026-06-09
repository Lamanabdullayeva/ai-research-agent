import { Pipe, PipeTransform } from '@angular/core';

const EVENT_DOT_CLASS_MAP: Record<string, string> = {
  status:      'status',
  tool_call:   'search',
  tool_result: 'result',
  error:       'error',
};

@Pipe({
  name: 'eventDotClass',
  standalone: true,
})
export class EventDotClassPipe implements PipeTransform {
  transform(eventType: string): string {
    return EVENT_DOT_CLASS_MAP[eventType] ?? 'status';
  }
}
