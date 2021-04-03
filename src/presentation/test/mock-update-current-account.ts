import { AccountModel } from "@/domain/models";
import { UpdateCurrentAccount } from "@/domain/usecases";

export class UpdateCurrentAccountMock implements UpdateCurrentAccount {
  account: AccountModel;

  save(account: AccountModel): Promise<void> {
    this.account = account;
    return;
  }
}
