import { fireEvent, screen } from "@testing-library/react";
import faker from "faker";

export const testChildCount = (fieldName: string, count: number): void => {
  const el = screen.getByTestId(fieldName);
  expect(el.childElementCount).toBe(count);
};

export const testButtonIsDisabled = (
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = screen.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

export const expectInvalidStatus = (
  fieldName: string,
  validationError: string
): void => {
  const { wrap, field, label } = getFieldStatus(fieldName);
  expect(wrap.getAttribute("data-status")).toBe("invalid");
  expect(field.title).toBe(validationError);
  expect(label.title).toBe(validationError);
};

export const expectValidStatus = (fieldName: string): void => {
  const { wrap, field, label } = getFieldStatus(fieldName);
  expect(wrap.getAttribute("data-status")).toBe("valid");
  expect(field.title).toBeFalsy();
  expect(label.title).toBeFalsy();
};

export const getFieldStatus = (
  fieldName: string
): { wrap: HTMLElement; field: HTMLElement; label: HTMLElement } => {
  const wrap = screen.getByTestId(`${fieldName}-wrap`);
  const field = screen.getByTestId(`${fieldName}`);
  const label = screen.getByTestId(`${fieldName}-label`);
  return {
    wrap,
    field,
    label,
  };
};

export const populateField = (
  fieldName: string,
  value: string = faker.random.word()
): void => {
  const input = screen.getByTestId(fieldName);
  fireEvent.input(input, {
    target: { value: value },
  });
};

export const testElementExists = (fieldName: string): void => {
  const el = screen.getByTestId(fieldName);
  expect(el).toBeTruthy();
};

export const testTextContent = (fieldName: string, text: string): void => {
  const el = screen.getByTestId(fieldName);
  expect(el.textContent).toBe(text);
};
