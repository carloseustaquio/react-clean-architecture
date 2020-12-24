import { AxiosHttpClient } from "./axios-http-client";
import axios from "axios";
import faker from "faker";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

type SutTypes = {
  sut: AxiosHttpClient;
};

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient();
  return { sut };
};

describe("AxiosHttpClient", () => {
  test("should call Axios with correct URL", async () => {
    const { sut } = makeSut();
    const url = faker.internet.url();
    sut.post({ url });
    expect(mockedAxios).toHaveBeenCalledWith(url);
  });
});
