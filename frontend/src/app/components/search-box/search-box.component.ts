import { Component, input, InputSignal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
}
