import { useState, useEffect, useRef, useCallback } from "react";
import { eventsService } from "../services/eventsService";

const PROMO_DELAY_MS = 1500;

/**
 * Calcula el tiempo restante hasta una fecha objetivo.
 * @param {string} targetIso - Fecha ISO string
 * @returns {{ days, hours, minutes, seconds, isUrgent, isExpired }}
 */
function calcCountdown(targetIso) {
  const diff = new Date(targetIso) - new Date();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isUrgent: false, isExpired: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const isUrgent = diff < 24 * 60 * 60 * 1000; // menos de 24h

  return { days, hours, minutes, seconds, isUrgent, isExpired: false };
}

/** Clave de localStorage por id de evento */
const dismissKey = (id) => `promo-dismissed-${id}`;

/**
 * Hook que encapsula toda la lógica del modal promocional.
 * Retorna: { isOpen, event, isLoading, countdown, close, openRegister }
 */
export function usePromoModal() {
  const [event, setEvent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  // 1. Fetch del evento promo al montar
  useEffect(() => {
    let cancelled = false;

    const fetchPromo = async () => {
      try {
        const data = await eventsService.getPromoEvent();
        if (cancelled) return;

        if (!data) {
          setIsLoading(false);
          return;
        }

        // 2. Verificar localStorage
        const dismissed = localStorage.getItem(dismissKey(data.id));
        if (dismissed) {
          setIsLoading(false);
          return;
        }

        setEvent(data);
        setIsLoading(false);

        // 3. Abrir modal después de 1.5s
        timerRef.current = setTimeout(() => {
          if (!cancelled) setIsOpen(true);
        }, PROMO_DELAY_MS);
      } catch {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchPromo();

    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
    };
  }, []);

  // 4. Countdown en tiempo real mientras el modal está abierto
  useEffect(() => {
    if (!isOpen || !event?.starts_at) return;

    const tick = () => setCountdown(calcCountdown(event.starts_at));
    tick(); // ejecutar inmediatamente
    intervalRef.current = setInterval(tick, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isOpen, event]);

  const close = useCallback(() => {
    if (event) {
      localStorage.setItem(dismissKey(event.id), "true");
    }
    setIsOpen(false);
    clearInterval(intervalRef.current);
  }, [event]);

  const openRegister = useCallback(() => {
    setIsOpen(false);
    clearInterval(intervalRef.current);
    setRegisterOpen(true);
  }, []);

  const closeRegister = useCallback(() => {
    setRegisterOpen(false);
  }, []);

  return {
    isOpen,
    event,
    isLoading,
    countdown,
    close,
    openRegister,
    registerOpen,
    closeRegister,
  };
}
