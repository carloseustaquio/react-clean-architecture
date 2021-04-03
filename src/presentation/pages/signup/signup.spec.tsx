import React from "react";
import faker from "faker";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { SignUp } from "@/presentation/pages";
import { ApiContext } from "@/presentation/contexts";
import { AddAccountSpy, Helper, ValidationStub } from "@/presentation/test/";
import { EmailInUseError } from "@/domain/errors";
import { AccountModel } from "@/domain/models";

type SutTypes = {
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
  render(
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
    addAccountSpy,
    setCurrentAccountMock,
  };
};

const simulateValidSubmit = async (
  name: string = faker.name.firstName(),
  email: string = faker.internet.email(),
  password: string = faker.internet.password()
): Promise<void> => {
  Helper.populateField("name", name);
  Helper.populateField("email", email);
  Helper.populateField("password", password);
  Helper.populateField("passwordConfirmation", password);

  const form = screen.getByTestId("form");
  fireEvent.submit(form);

  await waitFor(() => form);
};

describe("SignUp Component", () => {
  test("Should start with initial state", () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    Helper.testChildCount("errorWrap", 0);
    Helper.testButtonIsDisabled("submit", true);
    Helper.expectInvalidStatus("name", validationError);
    Helper.expectInvalidStatus("email", validationError);
    Helper.expectInvalidStatus("password", validationError);
    Helper.expectInvalidStatus("passwordConfirmation", validationError);
  });

  test("Should show name error if Validation fails", () => {
    const validationError = faker.random.words(2);
    makeSut({ validationError });
    Helper.populateField("name");
    Helper.expectInvalidStatus("name", validationError);
  });

  test("Should show email error if Validation fails", () => {
    const validationError = faker.random.words(2);
    makeSut({ validationError });
    Helper.populateField("email");
    Helper.expectInvalidStatus("email", validationError);
  });

  test("Should show password error if Validation fails", () => {
    const validationError = faker.random.words(2);
    makeSut({ validationError });
    Helper.populateField("password");
    Helper.expectInvalidStatus("password", validationError);
  });

  test("Should show passwordConfirmation error if Validation fails", () => {
    const validationError = faker.random.words(2);
    makeSut({ validationError });
    Helper.populateField("passwordConfirmation");
    Helper.expectInvalidStatus("passwordConfirmation", validationError);
  });

  test("Should show valid name state if validation succeeds", () => {
    makeSut();
    Helper.populateField("name");
    Helper.expectValidStatus("name");
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

  test("Should show valid passwordConfirmation state if validation succeeds", () => {
    makeSut();
    Helper.populateField("passwordConfirmation");
    Helper.expectValidStatus("passwordConfirmation");
  });

  test("Should enable submit button if form is valid", () => {
    makeSut();

    Helper.populateField("name");
    Helper.populateField("email");
    Helper.populateField("password");
    Helper.populateField("passwordConfirmation");

    Helper.testButtonIsDisabled("submit", false);
  });

  test("Should show spinner on submit", async () => {
    makeSut();
    await simulateValidSubmit();
    Helper.testElementExists("spinner");
  });

  test("Should call AddAccount with correct values", async () => {
    const { addAccountSpy } = makeSut();
    const name = faker.name.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await simulateValidSubmit(name, email, password);

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password,
    });
  });

  test("Should call AddAccount only once", async () => {
    const { addAccountSpy } = makeSut();
    await simulateValidSubmit();
    await simulateValidSubmit();

    expect(addAccountSpy.callsCount).toBe(1);
  });

  test("Should not call AddAccount if form is invalid", async () => {
    const validationError = faker.random.words(2);
    const { addAccountSpy } = makeSut({
      validationError,
    });
    await simulateValidSubmit();

    expect(addAccountSpy.callsCount).toBe(0);
  });

  test("Should present error if AddAccount fails", async () => {
    const { addAccountSpy } = makeSut();
    const error = new EmailInUseError();
    jest.spyOn(addAccountSpy, "add").mockRejectedValueOnce(error);
    await simulateValidSubmit();

    Helper.testTextContent("form-error", error.message);
    Helper.testChildCount("errorWrap", 1);
  });

  test("Should call updateCurrentAccount on success", async () => {
    const { addAccountSpy, setCurrentAccountMock } = makeSut();
    await simulateValidSubmit();

    expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account);
    expect(history.length).toBe(1);
    expect(history.location.pathname).toBe("/");
  });

  test("Should go to login page", async () => {
    makeSut();
    const register = screen.getByTestId("link-login");
    fireEvent.click(register);
    expect(history.length).toBe(2);
    expect(history.location.pathname).toBe("/login");
  });
});
