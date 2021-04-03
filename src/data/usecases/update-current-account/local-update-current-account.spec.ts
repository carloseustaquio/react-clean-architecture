import { SetStorageSpy } from "@/data/test";
import { LocalUpdateCurrentAccount } from "./local-update-current-account";
import { UnexpectedError } from "@/domain/errors";
import { mockAccountModel } from "@/domain/test";

type SutTypes = {
  setStorageSpy: SetStorageSpy;
  sut: LocalUpdateCurrentAccount;
};

const makeSut = (): SutTypes => {
  const setStorageSpy = new SetStorageSpy();
  const sut = new LocalUpdateCurrentAccount(setStorageSpy);
  return {
    sut,
    setStorageSpy,
  };
};

describe("LocalUpdateCurrentAccount", () => {
  test("should call SetStorage with correct value", async () => {
    const { sut, setStorageSpy } = makeSut();
    const account = mockAccountModel()
    await sut.save(account);
    expect(setStorageSpy.key).toBe("account");
    expect(setStorageSpy.value).toBe(account);
  });

  test("should throw if SetStorage throws", async () => {
    const { sut, setStorageSpy } = makeSut();
    jest.spyOn(setStorageSpy, "set").mockImplementationOnce(() => { throw new Error() });
    const promise = sut.save(mockAccountModel());
    await expect(promise).rejects.toThrow(new Error());
  });

  test("should throw if account is falsy", async () => {
    const { sut } = makeSut();
    const promise = sut.save(undefined);
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });
});
