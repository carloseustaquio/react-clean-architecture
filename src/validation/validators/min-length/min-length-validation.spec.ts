import { InvalidFieldError } from "@/validation/errors/invalid-field-error";
import { MinLengthValidation } from "./min-length-validation";
import faker from "faker";

const makeSut = () => new MinLengthValidation(faker.database.column(), 6);

describe("MinLengthValidation", () => {
  test("Should return error if value is invalid", () => {
    const sut = makeSut();
    const error = sut.validate(faker.random.alphaNumeric(5));
    expect(error).toEqual(new InvalidFieldError());
  });
  test("Should return falsy if value is valid", () => {
    const sut = makeSut();
    const error = sut.validate(faker.random.alphaNumeric(6));
    expect(error).toBeFalsy();
  });
});
