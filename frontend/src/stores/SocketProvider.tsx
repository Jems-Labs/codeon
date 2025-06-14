import { useAuth, useUser } from '@clerk/clerk-react';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
const SocketContext = createContext<Socket | null>(null)

export const useSocket = () => useContext(SocketContext);


interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { getToken } = useAuth();
  const {user} = useUser();

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
      sock.on("connect", ()=>{
         if (user?.id) {
        sock.emit("reconnect-user", user.id);
      }
      })
      setSocket(sock);
    };

    setupSocket();

    return () => {
      if (sock) sock.disconnect();
    };
  }, [getToken, user?.id]);


  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}