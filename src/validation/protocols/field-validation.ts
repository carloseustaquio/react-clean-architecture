export interface FieldValidation {
  field: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  validate(input: object): Error;
}
