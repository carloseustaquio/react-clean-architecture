import { HttpGetClient, HttpStatusCode } from "@/data/protocols/http";
import { UnexpectedError } from "@/domain/errors";
import { SurveyModel } from "@/domain/models";
import { LoadSurveyList } from "@/domain/usecases";

export class RemoteLoadSurveyList implements LoadSurveyList {
  constructor(
    private readonly url: string,
    private httpGetClient: HttpGetClient<SurveyModel[]>
  ) {}

  async loadAll(): Promise<SurveyModel[]> {
    const httpResponse = await this.httpGetClient.get({ url: this.url });

    if (httpResponse.statusCode !== HttpStatusCode.ok) {
      throw new UnexpectedError();
    }

    return httpResponse.body;
  }
}
