
interface EventPayload {
  [key: string]: any;
}

/**
 * A mock analytics service to demonstrate event tracking.
 * In a real application, this would integrate with a service like
 * Google Analytics, Amplitude, Mixpanel, etc.
 */
class AnalyticsService {
  track(eventName: string, payload?: EventPayload): void {
    console.log('[ANALYTICS EVENT]', eventName, payload || '');
    // In a real app, you would send this to your analytics backend.
    // e.g., thirdPartyAnalytics.track(eventName, payload);
  }
}

export const analytics = new AnalyticsService();
