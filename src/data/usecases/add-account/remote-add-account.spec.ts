import { RemoteAddAccount } from "./remote-add-account";
import { HttpPostClientSpy } from "@/data/test";
import { AddAccountParams } from "@/domain/usecases";
import { AccountModel } from "@/domain/models";
import { HttpStatusCode } from "@/data/protocols/http";
import { mockAddAccountParams } from "@/domain/test";
import faker from "faker";
import { EmailInUseError, UnexpectedError } from "@/domain/errors";

type SutTypes = {
  sut: RemoteAddAccount;
  httpPostClientSpy: HttpPostClientSpy<AddAccountParams, AccountModel>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<
    AddAccountParams,
    AccountModel
  >();
  const sut = new RemoteAddAccount(url, httpPostClientSpy);
  return {
    sut,
    httpPostClientSpy,
  };
};
describe("RemoteAddAccount", () => {
  test("should call HttpClient with correct url", async () => {
    const url = faker.internet.url();
    const { sut, httpPostClientSpy } = makeSut(url);
    await sut.add(mockAddAccountParams());
    expect(httpPostClientSpy.url).toBe(url);
  });

  test("should call HttpClient with correct body", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    const addAccountParams = mockAddAccountParams();
    await sut.add(addAccountParams);
    expect(httpPostClientSpy.body).toEqual(addAccountParams);
  });

  test("should throw EmailInUseError if HttpPostClient return 401", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    };
    const addAccountParams = mockAddAccountParams();
    const promise = sut.add(addAccountParams);
    await expect(promise).rejects.toThrow(new EmailInUseError());
  });

  test("should throw UnexpectedError if HttpPostClient returns 400", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest,
    };
    const addAccountParams = mockAddAccountParams();
    const promise = sut.add(addAccountParams);
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("should throw UnexpectedError if HttpPostClient returns 404", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };
    const addAccountParams = mockAddAccountParams();
    const promise = sut.add(addAccountParams);
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("should throw UnexpectedError if HttpPostClient returns 500", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };
    const addAccountParams = mockAddAccountParams();
    const promise = sut.add(addAccountParams);
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });
});
