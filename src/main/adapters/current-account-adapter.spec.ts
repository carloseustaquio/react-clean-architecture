import { mockAccountModel } from "@/domain/test"
import { LocalStorageAdapter } from "@/infra/cache/local-storage-adapter";
import {setCurrentAccountAdapter} from "@/main/adapters/current-account-adapter";

jest.mock("@/infra/cache/local-storage-adapter")

describe('CurrentAccountAdapter', () => {
  test('should call LocalStorageAdapter adapter with correct values', () => {
    const accountModel = mockAccountModel();
    const setSpy = jest.spyOn(LocalStorageAdapter.prototype, 'set');
    setCurrentAccountAdapter(accountModel)
    expect(setSpy).toHaveBeenCalledWith('account', accountModel);
  })
})
