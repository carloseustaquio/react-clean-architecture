import { LocalStorageAdapter } from "./local-storage-adapter";
import "jest-localstorage-mock";
import faker from "faker";

const makeSut = () => new LocalStorageAdapter();

describe("LocalStorageAdapter", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should call localStorage with correct values", async () => {
    const sut = makeSut();
    const key = faker.database.column();
    const value = faker.random.word();
    const stringfiedValue = JSON.stringify(value)
    const prefix = "4devs"
    await sut.set(key, value);
    expect(localStorage.setItem).toHaveBeenCalledWith(`${prefix}-${key}`, stringfiedValue);
  });
});
