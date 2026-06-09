import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-report-panel',
  imports: [],
  templateUrl: './report-panel.component.html',
  styleUrl: './report-panel.component.scss'
})
export class ReportPanelComponent {
  report = input<string | null>(null);
  hasReport = input.required<boolean>();
  copied = input.required<boolean>();

  onCopy = output<void>();
  onDownloadPdf = output<void>();
}
