import faker from "faker";
import * as FormHelper from "../support/form-helper";
import * as Http from "../support/signup-mocks";

const simulateValidSubmit = (): void => {
  const password = faker.internet.password(7);
  cy.getByTestId("name").focus().type(faker.internet.email());
  cy.getByTestId("email").focus().type(faker.internet.email());
  cy.getByTestId("password").focus().type(password);
  cy.getByTestId("passwordConfirmation").focus().type(password);
  cy.getByTestId("submit").click();
};

describe("signup", () => {
  beforeEach(() => {
    cy.visit("signup");
  });

  it("should load with correct initial state", () => {
    cy.getByTestId("name").should("have.attr", "readonly");
    FormHelper.testInputStatus("name", "Campo obrigatório");
    cy.getByTestId("email").should("have.attr", "readonly");
    FormHelper.testInputStatus("email", "Campo obrigatório");
    cy.getByTestId("password").should("have.attr", "readonly");
    FormHelper.testInputStatus("password", "Campo obrigatório");
    cy.getByTestId("passwordConfirmation").should("have.attr", "readonly");
    FormHelper.testInputStatus("passwordConfirmation", "Campo obrigatório");
  });

  it("should present error state if form is invalid", () => {
    cy.getByTestId("email").focus().type(faker.random.word());
    FormHelper.testInputStatus("email", "Valor inválido");
    cy.getByTestId("password").focus().type(faker.random.alphaNumeric(3));
    FormHelper.testInputStatus("password", "Valor inválido");
    cy.getByTestId("passwordConfirmation")
      .focus()
      .type(faker.random.alphaNumeric(4));
    FormHelper.testInputStatus("passwordConfirmation", "Valor inválido");

    cy.getByTestId("submit").should("have.attr", "disabled");
    cy.getByTestId("errorWrap").should("not.have.descendants");
  });

  it("should present valid state if form is valid", () => {
    const password = faker.internet.password(5);
    cy.getByTestId("name").focus().type(faker.name.findName());
    FormHelper.testInputStatus("name");
    cy.getByTestId("email").focus().type(faker.internet.email());
    FormHelper.testInputStatus("email");
    cy.getByTestId("password").focus().type(password);
    FormHelper.testInputStatus("password");
    cy.getByTestId("passwordConfirmation").focus().type(password);
    FormHelper.testInputStatus("passwordConfirmation");
    cy.getByTestId("submit").should("not.have.attr", "disabled");
    cy.getByTestId("errorWrap").should("not.have.descendants");
  });

  it("should present EmailInUseError if on 403", () => {
    Http.mockEmailInUseError();
    simulateValidSubmit();
    FormHelper.testFormError("Email já está em uso");
    FormHelper.testUrl("/signup");
  });
});
