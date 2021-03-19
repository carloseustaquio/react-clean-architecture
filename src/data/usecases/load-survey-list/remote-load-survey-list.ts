import { HttpGetClient } from "@/data/protocols/http";

export class RemoteLoadSurveyList {
  constructor(
    private readonly url: string,
    private httpGetClient: HttpGetClient
  ) {}

  async loadAll(): Promise<void> {
    this.httpGetClient.get({ url: this.url });
    return;
  }
}
