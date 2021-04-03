import { LocalStorageAdapter } from "./local-storage-adapter";
import "jest-localstorage-mock";
import faker from "faker";

const makeSut = () => new LocalStorageAdapter();

describe("LocalStorageAdapter", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should call localStorage.setItem with correct values", async () => {
    const sut = makeSut();
    const key = faker.database.column();
    const value = {
      [faker.random.word()]: faker.random.word()
    }
    const stringValue = JSON.stringify(value)
    const prefix = "4devs"
    sut.set(key, value);
    expect(localStorage.setItem).toHaveBeenCalledWith(`${prefix}-${key}`, stringValue);
  });

  test("should call localStorage.getItem with correct value", async () => {
    const sut = makeSut();
    const key = faker.database.column();
    const value = {
      [faker.random.word()]: faker.random.word()
    }
    const prefix = "4devs"
    const getItemSpy = jest.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify(value));
    const obj = sut.get(key);
    expect(obj).toEqual(value);
    expect(getItemSpy).toHaveBeenCalledWith(`${prefix}-${key}`)
  });
});
