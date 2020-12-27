import { FieldValidationSpy } from "../test/mock-field-validation";
import { ValidationComposite } from "./validation-composite";
import faker from "faker";

type SutTypes = {
  sut: ValidationComposite;
  fieldValidationSpies: FieldValidationSpy[];
};

const makeSut = (fieldName: string): SutTypes => {
  const fieldValidationSpies = [
    new FieldValidationSpy(fieldName),
    new FieldValidationSpy(fieldName),
  ];

  const sut = new ValidationComposite(fieldValidationSpies);
  return {
    sut,
    fieldValidationSpies,
  };
};

describe("ValidationComposite", () => {
  test("should return falsy if there is no error", () => {
    const fieldName = faker.database.column();
    const { sut, fieldValidationSpies } = makeSut(fieldName);
    const errorMessage = faker.random.words();
    fieldValidationSpies[0].error = new Error(errorMessage);
    fieldValidationSpies[1].error = new Error(faker.random.words());

    const error = sut.validate(fieldName, faker.random.word());
    expect(error).toBe(errorMessage);
  });

  test("should return if validation pass", () => {
    const fieldName = faker.database.column();
    const { sut } = makeSut(fieldName);
    const error = sut.validate(fieldName, faker.random.word());
    expect(error).toBeFalsy();
  });
});