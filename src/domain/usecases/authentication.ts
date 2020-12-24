import { AccountModel } from "@/domain/models/account-model";

export type AuthenticationParams = {
  password: string;
  email: string;
};

export interface Authentication {
  auth(params: AuthenticationParams): Promise<AccountModel>;
}
