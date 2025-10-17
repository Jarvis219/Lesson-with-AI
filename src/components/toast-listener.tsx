"use client";

import { useToast } from "@/hooks/use-toast";
import { toastEventEmitter } from "@/lib/toast-event-emitter";
import { useEffect } from "react";

export function ToastListener() {
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to toast events
    const unsubscribe = toastEventEmitter.on((event) => {
      const variant =
        event.type === "error"
          ? "destructive"
          : event.type === "success"
          ? "success"
          : event.type === "warning"
          ? "warning"
          : "info";

      toast({
        variant,
        title: event.title,
        description: event.message,
        duration: event.duration || 5000,
      });
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [toast]);

  return null;
}
