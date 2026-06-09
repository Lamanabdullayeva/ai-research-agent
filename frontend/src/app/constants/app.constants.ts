// Storage
export const HISTORY_KEY: string = 'research_history';
export const MAX_HISTORY_ITEMS: number = 10;

// API
export const API_URL: string = 'http://127.0.0.1:8000/research';

// Timeouts
export const RESEARCH_TIMEOUT_MS: number = 60000;
export const COPIED_RESET_MS: number = 2000;

// UI Labels — Header
export const LABEL_EYEBROW: string = 'AI Research Agent';
export const LABEL_HEADING: string = 'What do you want to explore today?';

// UI Labels — Search Box
export const LABEL_INPUT_PLACEHOLDER: string = 'Enter a topic to research...';
export const LABEL_BTN_RESEARCH: string = 'Research';
export const LABEL_BTN_STOP: string = 'Stop';
export const LABEL_BTN_CLEAR: string = 'Clear';

// UI Labels — Agent Activity
export const LABEL_SECTION_ACTIVITY: string = 'Agent Activity';
export const LABEL_THINKING: string = 'Thinking...';
export const LABEL_SEARCHES_COMPLETED: string = 'searches completed';

// UI Labels — Event messages
export const LABEL_EVENT_SEARCHING: string = 'Searching:';
export const LABEL_EVENT_RETRIEVED: string = 'Retrieved results for:';

// UI Labels — Report Panel
export const LABEL_SECTION_REPORT: string = 'Research Report';
export const LABEL_REPORT_PLACEHOLDER: string = 'Report will appear here once the agent finishes researching.';
export const LABEL_BTN_COPY: string = 'Copy Report';
export const LABEL_BTN_COPIED: string = 'Copied';
export const LABEL_BTN_DOWNLOAD_PDF: string = 'Download PDF';

// UI Labels — History
export const LABEL_SECTION_HISTORY: string = 'Recent Searches';
export const LABEL_HISTORY_EMPTY: string = 'No searches yet';
export const LABEL_BTN_CLEAR_HISTORY: string = 'Clear';
