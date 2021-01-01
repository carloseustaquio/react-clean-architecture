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
  SaveAccessTokenMock,
} from "@/presentation/test";
import { InvalidCredentialsError } from "@/domain/errors";

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
  saveAccessTokenMock: SaveAccessTokenMock;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({ initialEntries: ["/login"] });
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;
  const authenticationSpy = new AuthenticationSpy();
  const saveAccessTokenMock = new SaveAccessTokenMock();
  const sut = render(
    <Router history={history}>
      <Login
        authentication={authenticationSpy}
        validation={validationStub}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  );
  return { sut, authenticationSpy, saveAccessTokenMock };
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

const simulateValidSubmit = async (
  sut: RenderResult,
  email: string = faker.internet.email(),
  password: string = faker.internet.password()
): Promise<void> => {
  populateEmailField(sut, email);
  populatePasswordField(sut, password);

  const form = sut.getByTestId("form");
  fireEvent.submit(form);

  await waitFor(() => form);
};

const getFieldStatus = (sut: RenderResult, fieldName: string): HTMLElement => {
  return sut.getByTestId(`${fieldName}-status`);
};

const expectValidStatus = (sut: RenderResult, fieldName: string): void => {
  const fieldStatus = getFieldStatus(sut, fieldName);
  expect(fieldStatus.title).toBe("Tudo certo!");
  expect(fieldStatus.textContent).toBe("🟢");
};

const expectInvalidStatus = (
  sut: RenderResult,
  fieldName: string,
  validationError: string
): void => {
  const fieldStatus = getFieldStatus(sut, fieldName);
  expect(fieldStatus.title).toBe(validationError);
  expect(fieldStatus.textContent).toBe("🔴");
};

const testErrorWrapChildCount = (sut: RenderResult, count: number): void => {
  const errorWrap = sut.getByTestId("errorWrap");
  expect(errorWrap.childElementCount).toBe(count);
};

const testElementExists = (sut: RenderResult, fieldName: string): void => {
  const el = sut.getByTestId(fieldName);
  expect(el).toBeTruthy();
};

const testTextContent = (
  sut: RenderResult,
  fieldName: string,
  text: string
): void => {
  const el = sut.getByTestId(fieldName);
  expect(el.textContent).toBe(text);
};

const testButtonIsDisabled = (
  sut: RenderResult,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

describe("Login Component", () => {
  afterEach(cleanup);

  test("Should start with initial state", () => {
    const validationError = faker.random.words(2);
    const { sut } = makeSut({
      validationError,
    });
    testErrorWrapChildCount(sut, 0);
    testButtonIsDisabled(sut, "submit", true);
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

    testButtonIsDisabled(sut, "submit", false);
  });

  test("Should show spinner on submit", async () => {
    const { sut } = makeSut();
    await simulateValidSubmit(sut);

    testElementExists(sut, "spinner");
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

  test("Should present error if validation fails", async () => {
    const { sut, authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();
    jest.spyOn(authenticationSpy, "auth").mockRejectedValueOnce(error);
    await simulateValidSubmit(sut);

    testTextContent(sut, "form-error", error.message);
    testErrorWrapChildCount(sut, 1);
  });

  test("Should call saveAcessToken on success", async () => {
    const { sut, authenticationSpy, saveAccessTokenMock } = makeSut();
    await simulateValidSubmit(sut);

    expect(saveAccessTokenMock.accessToken).toBe(
      authenticationSpy.account.accessToken
    );
    expect(history.length).toBe(1);
    expect(history.location.pathname).toBe("/");
  });

  test("Should present error if saveAcessToken fails", async () => {
    const { sut, saveAccessTokenMock } = makeSut();
    const error = new InvalidCredentialsError();
    jest.spyOn(saveAccessTokenMock, "save").mockRejectedValueOnce(error);
    await simulateValidSubmit(sut);
    testTextContent(sut, "form-error", error.message);
    testErrorWrapChildCount(sut, 1);
  });

  test("Should go to signup page", async () => {
    const { sut } = makeSut();
    const register = sut.getByTestId("signup");
    fireEvent.click(register);
    expect(history.length).toBe(2);
    expect(history.location.pathname).toBe("/signup");
  });
});
