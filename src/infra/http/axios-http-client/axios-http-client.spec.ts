import { AxiosHttpClient } from "./axios-http-client";
import axios from "axios";
import { mockAxios, mockHttpResponse } from "@/infra/test";
import { mockGetRequest, mockPostRequest } from "@/data/test";

jest.mock("axios");

type SutTypes = {
  sut: AxiosHttpClient;
  mockedAxios: jest.Mocked<typeof axios>;
};

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient();
  const mockedAxios = mockAxios();
  return { sut, mockedAxios };
};

describe("AxiosHttpClient", () => {
  describe("post", () => {
    test("should call axios.post with correct values", async () => {
      const { sut, mockedAxios } = makeSut();
      const request = mockPostRequest();
      sut.post(request);
      expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body);
    });
    test("should return correct response on axios.post", async () => {
      const { sut, mockedAxios } = makeSut();
      const httpResponse = await sut.post(mockPostRequest());
      const axiosResponse = await mockedAxios.post.mock.results[0].value;
      expect(httpResponse).toEqual({
        statusCode: axiosResponse.status,
        body: axiosResponse.data,
      });
    });
    test("should return correct error on axios.post", async () => {
      const { sut, mockedAxios } = makeSut();
      const axiosResponse = mockHttpResponse();
      mockedAxios.post.mockRejectedValueOnce({
        response: axiosResponse,
      });
      const httpResponse = await sut.post(mockPostRequest());

      expect(httpResponse).toEqual({
        statusCode: axiosResponse.status,
        body: axiosResponse.data,
      });
    });
  });

  describe("get", () => {
    test("should call axios.get with correct values", async () => {
      const { sut, mockedAxios } = makeSut();
      const request = mockGetRequest();
      sut.get(request);
      expect(mockedAxios.get).toHaveBeenCalledWith(request.url, {
        headers: request.headers,
      });
    });
    test("should return correct response on axios.get", async () => {
      const { sut, mockedAxios } = makeSut();
      const httpResponse = await sut.get(mockGetRequest());
      const axiosResponse = await mockedAxios.get.mock.results[0].value;
      expect(httpResponse).toEqual({
        statusCode: axiosResponse.status,
        body: axiosResponse.data,
      });
    });
    test("should return correct error on axios.post and ignore api data", async () => {
      const { sut, mockedAxios } = makeSut();
      const axiosResponse = mockHttpResponse();

      mockedAxios.get.mockRejectedValueOnce({
        response: axiosResponse,
      });
      const httpResponse = await sut.get(mockGetRequest());

      expect(httpResponse).toEqual({
        statusCode: axiosResponse.status,
        body: undefined,
      });
    });
  });
});
