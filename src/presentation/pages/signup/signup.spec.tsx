import React from "react";
import faker from "faker";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import { SignUp } from "@/presentation/pages";
import { ApiContext } from "@/presentation/contexts";
import { AddAccountSpy, Helper, ValidationStub } from "@/presentation/test/";
import { EmailInUseError } from "@/domain/errors";
import { AccountModel } from "@/domain/models";

type SutTypes = {
  sut: RenderResult;
  addAccountSpy: AddAccountSpy;
  setCurrentAccountMock: (account: AccountModel) => void;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({ initialEntries: ["/signup"] });
const makeSut = (params?: SutParams): SutTypes => {
  const addAccountSpy = new AddAccountSpy();
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;
  const setCurrentAccountMock = jest.fn();
  const sut = render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
      }}
    >
      <Router history={history}>
        <SignUp validation={validationStub} addAccount={addAccountSpy} />
      </Router>
    </ApiContext.Provider>
  );
  return {
    sut,
    addAccountSpy,
    setCurrentAccountMock,
  };
};

const simulateValidSubmit = async (
  sut: RenderResult,
  name: string = faker.name.firstName(),
  email: string = faker.internet.email(),
  password: string = faker.internet.password()
): Promise<void> => {
  Helper.populateField(sut, "name", name);
  Helper.populateField(sut, "email", email);
  Helper.populateField(sut, "password", password);
  Helper.populateField(sut, "passwordConfirmation", password);

  const form = sut.getByTestId("form");
  fireEvent.submit(form);

  await waitFor(() => form);
};

describe("SignUp Component", () => {
  test("Should start with initial state", () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    Helper.testChildCount(sut, "errorWrap", 0);
    Helper.testButtonIsDisabled(sut, "submit", true);
    Helper.expectInvalidStatus(sut, "name", validationError);
    Helper.expectInvalidStatus(sut, "email", validationError);
    Helper.expectInvalidStatus(sut, "password", validationError);
    Helper.expectInvalidStatus(sut, "passwordConfirmation", validationError);
  });

  test("Should show name error if Validation fails", () => {
    const validationError = faker.random.words(2);
    const { sut } = makeSut({
      validationError,
    });
    Helper.populateField(sut, "name");
    Helper.expectInvalidStatus(sut, "name", validationError);
  });

  test("Should show email error if Validation fails", () => {
    const validationError = faker.random.words(2);
    const { sut } = makeSut({
      validationError,
    });
    Helper.populateField(sut, "email");
    Helper.expectInvalidStatus(sut, "email", validationError);
  });

  test("Should show password error if Validation fails", () => {
    const validationError = faker.random.words(2);
    const { sut } = makeSut({
      validationError,
    });
    Helper.populateField(sut, "password");
    Helper.expectInvalidStatus(sut, "password", validationError);
  });

  test("Should show passwordConfirmation error if Validation fails", () => {
    const validationError = faker.random.words(2);

    const { sut } = makeSut({
      validationError,
    });
    Helper.populateField(sut, "passwordConfirmation");
    Helper.expectInvalidStatus(sut, "passwordConfirmation", validationError);
  });

  test("Should show valid name state if validation succeeds", () => {
    const { sut } = makeSut();
    Helper.populateField(sut, "name");
    Helper.expectValidStatus(sut, "name");
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

  test("Should show valid passwordConfirmation state if validation succeeds", () => {
    const { sut } = makeSut();
    Helper.populateField(sut, "passwordConfirmation");
    Helper.expectValidStatus(sut, "passwordConfirmation");
  });

  test("Should enable submit button if form is valid", () => {
    const { sut } = makeSut();

    Helper.populateField(sut, "name");
    Helper.populateField(sut, "email");
    Helper.populateField(sut, "password");
    Helper.populateField(sut, "passwordConfirmation");

    Helper.testButtonIsDisabled(sut, "submit", false);
  });

  test("Should show spinner on submit", async () => {
    const { sut } = makeSut();
    await simulateValidSubmit(sut);
    Helper.testElementExists(sut, "spinner");
  });

  test("Should call AddAccount with correct values", async () => {
    const { sut, addAccountSpy } = makeSut();
    const name = faker.name.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await simulateValidSubmit(sut, name, email, password);

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password,
    });
  });

  test("Should call AddAccount only once", async () => {
    const { sut, addAccountSpy } = makeSut();
    await simulateValidSubmit(sut);
    await simulateValidSubmit(sut);

    expect(addAccountSpy.callsCount).toBe(1);
  });

  test("Should not call AddAccount if form is invalid", async () => {
    const validationError = faker.random.words(2);
    const { sut, addAccountSpy } = makeSut({
      validationError,
    });
    await simulateValidSubmit(sut);

    expect(addAccountSpy.callsCount).toBe(0);
  });

  test("Should present error if AddAccount fails", async () => {
    const { sut, addAccountSpy } = makeSut();
    const error = new EmailInUseError();
    jest.spyOn(addAccountSpy, "add").mockRejectedValueOnce(error);
    await simulateValidSubmit(sut);

    Helper.testTextContent(sut, "form-error", error.message);
    Helper.testChildCount(sut, "errorWrap", 1);
  });

  test("Should call updateCurrentAccount on success", async () => {
    const { sut, addAccountSpy, setCurrentAccountMock } = makeSut();
    await simulateValidSubmit(sut);

    expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account);
    expect(history.length).toBe(1);
    expect(history.location.pathname).toBe("/");
  });

  test("Should go to login page", async () => {
    const { sut } = makeSut();
    const register = sut.getByTestId("link-login");
    fireEvent.click(register);
    expect(history.length).toBe(2);
    expect(history.location.pathname).toBe("/login");
  });
});
