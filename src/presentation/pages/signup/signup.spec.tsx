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
    Helper.expectInvalidStatus(sut, "password", "Campo obrigatório");
    Helper.expectInvalidStatus(
      sut,
      "passwordConfirmation",
      "Campo obrigatório"
    );
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
});
