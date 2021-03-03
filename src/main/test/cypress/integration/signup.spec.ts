import * as FormHelper from "../support/form-helper";

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
});
