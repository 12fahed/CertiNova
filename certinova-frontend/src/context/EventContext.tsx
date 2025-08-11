"use client";

import React, { createContext, useContext, useState } from 'react';
import { Event, EventRequest } from '@/types/event';
import { eventService } from '@/services/event';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface EventContextType {
  events: Event[];
  isLoading: boolean;
  createEvent: (eventData: Omit<EventRequest, 'organisationID' | 'organisation'>) => Promise<Event | null>;
  fetchEvents: () => Promise<void>;
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

interface EventProviderProps {
  children: React.ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const createEvent = async (eventData: Omit<EventRequest, 'organisationID' | 'organisation'>): Promise<Event | null> => {
    if (!user) {
      toast.error('You must be logged in to create events');
      return null;
    }

    try {
      setIsLoading(true);
      const response = await eventService.createEvent({
        ...eventData,
        organisationID: user.id,
        organisation: user.organisation,
      });

      if (response.success && response.data?.event) {
        const newEvent = response.data.event;
        setEvents(prev => [newEvent, ...prev]);
        toast.success('Event created successfully!');
        return newEvent;
      } else {
        const errorMessage = response.errors ? response.errors.join(', ') : response.message;
        toast.error(errorMessage || 'Failed to create event');
        return null;
      }
    } catch (error: unknown) {
      console.error('Create event error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create event';
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async (): Promise<void> => {
    if (!user) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await eventService.getEventsByOrganisation(user.id);

      if (response.success && response.data?.events) {
        setEvents(response.data.events);
      } else {
        console.error('Failed to fetch events:', response.message);
        toast.error('Failed to load events');
      }
    } catch (error: unknown) {
      console.error('Fetch events error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load events';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshEvents = async (): Promise<void> => {
    await fetchEvents();
  };

  const value: EventContextType = {
    events,
    isLoading,
    createEvent,
    fetchEvents,
    refreshEvents,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};
