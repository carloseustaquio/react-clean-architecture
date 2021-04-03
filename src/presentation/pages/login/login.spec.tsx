/* eslint-disable @typescript-eslint/ban-types */
import React from "react";
import faker from "faker";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import {
  render,
  RenderResult,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { Login } from "@/presentation/pages";
import {
  ValidationStub,
  AuthenticationSpy,
  UpdateCurrentAccountMock,
  Helper,
} from "@/presentation/test";
import { InvalidCredentialsError } from "@/domain/errors";

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
  updateCurrentAccountMock: UpdateCurrentAccountMock;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({ initialEntries: ["/login"] });
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;
  const authenticationSpy = new AuthenticationSpy();
  const updateCurrentAccountMock = new UpdateCurrentAccountMock();
  const sut = render(
    <Router history={history}>
      <Login
        authentication={authenticationSpy}
        validation={validationStub}
        updateCurrentAccount={updateCurrentAccountMock}
      />
    </Router>
  );
  return { sut, authenticationSpy, updateCurrentAccountMock };
};

const simulateValidSubmit = async (
  sut: RenderResult,
  email: string = faker.internet.email(),
  password: string = faker.internet.password()
): Promise<void> => {
  Helper.populateField(sut, "email", email);
  Helper.populateField(sut, "password", password);

  const form = sut.getByTestId("form");
  fireEvent.submit(form);

  await waitFor(() => form);
};

describe("Login Component", () => {
  afterEach(cleanup);

  test("Should start with initial state", () => {
    const validationError = faker.random.words(2);
    const { sut } = makeSut({
      validationError,
    });
    Helper.testChildCount(sut, "errorWrap", 0);
    Helper.testButtonIsDisabled(sut, "submit", true);
    Helper.expectInvalidStatus(sut, "email", validationError);
    Helper.expectInvalidStatus(sut, "password", validationError);
  });

  test("Should show email error if validation fails", () => {
    const validationError = faker.random.words(2);
    const { sut } = makeSut({
      validationError,
    });
    Helper.populateField(sut, "email");
    Helper.expectInvalidStatus(sut, "email", validationError);
  });

  test("Should show password error if validation fails", () => {
    const validationError = faker.random.words(2);
    const { sut } = makeSut({
      validationError,
    });
    Helper.populateField(sut, "password");
    Helper.expectInvalidStatus(sut, "password", validationError);
  });

  test("Should show valid email state if validation succeeds", () => {
    const { sut } = makeSut();
    Helper.populateField(sut, "email");
    Helper.expectValidStatus(sut, "email");
  });

  test("Should show valid password state if validation succeeds", () => {
    const { sut } = makeSut();
    Helper.populateField(sut, "password");
    Helper.expectValidStatus(sut, "password");
  });

  test("Should enable submit button if form is valid", () => {
    const { sut } = makeSut();

    Helper.populateField(sut, "email");
    Helper.populateField(sut, "password");

    Helper.testButtonIsDisabled(sut, "submit", false);
  });

  test("Should show spinner on submit", async () => {
    const { sut } = makeSut();
    await simulateValidSubmit(sut);

    Helper.testElementExists(sut, "spinner");
  });

  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationSpy } = makeSut();
    const password = faker.internet.password();
    const email = faker.internet.email();
    await simulateValidSubmit(sut, email, password);

    expect(authenticationSpy.params).toEqual({ email, password });
  });

  test("Should call Authentication only once", async () => {
    const { sut, authenticationSpy } = makeSut();
    await simulateValidSubmit(sut);
    await simulateValidSubmit(sut);

    expect(authenticationSpy.callsCount).toBe(1);
  });

  test("Should not call Authentication if form is invalid", async () => {
    const validationError = faker.random.words(2);
    const { sut, authenticationSpy } = makeSut({
      validationError,
    });
    await simulateValidSubmit(sut);

    expect(authenticationSpy.callsCount).toBe(0);
  });

  test("Should present error if Authentication fails", async () => {
    const { sut, authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();
    jest.spyOn(authenticationSpy, "auth").mockRejectedValueOnce(error);
    await simulateValidSubmit(sut);

    Helper.testTextContent(sut, "form-error", error.message);
    Helper.testChildCount(sut, "errorWrap", 1);
  });

  test("Should call updateCurrentAccount on success", async () => {
    const { sut, authenticationSpy, updateCurrentAccountMock } = makeSut();
    await simulateValidSubmit(sut);

    expect(updateCurrentAccountMock.account).toEqual(authenticationSpy.account);
    expect(history.length).toBe(1);
    expect(history.location.pathname).toBe("/");
  });

  test("Should present error if updateCurrentAccount fails", async () => {
    const { sut, updateCurrentAccountMock } = makeSut();
    const error = new InvalidCredentialsError();
    jest.spyOn(updateCurrentAccountMock, "save").mockRejectedValueOnce(error);
    await simulateValidSubmit(sut);
    Helper.testTextContent(sut, "form-error", error.message);
    Helper.testChildCount(sut, "errorWrap", 1);
  });

  test("Should go to signup page", async () => {
    const { sut } = makeSut();
    const register = sut.getByTestId("link-signup");
    fireEvent.click(register);
    expect(history.length).toBe(2);
    expect(history.location.pathname).toBe("/signup");
  });
});
