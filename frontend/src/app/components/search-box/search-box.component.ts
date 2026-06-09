import { Component, input, InputSignal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LABEL_INPUT_PLACEHOLDER,
  LABEL_BTN_RESEARCH,
  LABEL_BTN_STOP,
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

  protected readonly placeholder: string = LABEL_INPUT_PLACEHOLDER;
  protected readonly btnResearch: string = LABEL_BTN_RESEARCH;
  protected readonly btnStop: string = LABEL_BTN_STOP;
}
