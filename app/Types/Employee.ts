export interface EmployeeClockEvent {
  _id: string;
  adminId: string;
  managerId: string;
  workerId: string;
  name: string;
  department: string;
  status: "clocked in" | "clocked out";
  
  // Clock-in data
  clockInTime: string; // ISO string from backend
  clockInLocation: string;
  clockInComment?: string;

  // Clock-out data
  clockOutTime: string | null;
  clockOutLocation?: string;
  clockOutComment?: string;

  date: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Clean version for the UI (Optional but recommended)
export type CleanClockEvent = Omit<EmployeeClockEvent, "__v" | "adminId" | "managerId">;

export default interface NetworkError {
  message?: string;
  success?: boolean;
  response?: {
    data?: {
      message?: string;
      success?: boolean;
    };
  };
}