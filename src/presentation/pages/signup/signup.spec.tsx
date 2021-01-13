import React from "react";
import faker from "faker";
import { render, RenderResult } from "@testing-library/react";
import SignUp from "./signup";
import { Helper, ValidationStub } from "@/presentation/test/";

type SutTypes = {
  sut: RenderResult;
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;
  const sut = render(<SignUp validation={validationStub} />);
  return { sut };
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
});
