import { Validation } from "@/presentation/protocols/validation";

export class ValidationStub implements Validation {
  errorMessage: string;

  // eslint-disable-next-line @typescript-eslint/ban-types
  validate(_fieldName: string, _input: object): string {
    return this.errorMessage;
  }
}
