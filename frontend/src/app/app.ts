import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ResearchService, AgentEvent } from './research.service';
import jsPDF from 'jspdf';

export interface HistoryItem {
  topic: string;
  report: string;
  date: string;
}

const HISTORY_KEY = 'research_history';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private researchService = inject(ResearchService);

  topic = signal('');
  isLoading = signal(false);
  events = signal<AgentEvent[]>([]);
  finalReport = signal<string | null>(null);
  copied = signal(false);
  history = signal<HistoryItem[]>([]);
  private abortController: AbortController | null = null;
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  toolCallCount = computed(() =>
    this.events().filter(e => e.type === 'tool_call').length
  );

  ngOnInit() {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) this.history.set(JSON.parse(saved));
  }

  stopResearch() {
    if (this.searchTimeout) { clearTimeout(this.searchTimeout); this.searchTimeout = null; }
    this.abortController?.abort();
    this.abortController = null;
    this.isLoading.set(false);
  }

  startResearch() {
    if (!this.topic().trim()) return;

    // Cancel any ongoing request first
    this.stopResearch();

    this.abortController = new AbortController();
    this.isLoading.set(true);
    this.events.set([]);
    this.finalReport.set(null);
    this.copied.set(false);

    // Auto-stop after 60 seconds
    this.searchTimeout = setTimeout(() => this.stopResearch(), 60000);

    this.researchService.research(this.topic(), this.abortController.signal).subscribe({
      next: (event) => {
        if (event.type === 'final_report') {
          this.finalReport.set(event.content || '');
          this.saveToHistory(this.topic(), event.content || '');
        } else {
          this.events.update(prev => [...prev, event]);
        }
      },
      error: (err) => {
        if (err?.name !== 'AbortError') console.error(err);
        this.stopResearch();
      },
      complete: () => {
        this.stopResearch();
      }
    });
  }

  clearAll() {
    this.topic.set('');
    this.events.set([]);
    this.finalReport.set(null);
    this.copied.set(false);
  }

  clearHistory() {
    this.history.set([]);
    localStorage.removeItem(HISTORY_KEY);
  }

  saveToHistory(topic: string, report: string) {
    const item: HistoryItem = {
      topic,
      report,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    const updated = [item, ...this.history()].slice(0, 10);
    this.history.set(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  }

  loadFromHistory(item: HistoryItem) {
    this.topic.set(item.topic);
    this.finalReport.set(item.report);
    this.events.set([]);
  }

  copyReport() {
    const report = this.finalReport();
    if (!report) return;
    navigator.clipboard.writeText(report).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  downloadPDF() {
    const report = this.finalReport();
    const topic = this.topic();
    if (!report) return;

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(topic, margin, 30);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 38);

    doc.setTextColor(0);
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(report, maxWidth);
    doc.text(lines, margin, 50);

    doc.save(`${topic.replace(/\s+/g, '_')}_research.pdf`);
  }
}
