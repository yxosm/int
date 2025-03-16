// Simple analytics wrapper that can be expanded later to use any analytics provider
// (Google Analytics, Mixpanel, Plausible, etc.)

type EventOptions = {
  [key: string]: any;
}

class Analytics {
  private static instance: Analytics;
  
  private constructor() {
    // Initialize analytics here if needed
  }

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  public trackPageView(url: string): void {
    if (typeof window === 'undefined') return;

    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Analytics [Page View]: ${url}`);
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  public trackEvent(eventName: string, options: EventOptions = {}): void {
    if (typeof window === 'undefined') return;

    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Analytics [Event]: ${eventName}`, options);
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  public trackServiceInspection(serviceType: string, expertFindings: string[]): void {
    this.trackEvent('expert_inspection', { serviceType, expertFindings });
  }

  public trackRepairEstimate(serviceType: string, repairDetails: string): void {
    this.trackEvent('repair_estimate', { serviceType, repairDetails });
  }

  public trackQualityAssurance(serviceType: string, qualityChecks: string[]): void {
    this.trackEvent('quality_assurance', { serviceType, qualityChecks });
  }

  public trackAppointmentStatusChanged(appointmentId: string, newStatus: string): void {
    this.trackEvent('appointment_status_changed', { appointmentId, newStatus });
  }

  public trackServiceRequest(serviceType: string, vehicleDetails: string): void {
    this.trackEvent('service_requested', { serviceType, vehicleDetails });
  }

  public trackAuthentication(method: 'signin' | 'signup' | 'signout'): void {
    this.trackEvent('auth', { method });
  }
}

export default Analytics.getInstance();