/* eslint-disable @typescript-eslint/no-explicit-any */

interface ConnectionUpdateEvent {
  userId: string;
  status: string | null;
  direction: string | null;
  connectionId: string | null;
}

type ConnectionUpdateCallback = (event: ConnectionUpdateEvent) => void;

class ConnectionManager {
  private static instance: ConnectionManager;
  private callbacks: Map<string, ConnectionUpdateCallback[]> = new Map();

  private constructor() {}

  static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  // Subscribe to connection updates for a specific user
  subscribe(userId: string, callback: ConnectionUpdateCallback): () => void {
    if (!this.callbacks.has(userId)) {
      this.callbacks.set(userId, []);
    }
    
    const userCallbacks = this.callbacks.get(userId)!;
    userCallbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const userCallbacks = this.callbacks.get(userId);
      if (userCallbacks) {
        const index = userCallbacks.indexOf(callback);
        if (index > -1) {
          userCallbacks.splice(index, 1);
        }
      }
    };
  }

  // Notify all subscribers about a connection update
  notify(userId: string, event: ConnectionUpdateEvent): void {
    const userCallbacks = this.callbacks.get(userId);
    if (userCallbacks) {
      // Use setTimeout to ensure the update happens in the next tick
      setTimeout(() => {
        userCallbacks.forEach(callback => {
          try {
            callback(event);
          } catch (error) {
            console.error('Error in connection update callback:', error);
          }
        });
      }, 0);
    }
  }

  // Notify about connection deletion/removal
  notifyConnectionRemoved(userId1: string, userId2: string, connectionId: string): void {
    // Notify both users involved in the connection
    [userId1, userId2].forEach(userId => {
      const userCallbacks = this.callbacks.get(userId);
      if (userCallbacks) {
        setTimeout(() => {
          userCallbacks.forEach(callback => {
            try {
              callback({
                userId: userId === userId1 ? userId2 : userId1,
                status: null,
                direction: null,
                connectionId: null
              });
            } catch (error) {
              console.error('Error in connection removal callback:', error);
            }
          });
        }, 0);
      }
    });
  }

  // Clear all subscriptions (useful for cleanup)
  clear(): void {
    this.callbacks.clear();
  }
}

export const connectionManager = ConnectionManager.getInstance();