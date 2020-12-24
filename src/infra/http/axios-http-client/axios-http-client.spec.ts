import { AxiosHttpClient } from "./axios-http-client";
import axios from "axios";
import faker from "faker";
import { HttpPostParams } from "@/data/protocols/http";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

type SutTypes = {
  sut: AxiosHttpClient;
};

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient();
  return { sut };
};

const mockPostRequest = (): HttpPostParams<any> => ({
  url: faker.internet.url(),
  body: faker.random.objectElement(),
});

describe("AxiosHttpClient", () => {
  test("should call Axios with correct URL and verb", async () => {
    const { sut } = makeSut();
    const request = mockPostRequest();
    sut.post(request);
    expect(mockedAxios.post).toHaveBeenCalledWith(request.url);
  });
});
