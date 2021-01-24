import faker from "faker";

const baseUrl: string = Cypress.config().baseUrl;

describe("login", () => {
  beforeEach(() => {
    cy.visit("login");
  });

  it("should load with correct initial state", () => {
    cy.getByTestId("email").should("have.attr", "readonly");
    cy.getByTestId("email-status")
      .should("have.attr", "title", "Campo obrigatório")
      .should("contain.text", "🔴");

    cy.getByTestId("password").should("have.attr", "readonly");
    cy.getByTestId("password-status")
      .should("have.attr", "title", "Campo obrigatório")
      .should("contain.text", "🔴");
    cy.getByTestId("submit").should("have.attr", "disabled");
    cy.getByTestId("errorWrap").should("not.have.descendants");
  });

  it("should present error state if form is invalid", () => {
    cy.getByTestId("email").focus().type(faker.random.word());
    cy.getByTestId("email-status")
      .should("have.attr", "title", "Valor inválido")
      .should("contain.text", "🔴");

    cy.getByTestId("password").focus().type(faker.random.alphaNumeric(3));
    cy.getByTestId("password-status")
      .should("have.attr", "title", "Valor inválido")
      .should("contain.text", "🔴");

    cy.getByTestId("submit").should("have.attr", "disabled");
    cy.getByTestId("errorWrap").should("not.have.descendants");
  });

  it("should present valid state if form is valid", () => {
    cy.getByTestId("email").focus().type(faker.internet.email());
    cy.getByTestId("email-status")
      .should("have.attr", "title", "Tudo certo!")
      .should("contain.text", "🟢");

    cy.getByTestId("password").focus().type(faker.internet.password(5));
    cy.getByTestId("password-status")
      .should("have.attr", "title", "Tudo certo!")
      .should("contain.text", "🟢");

    cy.getByTestId("submit").should("not.have.attr", "disabled");
    cy.getByTestId("errorWrap").should("not.have.descendants");
  });

  it("should present error if invalid credentials are provided", () => {
    cy.getByTestId("email").focus().type(faker.internet.email());
    cy.getByTestId("password").focus().type(faker.internet.password(5));
    cy.getByTestId("submit").click();
    cy.getByTestId("errorWrap")
      .getByTestId("spinner")
      .should("exist")
      .getByTestId("form-error")
      .should("not.exist")
      .getByTestId("spinner")
      .should("not.exist")
      .getByTestId("form-error")
      .should("contain.text", "Credenciais inválidas");
    cy.url().should("eq", `${baseUrl}/login`);
  });

  it("should present save AccessToken if valid credentials are provided", () => {
    cy.getByTestId("email").focus().type("caeu227@gmail.com");
    cy.getByTestId("password").focus().type("123456");
    cy.getByTestId("submit").click();
    cy.getByTestId("errorWrap")
      .getByTestId("spinner")
      .should("exist")
      .getByTestId("form-error")
      .should("not.exist")
      .getByTestId("spinner")
      .should("not.exist");
    cy.url().should("eq", `${baseUrl}/`);
    cy.window().then((window) =>
      assert.isOk(window.localStorage.getItem("accessToken"))
    );
  });
});
