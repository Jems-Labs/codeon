import { useAuth } from '@clerk/clerk-react';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
const SocketContext = createContext<Socket | null>(null)

export const useSocket = () => useContext(SocketContext);


interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
    const { getToken } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
    let sock: Socket;

    const setupSocket = async () => {
      const token = await getToken();
      if (!token) return;

      sock = io('http://localhost:5001', {
        auth: {
          token,
        },
      });

      setSocket(sock);
    };

    setupSocket();

    return () => {
      if (sock) sock.disconnect();
    };
  }, [getToken]);


    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}