import { Component, computed, effect, input, InputSignal, OnDestroy, output, signal, Signal, WritableSignal } from '@angular/core';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import {
  LABEL_SECTION_REPORT,
  LABEL_REPORT_PLACEHOLDER,
  LABEL_BTN_COPY,
  LABEL_BTN_COPIED,
  LABEL_BTN_DOWNLOAD_PDF,
} from '../../constants/app.constants';

const CHARS_PER_TICK = 12;
const TICK_MS = 20;

@Component({
  selector: 'app-report-panel',
  imports: [MarkdownPipe],
  templateUrl: './report-panel.component.html',
  styleUrl: './report-panel.component.scss'
})
export class ReportPanelComponent implements OnDestroy {
  report: InputSignal<string | null> = input<string | null>(null);
  hasReport: InputSignal<boolean> = input.required<boolean>();
  copied: InputSignal<boolean> = input.required<boolean>();

  onCopy = output<void>();
  onDownloadPdf = output<void>();

  private displayedChars: WritableSignal<number> = signal(0);
  private typeInterval: ReturnType<typeof setInterval> | null = null;

  isTyping: Signal<boolean> = computed(() => {
    const report = this.report();
    if (!report) return false;
    return this.displayedChars() < report.length;
  });

  displayedText: Signal<string> = computed(() =>
    (this.report() ?? '').slice(0, this.displayedChars())
  );

  constructor() {
    effect(() => {
      const report = this.report();
      if (report) {
        this.startTypewriter(report);
      } else {
        this.stopTypewriter();
        this.displayedChars.set(0);
      }
    });
  }

  private startTypewriter(text: string): void {
    this.stopTypewriter();
    this.displayedChars.set(0);
    this.typeInterval = setInterval(() => {
      this.displayedChars.update(n => {
        const next = n + CHARS_PER_TICK;
        if (next >= text.length) {
          this.stopTypewriter();
          return text.length;
        }
        return next;
      });
    }, TICK_MS);
  }

  private stopTypewriter(): void {
    if (this.typeInterval) {
      clearInterval(this.typeInterval);
      this.typeInterval = null;
    }
  }

  ngOnDestroy(): void {
    this.stopTypewriter();
  }

  protected readonly sectionTitle: string = LABEL_SECTION_REPORT;
  protected readonly placeholder: string = LABEL_REPORT_PLACEHOLDER;
  protected readonly btnCopy: string = LABEL_BTN_COPY;
  protected readonly btnCopied: string = LABEL_BTN_COPIED;
  protected readonly btnDownload: string = LABEL_BTN_DOWNLOAD_PDF;
}
