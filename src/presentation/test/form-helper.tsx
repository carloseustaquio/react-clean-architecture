import { fireEvent, RenderResult } from "@testing-library/react";
import faker from "faker";

export const testChildCount = (
  sut: RenderResult,
  fieldName: string,
  count: number
): void => {
  const el = sut.getByTestId(fieldName);
  expect(el.childElementCount).toBe(count);
};

export const testButtonIsDisabled = (
  sut: RenderResult,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

export const expectInvalidStatus = (
  sut: RenderResult,
  fieldName: string,
  validationError: string
): void => {
  const { wrap, field, label } = getFieldStatus(sut, fieldName);
  expect(wrap.getAttribute("data-status")).toBe("invalid");
  expect(field.title).toBe(validationError);
  expect(label.title).toBe(validationError);
};

export const expectValidStatus = (
  sut: RenderResult,
  fieldName: string
): void => {
  const { wrap, field, label } = getFieldStatus(sut, fieldName);
  expect(wrap.getAttribute("data-status")).toBe("valid");
  expect(field.title).toBeFalsy();
  expect(label.title).toBeFalsy();
};

export const getFieldStatus = (
  sut: RenderResult,
  fieldName: string
): { wrap: HTMLElement; field: HTMLElement; label: HTMLElement } => {
  const wrap = sut.getByTestId(`${fieldName}-wrap`);
  const field = sut.getByTestId(`${fieldName}`);
  const label = sut.getByTestId(`${fieldName}-label`);
  return {
    wrap,
    field,
    label,
  };
};

export const populateField = (
  sut: RenderResult,
  fieldName: string,
  value: string = faker.random.word()
): void => {
  const input = sut.getByTestId(fieldName);
  fireEvent.input(input, {
    target: { value: value },
  });
};

export const testElementExists = (
  sut: RenderResult,
  fieldName: string
): void => {
  const el = sut.getByTestId(fieldName);
  expect(el).toBeTruthy();
};

export const testTextContent = (
  sut: RenderResult,
  fieldName: string,
  text: string
): void => {
  const el = sut.getByTestId(fieldName);
  expect(el.textContent).toBe(text);
};
