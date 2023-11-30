import { JwtAuthPayload } from "../../types";

export interface AuthUserPayload {
  ip: string;
  username?: string;
  password?: string;
}

export interface CreateUserPayload extends JwtAuthPayload {
  fullname?: string;
  username?: string;
  password?: string;
  dialCode?: string;
  phoneNumber?: string;
  city?: string;
  ap?: number;
  creditAmount?: number;
  transactionCode?: string;
  privileges?: string[];
  userType?: string;
  remark?: string;
}

export interface GetSubUsersPayload extends JwtAuthPayload {
  offset?: number;
  limit?: number;
}

export interface SecureAccountPayload extends JwtAuthPayload {
  oldPassword?: string;
  newPassword?: string;
  transactionCode?: string;
}

export interface ChangePasswordPayload extends JwtAuthPayload {
  ip: string;
  oldPassword?: string;
  newPassword?: string;
  transactionCode?: string;
}

export interface ActivityLogsPayload extends JwtAuthPayload {
  fromDate?: string;
  toDate?: string;
  offset?: number;
  limit?: number;
}

export interface CreditAmountPayload extends JwtAuthPayload {
  from?: number;
  to?: number;
  creditAmount?: number;
  remark?: string;
  transactionCode?: string;
}

export interface CreditTransactionsPayload extends JwtAuthPayload {
  filterUserId?: number;
  fromDate?: string;
  toDate?: string;
  offset?: number;
  limit?: number;
}

export interface UpdateExposurePayload {
  uid?: number;
  change?: number;
  prevChange?: number;
  ctx?: string;
}

export interface UpdateCreditPayload {
  uid?: number;
  from?: number;
  to?: number;
  change?: number;
  remark?: string;
  ctx?: string;
}

export interface GetHierarchyPayload {
  uid?: number;
}
