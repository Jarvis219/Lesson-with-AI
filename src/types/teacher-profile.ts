export interface UpdateProfileRequest {
  name: string;
  teacherBio?: string;
}

export interface UpdateProfileResponse {
  name: string;
  teacherBio: string;
}

export interface UploadAvatarResponse {
  avatar: string;
}

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface ScheduleSlot {
  day: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface UpdateScheduleRequest {
  schedule: ScheduleSlot[];
  timezone?: string;
}

export interface GetScheduleResponse {
  schedule: ScheduleSlot[];
  timezone: string;
}

export interface UpdateScheduleResponse {
  message: string;
  schedule: ScheduleSlot[];
  timezone: string;
}

export interface PaymentMethod {
  _id?: string;
  bankName: string;
  accountHolderName: string;
  bankAccount: string;
  paymentMethod: string;
  isPrimary: boolean;
}

export interface GetPaymentMethodsResponse {
  paymentMethods: PaymentMethod[];
}

export interface AddPaymentMethodRequest {
  bankAccount: string;
  bankName: string;
  accountHolderName: string;
  paymentMethod: string;
}

export interface AddPaymentMethodResponse {
  message: string;
  paymentMethod: PaymentMethod;
}

export interface UpdatePaymentMethodRequest {
  paymentMethodId: string;
  bankAccount?: string;
  bankName?: string;
  accountHolderName?: string;
  paymentMethod?: string;
}

export interface UpdatePaymentMethodResponse {
  message: string;
  paymentMethod: PaymentMethod;
}

export interface SetPrimaryPaymentMethodRequest {
  paymentMethodId: string;
}

export interface SetPrimaryPaymentMethodResponse {
  message: string;
}

// Legacy interfaces for backward compatibility
export interface UpdatePaymentInfoRequest {
  bankAccount: string;
  bankName?: string;
  accountHolderName?: string;
  paymentMethod?: string;
}

export interface UpdatePaymentInfoResponse {
  message: string;
}
