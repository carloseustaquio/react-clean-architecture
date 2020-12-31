import { Validation } from "@/presentation/protocols/validation";

export class ValidationStub implements Validation {
  errorMessage: string;

  validate(_fieldName: string, _fieldValue: string): string {
    return this.errorMessage;
  }
}
