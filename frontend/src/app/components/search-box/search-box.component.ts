import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  imports: [FormsModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss'
})
export class SearchBoxComponent {
  topic = input.required<string>();
  isLoading = input.required<boolean>();
  showClearButton = input.required<boolean>();

  topicChange = output<string>();
  onResearch = output<void>();
  onStop = output<void>();
  onClear = output<void>();
}
