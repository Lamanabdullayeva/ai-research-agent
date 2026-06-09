import { Component, input, InputSignal, output } from '@angular/core';
import {
  LABEL_SECTION_REPORT,
  LABEL_REPORT_PLACEHOLDER,
  LABEL_BTN_COPY,
  LABEL_BTN_COPIED,
  LABEL_BTN_DOWNLOAD_PDF,
} from '../../constants/app.constants';

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

  protected readonly sectionTitle: string = LABEL_SECTION_REPORT;
  protected readonly placeholder: string = LABEL_REPORT_PLACEHOLDER;
  protected readonly btnCopy: string = LABEL_BTN_COPY;
  protected readonly btnCopied: string = LABEL_BTN_COPIED;
  protected readonly btnDownload: string = LABEL_BTN_DOWNLOAD_PDF;
}
