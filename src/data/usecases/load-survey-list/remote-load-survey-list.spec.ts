import faker from "faker";
import { HttpGetClientSpy } from "@/data/test";
import { RemoteLoadSurveyList } from "./remote-load-survey-list";

type SutTypes = {
  sut: RemoteLoadSurveyList;
  httpGetClientSpy: HttpGetClientSpy;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy();
  const sut = new RemoteLoadSurveyList(url, httpGetClientSpy);

  return {
    sut,
    httpGetClientSpy,
  };
};

describe("RemoteLoadSurveyList", (): void => {
  it("Should call HttpGetClient with correct url", async (): Promise<void> => {
    const url = faker.internet.url();
    const { sut, httpGetClientSpy } = makeSut(url);
    await sut.loadAll();
    expect(httpGetClientSpy.url).toBe(url);
  });
});
