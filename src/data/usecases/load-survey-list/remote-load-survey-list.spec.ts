import faker from "faker";
import { HttpGetClientSpy, mockRemoteSurveyList } from "@/data/test";
import { RemoteLoadSurveyList } from "./remote-load-survey-list";
import { UnexpectedError } from "@/domain/errors";
import { HttpStatusCode } from "@/data/protocols/http";

type SutTypes = {
  sut: RemoteLoadSurveyList;
  httpGetClientSpy: HttpGetClientSpy<RemoteLoadSurveyList.Model[]>;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy<RemoteLoadSurveyList.Model[]>();
  const sut = new RemoteLoadSurveyList(url, httpGetClientSpy);

  return {
    sut,
    httpGetClientSpy,
  };
};

describe("RemoteLoadSurveyList", (): void => {
  test("Should call HttpGetClient with correct url", async (): Promise<void> => {
    const url = faker.internet.url();
    const { sut, httpGetClientSpy } = makeSut(url);
    await sut.loadAll();
    expect(httpGetClientSpy.url).toBe(url);
  });

  test("should throw UnexpectedError if HttpGetClient returns 400", async () => {
    const { sut, httpGetClientSpy } = makeSut();
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.badRequest,
    };
    const promise = sut.loadAll();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("should throw UnexpectedError if HttpGetClient returns 404", async () => {
    const { sut, httpGetClientSpy } = makeSut();
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };
    const promise = sut.loadAll();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("should throw UnexpectedError if HttpGetClient returns 504", async () => {
    const { sut, httpGetClientSpy } = makeSut();
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };
    const promise = sut.loadAll();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("should return a list of SurveyModels if HttpGetClient returns 200", async () => {
    const { sut, httpGetClientSpy } = makeSut();
    const httpResult = mockRemoteSurveyList();
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult,
    };
    const surveyList = await sut.loadAll();
    expect(surveyList).toEqual([
      {
        id: httpResult[0].id,
        question: httpResult[0].question,
        date: new Date(httpResult[0].date),
        didAnswer: httpResult[0].didAnswer,
      },
      {
        id: httpResult[1].id,
        question: httpResult[1].question,
        date: new Date(httpResult[1].date),
        didAnswer: httpResult[1].didAnswer,
      },
      {
        id: httpResult[2].id,
        question: httpResult[2].question,
        date: new Date(httpResult[2].date),
        didAnswer: httpResult[2].didAnswer,
      },
    ]);
  });

  test("should return an empty list if HttpGetClient returns 204", async () => {
    const { sut, httpGetClientSpy } = makeSut();
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.noContent,
    };
    const surveyList = await sut.loadAll();
    expect(surveyList).toEqual([]);
  });
});
