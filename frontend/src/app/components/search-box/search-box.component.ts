import { Component, computed, input, InputSignal, output, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LABEL_INPUT_PLACEHOLDER,
  LABEL_BTN_RESEARCH,
  LABEL_BTN_STOP,
  LABEL_TRY,
  SUGGESTED_TOPICS,
} from '../../constants/app.constants';

@Component({
  selector: 'app-search-box',
  imports: [FormsModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss'
})
export class SearchBoxComponent {
  topic: InputSignal<string> = input.required<string>();
  isLoading: InputSignal<boolean> = input.required<boolean>();
  showClearButton: InputSignal<boolean> = input.required<boolean>();

  topicChange = output<string>();
  onResearch = output<void>();
  onStop = output<void>();
  onClear = output<void>();

  // Show example topic chips only before the first search
  showSuggestions: Signal<boolean> = computed(() =>
    !this.topic().trim() && !this.isLoading() && !this.showClearButton()
  );

  selectSuggestion(suggestion: string): void {
    this.topicChange.emit(suggestion);
    this.onResearch.emit();
  }

  protected readonly placeholder: string = LABEL_INPUT_PLACEHOLDER;
  protected readonly btnResearch: string = LABEL_BTN_RESEARCH;
  protected readonly btnStop: string = LABEL_BTN_STOP;
  protected readonly tryLabel: string = LABEL_TRY;
  protected readonly suggestions: string[] = SUGGESTED_TOPICS;
}
