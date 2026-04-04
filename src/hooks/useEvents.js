import { useState, useEffect, useCallback } from "react";
import { eventsService } from "../services/eventsService";

/**
 * Hook para cargar eventos públicos.
 * El filtrado por categoría se hace en el componente (frontend filtering).
 */
export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventsService.getEvents();
      setEvents(data);
    } catch (err) {
      console.error("Error al cargar eventos:", err);
      setError("No se pudieron cargar los eventos. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}

/**
 * Hook para cargar TODOS los eventos (incluyendo borradores) para el panel admin.
 */
export function useAdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventsService.getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error("Error al cargar eventos:", err);
      setError("No se pudieron cargar los eventos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}

/**
 * Hook para cargar el evento destacado del home.
 * Usa el mismo evento marcado como promo_modal=true.
 */
export function useFeaturedEvent() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsService.getFeaturedEvent().then((data) => {

      setEvent(data);
      setLoading(false);
    });
  }, []);

  return { event, loading };
}
