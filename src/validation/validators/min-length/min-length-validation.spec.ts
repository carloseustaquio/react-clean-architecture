import { InvalidFieldError } from "@/validation/errors/invalid-field-error";
import { MinLengthValidation } from "./min-length-validation";
import faker from "faker";

const makeSut = (field) => new MinLengthValidation(field, 6);

describe("MinLengthValidation", () => {
  test("Should return error if value is invalid", () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: faker.random.alphaNumeric(5) });
    expect(error).toEqual(new InvalidFieldError());
  });
  test("Should return falsy if value is valid", () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: faker.random.alphaNumeric(6) });
    expect(error).toBeFalsy();
  });
  test("Should return falsy if field doesn't exist in schema", () => {
    const sut = makeSut(faker.database.column());
    const error = sut.validate({
      [faker.database.column()]: faker.random.alphaNumeric(6),
    });
    expect(error).toBeFalsy();
  });
});
