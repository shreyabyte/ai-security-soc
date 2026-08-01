import { API_BASE_URL } from './config';

export interface AISummary {
  current_focus: string;
  risk_score: number;
  risk_label: string;
  recommended_actions: string[];
  related_alert_id: number | null;
}

export const aiClient = {
  getSummary: async (): Promise<AISummary> => {
    const res = await fetch(`${API_BASE_URL}/ai/summary`);
    if (!res.ok) throw new Error('Failed to fetch AI summary');
    return res.json();
  },
  ask: async (question: string): Promise<string> => {
    const res = await fetch(`${API_BASE_URL}/ai/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error('Failed to reach AI analyst');
    const data = await res.json();
    return data.answer as string;
  },
};
