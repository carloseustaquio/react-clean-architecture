/* eslint-disable @typescript-eslint/ban-types */
import React from "react";
import faker from "faker";
import {
  render,
  RenderResult,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import Login from "./login";
import { ValidationStub, AuthenticationSpy } from "@/presentation/test";
import { InvalidCredentialsError } from "@/domain/errors";

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;
  const authenticationSpy = new AuthenticationSpy();
  const sut = render(
    <Login authentication={authenticationSpy} validation={validationStub} />
  );
  return { sut, authenticationSpy };
};

const populateEmailField = (
  sut: RenderResult,
  email: string = faker.internet.email()
): void => {
  const emailInput = sut.getByTestId("email");
  fireEvent.input(emailInput, {
    target: { value: email },
  });
};

const populatePasswordField = (
  sut: RenderResult,
  password: string = faker.internet.password()
): void => {
  const passwordInput = sut.getByTestId("password");
  fireEvent.input(passwordInput, {
    target: { value: password },
  });
};

const simulateValidSubmit = (
  sut: RenderResult,
  email: string = faker.internet.email(),
  password: string = faker.internet.password()
): void => {
  populateEmailField(sut, email);
  populatePasswordField(sut, password);

  const submitButton = sut.getByTestId("submit") as HTMLButtonElement;
  fireEvent.click(submitButton);
};

const getFieldStatus = (sut: RenderResult, fieldName: string): HTMLElement => {
  return sut.getByTestId(`${fieldName}-status`);
};

const expectValidStatus = (sut: RenderResult, fieldName: string) => {
  const fieldStatus = getFieldStatus(sut, fieldName);
  expect(fieldStatus.title).toBe("Tudo certo!");
  expect(fieldStatus.textContent).toBe("🟢");
};

const expectInvalidStatus = (
  sut: RenderResult,
  fieldName: string,
  validationError: string
) => {
  const fieldStatus = getFieldStatus(sut, fieldName);
  expect(fieldStatus.title).toBe(validationError);
  expect(fieldStatus.textContent).toBe("🔴");
};

describe("Login Component", () => {
  afterEach(cleanup);

  test("Should start with initial state", () => {
    const validationError = faker.random.words(2);
    const { sut } = makeSut({
      validationError,
    });
    const errorWrap = sut.getByTestId("errorWrap");
    expect(errorWrap.childElementCount).toBe(0);
    const submitButton = sut.getByTestId("submit") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    expectInvalidStatus(sut, "email", validationError);
    expectInvalidStatus(sut, "password", validationError);
  });

  test("Should show email error if validation fails", () => {
    const validationError = faker.random.words(2);
    const { sut } = makeSut({
      validationError,
    });
    populateEmailField(sut);
    expectInvalidStatus(sut, "email", validationError);
  });

  test("Should show password error if validation fails", () => {
    const validationError = faker.random.words(2);
    const { sut } = makeSut({
      validationError,
    });
    populatePasswordField(sut);
    expectInvalidStatus(sut, "password", validationError);
  });

  test("Should show valid email state if validation succeeds", () => {
    const { sut } = makeSut();
    populateEmailField(sut);
    expectValidStatus(sut, "email");
  });

  test("Should show valid password state if validation succeeds", () => {
    const { sut } = makeSut();
    populatePasswordField(sut);
    expectValidStatus(sut, "password");
  });

  test("Should enable submit button if form is valid", () => {
    const { sut } = makeSut();

    populateEmailField(sut);
    populatePasswordField(sut);

    const submitButton = sut.getByTestId("submit") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });

  test("Should show spinner on submit", () => {
    const { sut } = makeSut();
    simulateValidSubmit(sut);

    const spinner = sut.getByTestId("spinner");
    expect(spinner).toBeTruthy();
  });

  test("Should call Authentication with correct values", () => {
    const { sut, authenticationSpy } = makeSut();
    const password = faker.internet.password();
    const email = faker.internet.email();
    simulateValidSubmit(sut, email, password);

    expect(authenticationSpy.params).toEqual({ email, password });
  });

  test("Should call Authentication only once", () => {
    const { sut, authenticationSpy } = makeSut();
    simulateValidSubmit(sut);
    simulateValidSubmit(sut);

    expect(authenticationSpy.callsCount).toBe(1);
  });

  test("Should not call Authentication if form is invalid", () => {
    const validationError = faker.random.words(2);
    const { sut, authenticationSpy } = makeSut({
      validationError,
    });
    populateEmailField(sut);
    fireEvent.submit(sut.getByTestId("form"));

    expect(authenticationSpy.callsCount).toBe(0);
  });

  test("Should present error if validation fails", async () => {
    const { sut, authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();
    jest.spyOn(authenticationSpy, "auth").mockRejectedValueOnce(error);
    simulateValidSubmit(sut);

    const errorWrap = sut.getByTestId("errorWrap");
    await waitFor(() => errorWrap);

    const formError = sut.getByTestId("form-error");
    expect(formError.textContent).toBe(error.message);

    expect(errorWrap.childElementCount).toBe(1);
  });
});
