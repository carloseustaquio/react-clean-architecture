import React from "react";
import { render, screen } from "@testing-library/react";
import { SurveyItem } from "@/presentation/pages/survey-list/components";
import { mockSurveyModel } from "@/domain/test";
import { IconName } from "@/presentation/components";

const makeSut = (survey = mockSurveyModel()): void => {
  render(<SurveyItem survey={survey} />);
};

describe("SurveyListItem Component", () => {
  test("should render with correct values", () => {
    const survey = Object.assign(mockSurveyModel(), {
      didAnswer: true,
      date: new Date("2021-01-10T00:00:00"),
    });
    makeSut(survey);
    expect(screen.getByTestId("icon")).toHaveProperty("src", IconName.thumbsUp);
    expect(screen.getByTestId("question")).toHaveTextContent(survey.question);
    expect(screen.getByTestId("day")).toHaveTextContent("10");
    expect(screen.getByTestId("month")).toHaveTextContent("jan");
    expect(screen.getByTestId("year")).toHaveTextContent("2021");
  });

  test("should render with correct values", () => {
    const survey = Object.assign(mockSurveyModel(), {
      didAnswer: false,
      date: new Date("2019-05-03T00:00:00"),
    });
    makeSut(survey);
    expect(screen.getByTestId("icon")).toHaveProperty(
      "src",
      IconName.thumbsDown
    );
    expect(screen.getByTestId("question")).toHaveTextContent(survey.question);
    expect(screen.getByTestId("day")).toHaveTextContent("03");
    expect(screen.getByTestId("month")).toHaveTextContent("mai");
    expect(screen.getByTestId("year")).toHaveTextContent("2019");
  });
});
