import { InvalidFieldError } from "@/validation/errors/invalid-field-error";
import { MinLengthValidation } from "./min-length-validation";

describe("MinLengthValidation", () => {
  test("Should return error if value is invalid", () => {
    const sut = new MinLengthValidation("field", 6);
    const error = sut.validate("123");
    expect(error).toEqual(new InvalidFieldError());
  });
  test("Should return falsy if value is valid", () => {
    const sut = new MinLengthValidation("field", 6);
    const error = sut.validate("123456");
    expect(error).toBeFalsy();
  });
});
