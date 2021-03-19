import { HttpGetClient, HttpStatusCode } from "@/data/protocols/http";
import { UnexpectedError } from "@/domain/errors";

export class RemoteLoadSurveyList {
  constructor(
    private readonly url: string,
    private httpGetClient: HttpGetClient
  ) {}

  async loadAll(): Promise<void> {
    const httpResponse = await this.httpGetClient.get({ url: this.url });

    if (httpResponse.statusCode !== HttpStatusCode.ok) {
      throw new UnexpectedError();
    }
  }
}
