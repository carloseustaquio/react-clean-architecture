import { ValidationComposite } from "@/validation/validators";
import { ValidationBuilder as Builder } from "@/validation/validators/builder/validation-builder";
import { makeSignupValidation } from "./signup-validation-factory";

describe("SignupValidationFactory", () => {
  test("should make ValidationComposite with correct validation", () => {
    const composite = makeSignupValidation();
    expect(composite).toEqual(
      ValidationComposite.build([
        ...Builder.field("name").required().build(),
        ...Builder.field("email").required().email().build(),
        ...Builder.field("password").required().min(5).build(),
        ...Builder.field("passwordConfirmation").required().min(5).build(),
      ])
    );
  });
});
