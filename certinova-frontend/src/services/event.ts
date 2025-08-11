import { EventRequest, EventResponse, EventsListResponse } from '@/types/event';

const API_BASE_URL = 'http://localhost:5000/api';

class EventService {
  private async makeRequest(endpoint: string, options: RequestInit): Promise<unknown> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async createEvent(eventData: EventRequest): Promise<EventResponse> {
    return this.makeRequest('/events/addEvent', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }) as Promise<EventResponse>;
  }

  async getEventsByOrganisation(organisationID: string): Promise<EventsListResponse> {
    return this.makeRequest(`/events/${organisationID}`, {
      method: 'GET',
    }) as Promise<EventsListResponse>;
  }
}

export const eventService = new EventService();
