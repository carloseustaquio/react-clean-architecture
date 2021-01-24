import { RequiredFieldError } from "@/validation/errors";
import { FieldValidation } from "@/validation/protocols/field-validation";

export class RequiredFieldValidation implements FieldValidation {
  constructor(readonly field: string) {}
  // eslint-disable-next-line @typescript-eslint/ban-types
  validate(input: object): Error {
    return input[this.field] ? null : new RequiredFieldError();
  }
}
