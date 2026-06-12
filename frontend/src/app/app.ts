import { Component, Signal, WritableSignal, signal, computed, inject, OnInit } from '@angular/core';
import { AgentEvent, ResearchService } from './services/research.service';
import { HistoryItem } from './interfaces/history-item';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { AgentActivityComponent } from './components/agent-activity/agent-activity.component';
import { ReportPanelComponent } from './components/report-panel/report-panel.component';
import { SearchHistoryComponent } from './components/search-history/search-history.component';
import jsPDF from 'jspdf';
import {
  HISTORY_KEY,
  MAX_HISTORY_ITEMS,
  MAX_SEARCHES,
  RESEARCH_TIMEOUT_MS,
  COPIED_RESET_MS,
  LABEL_EYEBROW,
  LABEL_HEADING,
} from './constants/app.constants';

@Component({
  selector: 'app-root',
  imports: [SearchBoxComponent, AgentActivityComponent, ReportPanelComponent, SearchHistoryComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private researchService: ResearchService = inject(ResearchService);

  topic: WritableSignal<string> = signal('');
  isLoading: WritableSignal<boolean> = signal(false);
  events: WritableSignal<AgentEvent[]> = signal<AgentEvent[]>([]);
  finalReport: WritableSignal<string | null> = signal<string | null>(null);
  copied: WritableSignal<boolean> = signal(false);
  history: WritableSignal<HistoryItem[]> = signal<HistoryItem[]>([]);

  private abortController: AbortController | null = null;
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  protected readonly eyebrow: string = LABEL_EYEBROW;
  protected readonly heading: string = LABEL_HEADING;
  protected readonly maxSearches: number = MAX_SEARCHES;

  // Derived state — all conditional logic lives here, not in the template
  toolCallCount: Signal<number> = computed(() =>
    this.events().filter((e: AgentEvent) => e.type === 'tool_call').length
  );

  showClearButton: Signal<boolean> = computed(() =>
    !!(this.topic() || this.events().length > 0 || this.finalReport())
  );

  showAgentActivity: Signal<boolean> = computed(() =>
    this.events().length > 0 || this.isLoading()
  );

  showSearchStats: Signal<boolean> = computed(() =>
    this.toolCallCount() > 0 && !this.isLoading()
  );

  isWritingReport: Signal<boolean> = computed(() =>
    this.isLoading() && this.toolCallCount() >= MAX_SEARCHES && !this.finalReport()
  );

  hasReport: Signal<boolean> = computed(() => !!this.finalReport());

  hasHistory: Signal<boolean> = computed(() => this.history().length > 0);

  ngOnInit(): void {
    const saved: string | null = localStorage.getItem(HISTORY_KEY);
    if (saved) this.history.set(JSON.parse(saved) as HistoryItem[]);
  }

  stopResearch(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }
    this.abortController?.abort();
    this.abortController = null;
    this.isLoading.set(false);
  }

  startResearch(): void {
    if (!this.topic().trim()) return;

    this.stopResearch();

    this.abortController = new AbortController();
    this.isLoading.set(true);
    this.events.set([]);
    this.finalReport.set(null);
    this.copied.set(false);

    this.searchTimeout = setTimeout(() => this.stopResearch(), RESEARCH_TIMEOUT_MS);

    this.researchService.research(this.topic(), this.abortController.signal).subscribe({
      next: (event: AgentEvent) => {
        if (event.type === 'final_report') {
          this.finalReport.set(event.content ?? '');
          this.saveToHistory(this.topic(), event.content ?? '');
        } else if (event.type === 'error') {
          this.events.update((prev: AgentEvent[]) => [...prev, event]);
          this.stopResearch();
        } else {
          this.events.update((prev: AgentEvent[]) => [...prev, event]);
        }
      },
      error: (err: Error) => {
        if (err?.name !== 'AbortError') console.error(err);
        this.stopResearch();
      },
      complete: () => {
        this.stopResearch();
      }
    });
  }

  clearAll(): void {
    this.topic.set('');
    this.events.set([]);
    this.finalReport.set(null);
    this.copied.set(false);
  }

  clearHistory(): void {
    this.history.set([]);
    localStorage.removeItem(HISTORY_KEY);
  }

  saveToHistory(topic: string, report: string): void {
    const item: HistoryItem = {
      topic,
      report,
      date: new Date().toISOString(),
    };
    const updated: HistoryItem[] = [item, ...this.history()].slice(0, MAX_HISTORY_ITEMS);
    this.history.set(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  }

  loadFromHistory(item: HistoryItem): void {
    this.topic.set(item.topic);
    this.finalReport.set(item.report);
    this.events.set([]);
  }

  copyReport(): void {
    const report: string | null = this.finalReport();
    if (!report) return;
    navigator.clipboard.writeText(report).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), COPIED_RESET_MS);
    });
  }

  downloadPDF(): void {
    const report: string | null = this.finalReport();
    const topic: string = this.topic();
    if (!report) return;

    const doc: jsPDF = new jsPDF({ unit: 'mm', format: 'a4' });
    const margin: number = 20;
    const pageWidth: number = doc.internal.pageSize.getWidth();
    const maxWidth: number = pageWidth - margin * 2;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(topic, margin, 30);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 38);

    doc.setTextColor(0);
    doc.setFontSize(11);

    const lines: string[] = doc.splitTextToSize(report, maxWidth);
    doc.text(lines, margin, 50);

    doc.save(`${topic.replace(/\s+/g, '_')}_research.pdf`);
  }
}
