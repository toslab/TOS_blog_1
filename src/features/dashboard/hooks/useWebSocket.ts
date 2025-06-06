// features/dashboard/hooks/useWebSocket.ts

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { getAuthToken } from '@/lib/api/auth';
import { useAuth } from '../contexts/AuthContext';

interface WebSocketOptions {
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionDelay?: number;
  reconnectionAttempts?: number;
}

export function useWebSocket(namespace?: string, options?: WebSocketOptions) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const listenersRef = useRef<Map<string, Set<Function>>>(new Map());

  const connect = useCallback(() => {
    if (!user || socketRef.current?.connected) return;

    const token = getAuthToken();
    if (!token) return;

    const wsUrl = namespace 
      ? `${process.env.NEXT_PUBLIC_WS_URL}/${namespace}`
      : process.env.NEXT_PUBLIC_WS_URL!;

    socketRef.current = io(wsUrl, {
      auth: { token },
      transports: ['websocket'],
      ...options,
    });

    socketRef.current.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // 온라인 사용자 수 업데이트
    socketRef.current.on('users:count', (data) => {
      setOnlineUsers(data.count);
    });

    // 등록된 리스너들에게 이벤트 전달
    socketRef.current.onAny((event, ...args) => {
      const listeners = listenersRef.current.get(event);
      if (listeners) {
        listeners.forEach(listener => listener(...args));
      }
    });
  }, [user, namespace, options]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const subscribe = useCallback((event: string, handler: Function) => {
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set());
    }
    listenersRef.current.get(event)!.add(handler);

    // Cleanup function
    return () => {
      const listeners = listenersRef.current.get(event);
      if (listeners) {
        listeners.delete(handler);
        if (listeners.size === 0) {
          listenersRef.current.delete(event);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (user && options?.autoConnect !== false) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user, connect, disconnect, options?.autoConnect]);

  return {
    isConnected,
    onlineUsers,
    connect,
    disconnect,
    emit,
    subscribe,
    socket: socketRef.current,
  };
}