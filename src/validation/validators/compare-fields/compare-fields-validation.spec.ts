import faker from "faker";
import { CompareFieldsValidation } from "./compare-fields-validation";
import { InvalidFieldError } from "@/validation/errors/invalid-field-error";

const makeSut = (
  field: string,
  fieldToCompare: string
): CompareFieldsValidation =>
  new CompareFieldsValidation(field, fieldToCompare);

describe("CompareFieldValidation", () => {
  test("Should return error if field values are different", () => {
    const field = faker.database.column();
    const fieldToCompare = "other-" + faker.database.column();
    const sut = makeSut(field, fieldToCompare);
    const error = sut.validate({
      [field]: faker.random.words(3),
      [fieldToCompare]: faker.random.words(4),
    });
    expect(error).toEqual(new InvalidFieldError());
  });

  test("Should return falsy if compare is valid", () => {
    const field = faker.database.column();
    const fieldToCompare = faker.database.column();
    const sut = makeSut(field, fieldToCompare);
    const value = faker.random.word();
    const error = sut.validate({
      [field]: value,
      [fieldToCompare]: value,
    });
    expect(error).toBeFalsy();
  });
});
