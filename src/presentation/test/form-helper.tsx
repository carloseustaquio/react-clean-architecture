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
  const fieldStatus = getFieldStatus(sut, fieldName);
  expect(fieldStatus.title).toBe(validationError);
  expect(fieldStatus.textContent).toBe("🔴");
};

export const expectValidStatus = (
  sut: RenderResult,
  fieldName: string
): void => {
  const fieldStatus = getFieldStatus(sut, fieldName);
  expect(fieldStatus.title).toBe("Tudo certo!");
  expect(fieldStatus.textContent).toBe("🟢");
};

export const getFieldStatus = (
  sut: RenderResult,
  fieldName: string
): HTMLElement => {
  return sut.getByTestId(`${fieldName}-status`);
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
