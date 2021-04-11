import faker from "faker";
import { RemoteLoadSurveyList } from "@/data/usecases";

export const mockRemoteSurveyModel = (): RemoteLoadSurveyList.Model => ({
  id: faker.random.uuid(),
  question: faker.random.words(10),
  date: faker.date.past().toISOString(),
  didAnswer: faker.random.boolean(),
});

export const mockRemoteSurveyList = (): RemoteLoadSurveyList.Model[] => [
  mockRemoteSurveyModel(),
  mockRemoteSurveyModel(),
  mockRemoteSurveyModel(),
];
