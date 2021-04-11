import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SurveyList } from "@/presentation/pages";
import { LoadSurveyListSpy, mockAccountModel } from "@/domain/test";
import { UnexpectedError } from "@/domain/errors";
import { ApiContext } from "@/presentation/contexts";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy;
};

const history = createMemoryHistory({ initialEntries: ["/"] });

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutTypes => {
  const setCurrentAccountMock = jest.fn();
  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
        getCurrentAccount: () => mockAccountModel(),
      }}
    >
      <Router history={history}>
        <SurveyList loadSurveyList={loadSurveyListSpy} />
      </Router>
    </ApiContext.Provider>
  );
  return {
    loadSurveyListSpy,
  };
};

describe("SurveyList Component", () => {
  test("should present 4 empty items on start", async () => {
    makeSut();
    const surveyList = screen.getByTestId("survey-list");
    expect(surveyList.querySelectorAll("li:empty")).toHaveLength(4);
    expect(screen.queryByTestId("error")).not.toBeInTheDocument();
    await waitFor(() => surveyList);
  });

  test("should LoadSurveyList", async () => {
    const { loadSurveyListSpy } = makeSut();
    expect(loadSurveyListSpy.callsCount).toBe(1);
    await waitFor(() => screen.getByRole("heading"));
  });

  test("should render SurveyItems on success", async () => {
    makeSut();
    const surveyList = screen.getByTestId("survey-list");
    await waitFor(() => surveyList);
    expect(surveyList.querySelectorAll("li.surveyItemWrap")).toHaveLength(3);
    expect(screen.queryByTestId("error")).not.toBeInTheDocument();
  });

  test("should render error on fail", async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy();
    const error = new UnexpectedError();
    jest.spyOn(loadSurveyListSpy, "loadAll").mockRejectedValueOnce(error);
    makeSut(loadSurveyListSpy);
    await waitFor(() => screen.getByRole("heading"));
    expect(screen.queryByTestId("survey-list")).not.toBeInTheDocument();
    expect(screen.getByTestId("error")).toHaveTextContent(error.message);
  });

  test("should call LoadSurveyList on reload", async () => {
    // given
    const loadSurveyListSpy = new LoadSurveyListSpy();
    jest
      .spyOn(loadSurveyListSpy, "loadAll")
      .mockRejectedValueOnce(new UnexpectedError());
    makeSut(loadSurveyListSpy);
    await waitFor(() => screen.getByRole("heading"));

    // when
    fireEvent.click(screen.getByTestId("reload"));

    // then
    expect(loadSurveyListSpy.callsCount).toBe(1);
    await waitFor(() => screen.getByRole("heading"));
  });
});
