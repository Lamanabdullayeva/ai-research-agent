import { Component, input, output, InputSignal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HistoryItem } from '../../interfaces/history-item';
import {
  LABEL_SECTION_HISTORY,
  LABEL_BTN_CLEAR_HISTORY,
  LABEL_HISTORY_EMPTY,
} from '../../constants/app.constants';

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

  protected readonly sectionTitle: string = LABEL_SECTION_HISTORY;
  protected readonly btnClear: string = LABEL_BTN_CLEAR_HISTORY;
  protected readonly emptyLabel: string = LABEL_HISTORY_EMPTY;
}
