import { AuthorizeHttpGetClientDecorator } from "@/main/decorators";
import { GetStorageSpy, HttpGetClientSpy, mockGetRequest } from "@/data/test";
import faker from "faker";
import { HttpGetParams } from "@/data/protocols/http";
import { mockAccountModel } from "@/domain/test";

type SutTypes = {
  sut: AuthorizeHttpGetClientDecorator;
  getStorageSpy: GetStorageSpy;
  httpGetClientSpy: HttpGetClientSpy;
};

const makeSut = (): SutTypes => {
  const getStorageSpy = new GetStorageSpy();
  const httpGetClientSpy = new HttpGetClientSpy();
  const sut = new AuthorizeHttpGetClientDecorator(
    getStorageSpy,
    httpGetClientSpy
  );
  return {
    sut,
    getStorageSpy,
    httpGetClientSpy,
  };
};

describe("AuthorizeHttpGetClientDecorator", () => {
  test("should call GetStorage with correct value", async () => {
    const { sut, getStorageSpy } = makeSut();
    await sut.get(mockGetRequest());
    expect(getStorageSpy.key).toBe("account");
  });

  test("should not add headers if getStorage is invalid", async () => {
    const { sut, httpGetClientSpy } = makeSut();
    const request: HttpGetParams = {
      url: faker.internet.url(),
      headers: {
        field: faker.random.words(),
      },
    };
    await sut.get(request);
    expect(httpGetClientSpy.url).toBe(request.url);
    expect(httpGetClientSpy.headers).toBe(request.headers);
  });

  test("should add headers to httpClientClient", async () => {
    const { sut, httpGetClientSpy, getStorageSpy } = makeSut();
    getStorageSpy.value = mockAccountModel();
    const request: HttpGetParams = {
      url: faker.internet.url(),
    };
    await sut.get(request);
    expect(httpGetClientSpy.url).toBe(request.url);
    expect(httpGetClientSpy.headers).toEqual({
      "x-access-token": getStorageSpy.value.accessToken,
    });
  });

  test("should merge headers to httpClientClient", async () => {
    const { sut, httpGetClientSpy, getStorageSpy } = makeSut();
    getStorageSpy.value = mockAccountModel();
    const field = faker.random.words();
    const request: HttpGetParams = {
      url: faker.internet.url(),
      headers: {
        field,
      },
    };
    await sut.get(request);
    expect(httpGetClientSpy.url).toBe(request.url);
    expect(httpGetClientSpy.headers).toEqual({
      field,
      "x-access-token": getStorageSpy.value.accessToken,
    });
  });
});
