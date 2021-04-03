import { UnexpectedError } from "@/domain/errors";
import { mockAccountModel } from "@/domain/test"
import { LocalStorageAdapter } from "@/infra/cache/local-storage-adapter";
import {getCurrentAccountAdapter, setCurrentAccountAdapter} from "@/main/adapters/current-account-adapter";

jest.mock("@/infra/cache/local-storage-adapter")

describe('CurrentAccountAdapter', () => {
  test('should call LocalStorageAdapter.set adapter with correct values', () => {
    const accountModel = mockAccountModel();
    const setSpy = jest.spyOn(LocalStorageAdapter.prototype, 'set');
    setCurrentAccountAdapter(accountModel)
    expect(setSpy).toHaveBeenCalledWith('account', accountModel);
  })

  test('should throw UnexpectedError', () => {
    expect(() => {
    setCurrentAccountAdapter(undefined)
    }).toThrow(new UnexpectedError())
  })

  test('should call LocalStorageAdapter.get adapter with correct values', () => {
    const account = mockAccountModel()
    const getSpy = jest.spyOn(LocalStorageAdapter.prototype, 'get').mockReturnValueOnce(account)
    const result = getCurrentAccountAdapter()
    expect(getSpy).toHaveBeenCalledWith('account');
    expect(result).toEqual(account);
  })
})
