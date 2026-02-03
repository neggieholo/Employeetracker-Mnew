import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";
import {
  MonitoringContextType,
  CleanNotification,
  CleanSocketUser,
} from "./Types/Socket";
import { CleanClockEvent } from "./Types/Employee";
import { fetchTodayClock } from "./services/api";

export const MonitoringContext = createContext<
  MonitoringContextType | undefined
>(undefined);

export default function MonitoringProvider({
  children,
}: {
  children: ReactNode;
}) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  // Auth States
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);

  // Data States
  const [onlineMembers, setOnlineMembers] = useState<CleanSocketUser[]>([]);
  const [notifications, setNotifications] = useState<CleanNotification[]>([]);
  const [clockEvents, setClockEvents] = useState<{
    in: CleanClockEvent[];
    out: CleanClockEvent[];
  }>({ in: [], out: [] });
  const badgeCount = notifications.length;

  const disconnectSocket = () => {
    if (socketRef.current) {
      console.log("🔌 Manually disconnecting socket...");
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  useEffect(() => {
    // Only connect if we have a valid session ID from login
    if (!sessionId) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const newSocket = io("http://10.35.61.113:3060", {
      path: "/api/socket.io", // 👈 MUST match the server path exactly
      transports: ["websocket"],
      autoConnect: true,
      extraHeaders: {
        cookie: `connect.sid=${sessionId}`,
      },
      auth: {
        push_token: pushToken,
      },
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("✅ Manager Connected via Session ID");
    });

    newSocket.on("onlineCheck", (users: CleanSocketUser[]) => {
      console.log("Online members update:", users);
      setOnlineMembers(users);
    });

    newSocket.on(
      "messages",
      (data: CleanNotification | CleanNotification[]) => {
        setNotifications((prev) => {
          const incoming = Array.isArray(data) ? data : [data];

          // Combine and remove duplicates based on the _id from your logs
          const combined = [...incoming, ...prev];
          return combined.filter(
            (v, i, a) => a.findIndex((t) => t._id === v._id) === i,
          );
        });
      },
    );

    newSocket.on("notification_deleted", (id: string) => {
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    });

    newSocket.on("all_notifications_deleted", () => setNotifications([]));

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("❌ Manager Disconnected");
    });

    socketRef.current = newSocket; // 2. Assign to ref instead of state

    return () => {
      newSocket.close();
      socketRef.current = null;
    };
  }, [sessionId, pushToken]);

  useEffect(() => {
  // Only start polling if we are connected/authenticated
  if (!sessionId) return;

  const performFetch = async () => {
    console.log("🔄 Background Polling: Fetching Clock Events...");
    const data = await fetchTodayClock();
    setClockEvents({
      in: data.clockedInEvents,
      out: data.clockedOutEvents,
    });
  };

  // Initial fetch
  performFetch();

  // Polling every 5 seconds
  const interval = setInterval(performFetch, 5000);

  return () => {
    console.log("🛑 Stopping Background Polling");
    clearInterval(interval);
  };
}, [sessionId]);

  const deleteNotification = (notificationId: string) => {
    socketRef.current?.emit("delete_notification", { notificationId });
  };

  const deleteAll = () => {
    socketRef.current?.emit("delete_all_notifications");
  };

  return (
    <MonitoringContext.Provider
      value={{
        onlineMembers,
        clockEvents,
        notifications,
        badgeCount,
        isConnected,
        userName,
        setUserName,
        sessionId,
        pushToken,
        setSessionId,
        setPushToken,
        deleteNotification,
        deleteAll,
        disconnectSocket,
      }}
    >
      {children}
    </MonitoringContext.Provider>
  );
}

export const useMonitoring = () => {
  const context = useContext(MonitoringContext);
  if (!context)
    throw new Error("useMonitoring must be used within MonitoringProvider");
  return context;
};
