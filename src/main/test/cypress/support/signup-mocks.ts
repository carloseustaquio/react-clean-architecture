import * as Helper from "./http-mocks";
import faker from "faker";

export const mockEmailInUseError = (): void =>
  Helper.mockForbiddenError(/signup/);

export const mockUnexpectedError = (): void =>
  Helper.mockUnexpectedError(/signup/, "POST");

export const mockOk = (): void =>
  Helper.mockOk(/accessToken/, "POST", { accessToken: faker.random.uuid() });

export const mockInvalidData = (): void =>
  Helper.mockOk(/signup/, "POST", { invalid: faker.random.uuid() });
