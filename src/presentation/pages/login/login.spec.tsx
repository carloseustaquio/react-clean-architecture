/* eslint-disable @typescript-eslint/ban-types */
import React from "react";
import faker from "faker";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { Login } from "@/presentation/pages";
import { ApiContext } from "@/presentation/contexts";
import { ValidationStub, AuthenticationSpy, Helper } from "@/presentation/test";
import { InvalidCredentialsError } from "@/domain/errors";
import { AccountModel } from "@/domain/models";

type SutTypes = {
  authenticationSpy: AuthenticationSpy;
  setCurrentAccountMock: (account: AccountModel) => void;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({ initialEntries: ["/login"] });
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;
  const authenticationSpy = new AuthenticationSpy();
  const setCurrentAccountMock = jest.fn();
  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
      }}
    >
      <Router history={history}>
        <Login authentication={authenticationSpy} validation={validationStub} />
      </Router>
    </ApiContext.Provider>
  );
  return { authenticationSpy, setCurrentAccountMock };
};

const simulateValidSubmit = async (
  email: string = faker.internet.email(),
  password: string = faker.internet.password()
): Promise<void> => {
  Helper.populateField("email", email);
  Helper.populateField("password", password);

  const form = screen.getByTestId("form");
  fireEvent.submit(form);

  await waitFor(() => form);
};

describe("Login Component", () => {
  test("Should start with initial state", () => {
    const validationError = faker.random.words(2);
    makeSut({ validationError });
    expect(screen.getByTestId("errorWrap").children).toHaveLength(0);
    expect(screen.getByTestId("submit")).toBeDisabled();
    Helper.expectInvalidStatus("email", validationError);
    Helper.expectInvalidStatus("password", validationError);
  });

  test("Should show email error if validation fails", () => {
    const validationError = faker.random.words(2);
    makeSut({ validationError });
    Helper.populateField("email");
    Helper.expectInvalidStatus("email", validationError);
  });

  test("Should show password error if validation fails", () => {
    const validationError = faker.random.words(2);
    makeSut({ validationError });
    Helper.populateField("password");
    Helper.expectInvalidStatus("password", validationError);
  });

  test("Should show valid email state if validation succeeds", () => {
    makeSut();
    Helper.populateField("email");
    Helper.expectValidStatus("email");
  });

  test("Should show valid password state if validation succeeds", () => {
    makeSut();
    Helper.populateField("password");
    Helper.expectValidStatus("password");
  });

  test("Should enable submit button if form is valid", () => {
    makeSut();

    Helper.populateField("email");
    Helper.populateField("password");

    expect(screen.getByTestId("submit")).toBeEnabled();
  });

  test("Should show spinner on submit", async () => {
    makeSut();
    await simulateValidSubmit();

    expect(screen.queryByTestId("spinner")).toBeInTheDocument();
  });

  test("Should call Authentication with correct values", async () => {
    const { authenticationSpy } = makeSut();
    const password = faker.internet.password();
    const email = faker.internet.email();
    await simulateValidSubmit(email, password);

    expect(authenticationSpy.params).toEqual({ email, password });
  });

  test("Should call Authentication only once", async () => {
    const { authenticationSpy } = makeSut();
    await simulateValidSubmit();
    await simulateValidSubmit();

    expect(authenticationSpy.callsCount).toBe(1);
  });

  test("Should not call Authentication if form is invalid", async () => {
    const validationError = faker.random.words(2);
    const { authenticationSpy } = makeSut({
      validationError,
    });
    await simulateValidSubmit();

    expect(authenticationSpy.callsCount).toBe(0);
  });

  test("Should present error if Authentication fails", async () => {
    const { authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();
    jest.spyOn(authenticationSpy, "auth").mockRejectedValueOnce(error);
    await simulateValidSubmit();

    expect(screen.getByTestId("form-error")).toHaveTextContent(error.message);
    expect(screen.getByTestId("errorWrap").children).toHaveLength(1);
  });

  test("Should call updateCurrentAccount on success", async () => {
    const { authenticationSpy, setCurrentAccountMock } = makeSut();
    await simulateValidSubmit();

    expect(setCurrentAccountMock).toHaveBeenCalledWith(
      authenticationSpy.account
    );
    expect(history.length).toBe(1);
    expect(history.location.pathname).toBe("/");
  });

  test("Should go to signup page", async () => {
    makeSut();
    const register = screen.getByTestId("link-signup");
    fireEvent.click(register);
    expect(history.length).toBe(2);
    expect(history.location.pathname).toBe("/signup");
  });
});
