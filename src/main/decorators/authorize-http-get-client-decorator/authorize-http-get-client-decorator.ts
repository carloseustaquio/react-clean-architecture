import { GetStorage } from "@/data/protocols/cache";
import { HttpGetClient, HttpGetParams, HttpResponse } from "@/data/protocols/http";

export class AuthorizeHttpGetClientDecorator implements HttpGetClient {
 constructor(private readonly getStorage: GetStorage) {}

  get(_params: HttpGetParams): Promise<HttpResponse> {
    this.getStorage.get('account')
    return null;
  }
}