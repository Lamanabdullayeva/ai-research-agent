import { Component, input, output, InputSignal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HistoryItem } from '../../interfaces/history-item';

@Component({
  selector: 'app-search-history',
  imports: [DatePipe],
  templateUrl: './search-history.component.html',
  styleUrl: './search-history.component.scss'
})
export class SearchHistoryComponent {
  history: InputSignal<HistoryItem[]> = input.required<HistoryItem[]>();
  hasHistory: InputSignal<boolean> = input.required<boolean>();

  onSelect = output<HistoryItem>();
  onClear = output<void>();
}
