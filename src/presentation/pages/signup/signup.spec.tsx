import React from "react";
import { render, RenderResult } from "@testing-library/react";
import SignUp from "./signup";
import { Helper } from "@/presentation/test/";

type SutTypes = {
  sut: RenderResult;
};

const makeSut = (): SutTypes => {
  const sut = render(<SignUp />);
  return { sut };
};

describe("SignUp Component", () => {
  test("Should start with initial state", () => {
    const validationError = "Campo obrigatórios";
    const { sut } = makeSut();
    Helper.testChildCount(sut, "errorWrap", 0);
    Helper.testButtonIsDisabled(sut, "submit", true);
    Helper.expectInvalidStatus(sut, "name", validationError);
    Helper.expectInvalidStatus(sut, "email", validationError);
    Helper.expectInvalidStatus(sut, "password", validationError);
    Helper.expectInvalidStatus(sut, "passwordConfirmation", validationError);
  });
});
