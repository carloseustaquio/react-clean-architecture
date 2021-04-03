import React from "react";
import faker from "faker";
import { fireEvent, render, RenderResult } from "@testing-library/react";
import Input from "./input";
import { FormContext } from "@/presentation/contexts";

const makeSut = (fieldName: string): RenderResult => {
  return render(
    <FormContext.Provider value={{ state: { errors: { field: "" } } }}>
      <Input name={fieldName} />
    </FormContext.Provider>
  );
};

describe("Input Component", () => {
  test("should begin with readOnly", () => {
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName);
    const input = sut.getByTestId(fieldName) as HTMLInputElement;
    expect(input.readOnly).toBe(true);
  });
  test("should remove readOnly on focus", () => {
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName);
    const input = sut.getByTestId(fieldName) as HTMLInputElement;
    fireEvent.focus(input);
    expect(input.readOnly).toBe(false);
  });
  test("should focus input on label click", () => {
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName);
    const input = sut.getByTestId(fieldName);
    const label = sut.getByTestId(`${fieldName}-label`);
    fireEvent.click(label);
    expect(document.activeElement).toBe(input);
  });
});
