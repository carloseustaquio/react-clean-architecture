import faker from "faker";
import * as FormHelper from "../support/form-helper";
import * as Http from "../support/login-mocks";

const populateFields = (): void => {
  cy.getByTestId("email").focus().type(faker.internet.email());
  cy.getByTestId("password").focus().type(faker.internet.password(6));
};

const simulateValidSubmit = (): void => {
  populateFields();
  cy.getByTestId("submit").click();
};

describe("login", () => {
  beforeEach(() => {
    cy.visit("login");
  });

  it("should load with correct initial state", () => {
    cy.getByTestId("email").should("have.attr", "readonly");
    FormHelper.testInputStatus("email", "Campo obrigatório");

    cy.getByTestId("password").should("have.attr", "readonly");
    FormHelper.testInputStatus("password", "Campo obrigatório");

    cy.getByTestId("submit").should("have.attr", "disabled");
    cy.getByTestId("errorWrap").should("not.have.descendants");
  });

  it("should present error state if form is invalid", () => {
    cy.getByTestId("email").focus().type(faker.random.word());
    FormHelper.testInputStatus("email", "Valor inválido");

    cy.getByTestId("password").focus().type(faker.random.alphaNumeric(3));
    FormHelper.testInputStatus("password", "Valor inválido");

    cy.getByTestId("submit").should("have.attr", "disabled");
    cy.getByTestId("errorWrap").should("not.have.descendants");
  });

  it("should present valid state if form is valid", () => {
    cy.getByTestId("email").focus().type(faker.internet.email());
    FormHelper.testInputStatus("email");

    cy.getByTestId("password").focus().type(faker.internet.password(5));
    FormHelper.testInputStatus("password");

    cy.getByTestId("submit").should("not.have.attr", "disabled");
    cy.getByTestId("errorWrap").should("not.have.descendants");
  });

  it("should present InvalidCredentialsError if on 401", () => {
    Http.mockInvalidCredentialsError();
    simulateValidSubmit();
    FormHelper.testFormError("Credenciais inválidas");
    FormHelper.testUrl("/login");
  });

  it("should present UnexpectedError if 400, 404, 500", () => {
    Http.mockUnexpectedError();
    simulateValidSubmit();
    FormHelper.testFormError("Aconteceu um erro. Tente novamente mais tarde.");
    FormHelper.testUrl("/login");
  });

  it("should save Account if valid credentials are provided", () => {
    Http.mockOk();
    simulateValidSubmit();
    cy.getByTestId("form-error").should("not.exist");
    cy.getByTestId("spinner").should("not.exist");
    FormHelper.testUrl("/");
    FormHelper.testLocalStorageItem("4devs-account");
  });

  it("should not save Account if invalid return from api", () => {
    Http.mockInvalidData();
    simulateValidSubmit();
    FormHelper.testFormError("Aconteceu um erro. Tente novamente mais tarde.");
    FormHelper.testUrl("/login");
  });

  it("should prevent multiple submits", () => {
    Http.mockOk();
    populateFields();
    cy.getByTestId("submit").dblclick();
    FormHelper.testHttpCallsCount(1);
  });

  it("should not call api if form is invalid", () => {
    Http.mockOk();
    cy.getByTestId("email")
      .focus()
      .type(faker.internet.email())
      .type("{enter}");
    FormHelper.testHttpCallsCount(0);
  });
});
