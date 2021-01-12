import React from "react";
import { render, RenderResult } from "@testing-library/react";
import SignUp from "./signup";

type SutTypes = {
  sut: RenderResult;
};

const makeSut = (): SutTypes => {
  const sut = render(<SignUp />);
  return { sut };
};

const testChildCount = (
  sut: RenderResult,
  fieldName: string,
  count: number
): void => {
  const el = sut.getByTestId(fieldName);
  expect(el.childElementCount).toBe(count);
};

const testButtonIsDisabled = (
  sut: RenderResult,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
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

const getFieldStatus = (sut: RenderResult, fieldName: string): HTMLElement => {
  return sut.getByTestId(`${fieldName}-status`);
};

describe("SignUp Component", () => {
  test("Should start with initial state", () => {
    const validationError = "Campo obrigatórios";
    const { sut } = makeSut();
    testChildCount(sut, "errorWrap", 0);
    testButtonIsDisabled(sut, "submit", true);
    expectInvalidStatus(sut, "name", validationError);
    expectInvalidStatus(sut, "email", validationError);
    expectInvalidStatus(sut, "password", validationError);
    expectInvalidStatus(sut, "passwordConfirmation", validationError);
  });
});
