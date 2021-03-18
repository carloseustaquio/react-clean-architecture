import * as Helper from "./http-mocks";

export const mockEmailInUseError = (): void =>
  Helper.mockForbiddenError(/signup/);
