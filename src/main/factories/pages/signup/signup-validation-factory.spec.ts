import {
  EmailValidation,
  MinLengthValidation,
  RequiredFieldValidation,
  ValidationComposite,
  CompareFieldsValidation,
} from "@/validation/validators";
import { makeSignupValidation } from "./signup-validation-factory";

describe("SignupValidationFactory", () => {
  test("should make ValidationComposite with correct validation", () => {
    const composite = makeSignupValidation();
    expect(composite).toEqual(
      ValidationComposite.build([
        new RequiredFieldValidation("name"),
        new RequiredFieldValidation("email"),
        new EmailValidation("email"),
        new RequiredFieldValidation("password"),
        new MinLengthValidation("password", 5),
        new RequiredFieldValidation("passwordConfirmation"),
        new CompareFieldsValidation("passwordConfirmation", "password"),
      ])
    );
  });
});
