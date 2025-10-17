// Event emitter for toast notifications
type ToastEvent = {
  type: "error" | "success" | "warning" | "info";
  title?: string;
  message: string;
  duration?: number;
};

type ToastListener = (event: ToastEvent) => void;

class ToastEventEmitter {
  private listeners: ToastListener[] = [];

  // Subscribe to toast events
  on(listener: ToastListener): () => void {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Emit a toast event
  emit(event: ToastEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }

  // Helper methods for different toast types
  error(message: string, title?: string, duration?: number): void {
    this.emit({ type: "error", message, title, duration });
  }

  success(message: string, title?: string, duration?: number): void {
    this.emit({ type: "success", message, title, duration });
  }

  warning(message: string, title?: string, duration?: number): void {
    this.emit({ type: "warning", message, title, duration });
  }

  info(message: string, title?: string, duration?: number): void {
    this.emit({ type: "info", message, title, duration });
  }
}

// Export singleton instance
export const toastEventEmitter = new ToastEventEmitter();
