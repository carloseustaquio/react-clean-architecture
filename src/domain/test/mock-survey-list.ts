import { SurveyModel } from "@/domain/models";
import faker from "faker";

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.random.uuid(),
  question: faker.random.words(10),
  answers: [
    {
      answer: faker.random.words(2),
      image: faker.random.image(),
    },
    {
      answer: faker.random.words(2),
      image: faker.random.image(),
    },
  ],
  date: faker.date.past(),
  didAnswer: faker.random.boolean(),
})

export const mockSurveyList = (): SurveyModel[] => ([
  mockSurveyModel(),
  mockSurveyModel(),
  mockSurveyModel(),
])