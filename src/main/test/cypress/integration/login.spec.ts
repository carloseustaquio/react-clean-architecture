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

  it("should present InvalidCredentialsError if on 401", () => {
    cy.intercept(
      {
        method: "POST",
        url: /login/,
      },
      {
        statusCode: 401,
        body: {
          error: faker.random.words(),
        },
      }
    );
    cy.getByTestId("email").focus().type(faker.internet.email());
    cy.getByTestId("password").focus().type(faker.internet.password(5));
    cy.getByTestId("submit").click();
    cy.getByTestId("spinner").should("not.exist");
    cy.getByTestId("form-error").should(
      "contain.text",
      "Credenciais inválidas"
    );
    cy.url().should("eq", `${baseUrl}/login`);
  });

  it("should present UnexpectedError if 400, 404, 500", () => {
    cy.intercept(
      {
        method: "POST",
        url: /login/,
      },
      {
        statusCode: faker.random.arrayElement([400, 500, 404]),
        body: {
          error: faker.random.words(),
        },
      }
    );
    cy.getByTestId("email").focus().type(faker.internet.email());
    cy.getByTestId("password").focus().type(faker.internet.password(5));
    cy.getByTestId("submit").click();
    cy.getByTestId("spinner").should("not.exist");
    cy.getByTestId("form-error").should(
      "contain.text",
      "Aconteceu um erro. Tente novamente mais tarde."
    );
    cy.url().should("eq", `${baseUrl}/login`);
  });

  it("should present save AccessToken if valid credentials are provided", () => {
    cy.intercept(
      {
        method: "POST",
        url: /login/,
      },
      {
        statusCode: 200,
        body: {
          accessToken: faker.random.uuid(),
        },
      }
    );
    cy.getByTestId("email").focus().type(faker.internet.email());
    cy.getByTestId("password").focus().type(faker.internet.password(6));
    cy.getByTestId("submit").click();
    cy.getByTestId("form-error").should("not.exist");
    cy.getByTestId("spinner").should("not.exist");
    cy.url().should("eq", `${baseUrl}/`);
    cy.window().then((window) =>
      assert.isOk(window.localStorage.getItem("accessToken"))
    );
  });

  it("should present save AccessToken if invalid return from api", () => {
    cy.intercept(
      {
        method: "POST",
        url: /login/,
      },
      {
        statusCode: 200,
        body: {
          invalidProperty: faker.random.uuid(),
        },
      }
    );
    cy.getByTestId("email").focus().type(faker.internet.email());
    cy.getByTestId("password").focus().type(faker.internet.password(6));
    cy.getByTestId("submit").click();
    cy.getByTestId("spinner").should("not.exist");
    cy.getByTestId("form-error").should(
      "contain.text",
      "Aconteceu um erro. Tente novamente mais tarde."
    );
    cy.url().should("eq", `${baseUrl}/login`);
  });
});
