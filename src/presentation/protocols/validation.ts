/* eslint-disable @typescript-eslint/ban-types */
export interface Validation {
  validate(fieldName: string, fieldValue: string): string;
}
