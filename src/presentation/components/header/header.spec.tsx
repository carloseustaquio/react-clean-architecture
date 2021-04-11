import { Header } from "@/presentation/components";
import { ApiContext } from "@/presentation/contexts";
import { fireEvent, render, screen } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory, MemoryHistory } from "history";
import React from "react";
import { AccountModel } from "@/domain/models";
import { mockAccountModel } from "@/domain/test";

const history = createMemoryHistory({ initialEntries: ["/"] });

type SutTypes = {
  history: MemoryHistory;
  setCurrentAccountMock: (account: AccountModel) => void;
};

const makeSut = (account = mockAccountModel()): SutTypes => {
  const setCurrentAccountMock = jest.fn();
  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
        getCurrentAccount: () => account,
      }}
    >
      <Router history={history}>
        <Header />
      </Router>
    </ApiContext.Provider>
  );
  return {
    history,
    setCurrentAccountMock,
  };
};

describe("Header Component", () => {
  it("should call setCurrentAccount with undefined", () => {
    const { history, setCurrentAccountMock } = makeSut();
    fireEvent.click(screen.getByTestId("logout"));
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined);
    expect(history.location.pathname).toBe("/login");
  });

  it("should render username correctly", () => {
    const account = mockAccountModel();
    makeSut(account);
    expect(screen.getByTestId("username")).toHaveTextContent(account.name);
  });
});
