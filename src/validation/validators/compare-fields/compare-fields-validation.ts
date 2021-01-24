import { InvalidFieldError } from "@/validation/errors/invalid-field-error";
import { FieldValidation } from "@/validation/protocols/field-validation";

export class CompareFieldsValidation implements FieldValidation {
  constructor(readonly field: string, readonly fieldToCompare: string) {}
  // eslint-disable-next-line @typescript-eslint/ban-types
  validate(input: object): Error {
    return input[this.field] !== input[this.fieldToCompare]
      ? new InvalidFieldError()
      : null;
  }
}
