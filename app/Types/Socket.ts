// types/socket.ts
import { View, Text } from 'react-native'
import React from 'react'

export interface SocketUser {
  _id: string;
  role: "admin" | "manager" | "employee";
  adminId: string | null;
  managerId: string | null;
  firstName: string;
  lastName: string;
  // include other fields from socket.request.user if needed
}

export interface AppNotification {
  _id?: string; // from Notification.create / .toObject()
  sender: string; // e.g., "John Doe"
  message: string;
  date: number; // Date.now()
  timestamp: string | Date; // new Date()
  adminId: string | null;
  managerId: string | null;
}

export interface MonitoringContextType {
  onlineMembers: SocketUser[];
  clockedOutMembers: AppNotification[];
  notifications: AppNotification[];
  isConnected: boolean;
  userName: string | null;
  setUserName: (name: string | null) => void;
  sessionId: string | null;
  pushToken: string | null;
  setSessionId: (id: string | null) => void;
  setPushToken: (token: string | null) => void;
  deleteNotification: (id: string) => void;
  deleteAll: () => void;
}

