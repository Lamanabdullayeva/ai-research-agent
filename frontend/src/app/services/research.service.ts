import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../constants/app.constants';

export interface AgentEvent {
  type: 'status' | 'tool_call' | 'tool_result' | 'final_report' | 'error';
  message?: string;
  tool?: string;
  query?: string;
  result_preview?: string;
  content?: string;
}

@Injectable({ providedIn: 'root' })
export class ResearchService {
  private readonly apiUrl: string = API_URL;

  research(topic: string, signal: AbortSignal): Observable<AgentEvent> {
    return new Observable(observer => {
      fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
        signal,
      }).then(response => {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        signal.addEventListener('abort', () => {
          reader.cancel();
          observer.complete();
        });

        const read = () => {
          reader.read().then(({ done, value }) => {
            if (done) { observer.complete(); return; }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') { observer.complete(); return; }
                try { observer.next(JSON.parse(data)); } catch {}
              }
            }
            read();
          }).catch(err => { if (err.name !== 'AbortError') observer.error(err); });
        };
        read();
      }).catch(err => { if (err.name !== 'AbortError') observer.error(err); });
    });
  }
}
