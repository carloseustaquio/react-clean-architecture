import { fireEvent, screen } from "@testing-library/react";
import faker from "faker";

export const expectInvalidStatus = (
  fieldName: string,
  validationError: string
): void => {
  const { wrap, field, label } = getFieldStatus(fieldName);
  expect(wrap).toHaveAttribute("data-status", "invalid");
  expect(field).toHaveProperty("title", validationError);
  expect(label).toHaveProperty("title", validationError);
};

export const expectValidStatus = (fieldName: string): void => {
  const { wrap, field, label } = getFieldStatus(fieldName);
  expect(wrap).toHaveAttribute("data-status", "valid");
  expect(field).toHaveProperty("title", "");
  expect(label).toHaveProperty("title", "");
};

const getFieldStatus = (
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
