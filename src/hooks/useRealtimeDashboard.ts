import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { DashboardResponse } from '@/lib/api';

type DashboardUpdate = {
  type: 'full-update' | 'stats-update' | 'activity-update';
  data: Partial<DashboardResponse>;
  timestamp: string;
};

export const useRealtimeDashboard = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const queryClient = useQueryClient();

  useEffect(() => {
    // Get API base URL from environment or use current host
    const apiBase = import.meta.env.VITE_API_BASE_URL || `${window.location.protocol}//${window.location.hostname}:4000`;
    const wsUrl = apiBase.replace('http://', 'ws://').replace('https://', 'wss://');
    
    console.log('Connecting to WebSocket:', wsUrl);
    
    const newSocket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('dashboard-update', (update: DashboardUpdate) => {
      console.log('Real-time update received:', update.type);
      setLastUpdate(new Date().toLocaleTimeString());
      
      // Update React Query cache with new data
      queryClient.setQueryData(['dashboard'], (oldData: DashboardResponse | undefined) => {
        if (!oldData) {
          // If no old data, use the update data directly
          return update.data as DashboardResponse;
        }
        
        switch (update.type) {
          case 'full-update':
            return update.data as DashboardResponse;
          case 'stats-update':
            return { ...oldData, stats: update.data.stats || oldData.stats };
          case 'activity-update':
            return { ...oldData, recentActivity: update.data.recentActivity || oldData.recentActivity };
          default:
            return oldData;
        }
      });
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
      
      // Fallback: try to connect to localhost if current host fails
      if (!wsUrl.includes('localhost') && !wsUrl.includes('127.0.0.1')) {
        console.log('Trying fallback connection to localhost...');
        const fallbackSocket = io('ws://localhost:4000', {
          transports: ['websocket', 'polling'],
          timeout: 10000,
          forceNew: true
        });
        
        fallbackSocket.on('connect', () => {
          console.log('Fallback WebSocket connected');
          setIsConnected(true);
          setSocket(fallbackSocket);
        });
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [queryClient]);

  return {
    socket,
    isConnected,
    lastUpdate
  };
};
