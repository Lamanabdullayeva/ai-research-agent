import { Component, input, InputSignal, output } from '@angular/core';

@Component({
  selector: 'app-report-panel',
  imports: [],
  templateUrl: './report-panel.component.html',
  styleUrl: './report-panel.component.scss'
})
export class ReportPanelComponent {
  report: InputSignal<string | null> = input<string | null>(null);
  hasReport: InputSignal<boolean> = input.required<boolean>();
  copied: InputSignal<boolean> = input.required<boolean>();

  onCopy = output<void>();
  onDownloadPdf = output<void>();
}
