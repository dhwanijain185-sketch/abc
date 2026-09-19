import { N8NRequestPayload, N8NResponsePayload } from '../types';

export interface N8NCallResult {
  success: boolean;
  data?: N8NResponsePayload;
  error?: string;
  source: 'live_n8n' | 'fallback_simulated';
}

export async function sendCustomerRequestToN8N(
  payload: N8NRequestPayload,
  customWebhookUrl?: string
): Promise<N8NCallResult> {
  const webhookUrl =
    customWebhookUrl ||
    process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
    'https://n8n.example.com/webhook/resolveai/customer-request';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `n8n Webhook returned HTTP ${response.status}: ${response.statusText}`,
        source: 'live_n8n',
      };
    }

    const data: N8NResponsePayload = await response.json();

    // Validate expected contract
    if (!data.request_id || !data.status) {
      return {
        success: false,
        error: 'n8n response is missing required contract fields (request_id or status).',
        source: 'live_n8n',
      };
    }

    return {
      success: true,
      data,
      source: 'live_n8n',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown network failure';
    return {
      success: false,
      error: errorMsg,
      source: 'live_n8n',
    };
  }
}
