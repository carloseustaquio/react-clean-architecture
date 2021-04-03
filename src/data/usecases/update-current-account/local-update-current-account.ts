import { SetStorage } from "@/data/protocols/cache/set-storage";
import { UnexpectedError } from "@/domain/errors";
import { AccountModel } from "@/domain/models";
import { UpdateCurrentAccount } from "@/domain/usecases";

export class LocalUpdateCurrentAccount implements UpdateCurrentAccount {
  constructor(private readonly setStorage: SetStorage) {}
  async save(account: AccountModel): Promise<void> {
    if (!account || !account.accessToken || !account.name) {
      throw new UnexpectedError();
    }
    return this.setStorage.set("account", account);
  }
}
