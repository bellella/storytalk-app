type Listener = () => void;

const listeners: Set<Listener> = new Set();

export const authEvents = {
  onLogout(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  emitLogout() {
    listeners.forEach((fn) => fn());
  },
};
