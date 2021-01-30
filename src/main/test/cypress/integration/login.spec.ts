import faker from "faker";

const baseUrl: string = Cypress.config().baseUrl;

describe("login", () => {
  beforeEach(() => {
    cy.visit("login");
  });

  it("should load with correct initial state", () => {
    cy.getByTestId("email-wrap").should("have.attr", "data-status", "invalid");
    cy.getByTestId("email")
      .should("have.attr", "title", "Campo obrigatório")
      .should("have.attr", "readonly");
    cy.getByTestId("email-label").should(
      "have.attr",
      "title",
      "Campo obrigatório"
    );

    cy.getByTestId("password-wrap").should(
      "have.attr",
      "data-status",
      "invalid"
    );
    cy.getByTestId("password")
      .should("have.attr", "title", "Campo obrigatório")
      .should("have.attr", "readonly");
    cy.getByTestId("password-label").should(
      "have.attr",
      "title",
      "Campo obrigatório"
    );
  });

  it("should present error state if form is invalid", () => {
    cy.getByTestId("email").focus().type(faker.random.word());
    cy.getByTestId("email-wrap").should("have.attr", "data-status", "invalid");
    cy.getByTestId("email").should("have.attr", "title", "Valor inválido");
    cy.getByTestId("email-label").should(
      "have.attr",
      "title",
      "Valor inválido"
    );

    cy.getByTestId("password").focus().type(faker.random.alphaNumeric(3));
    cy.getByTestId("password-wrap").should(
      "have.attr",
      "data-status",
      "invalid"
    );
    cy.getByTestId("password").should("have.attr", "title", "Valor inválido");
    cy.getByTestId("password-label").should(
      "have.attr",
      "title",
      "Valor inválido"
    );

    cy.getByTestId("submit").should("have.attr", "disabled");
    cy.getByTestId("errorWrap").should("not.have.descendants");
  });

  it("should present valid state if form is valid", () => {
    cy.getByTestId("email").focus().type(faker.internet.email());
    cy.getByTestId("email-wrap").should("have.attr", "data-status", "valid");
    cy.getByTestId("email").should("not.have.attr", "title");
    cy.getByTestId("email-label").should("not.have.attr", "title");

    cy.getByTestId("password").focus().type(faker.internet.password(5));
    cy.getByTestId("password-wrap").should("have.attr", "data-status", "valid");
    cy.getByTestId("password").should("not.have.attr", "title");
    cy.getByTestId("password-label").should("not.have.attr", "title");

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

  it("should save AccessToken if valid credentials are provided", () => {
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

  it("should not save AccessToken if invalid return from api", () => {
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
    cy.getByTestId("password")
      .focus()
      .type(faker.internet.password(6))
      .type("{enter}");
    cy.getByTestId("spinner").should("not.exist");
    cy.getByTestId("form-error").should(
      "contain.text",
      "Aconteceu um erro. Tente novamente mais tarde."
    );
    cy.url().should("eq", `${baseUrl}/login`);
  });

  it("should prevent multiple submits", () => {
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
    ).as("request");
    cy.getByTestId("email").focus().type(faker.internet.email());
    cy.getByTestId("password").focus().type(faker.internet.password(6));
    cy.getByTestId("submit").dblclick();
    cy.get("@request.all").should("have.length", 1);
  });

  it("should not call api if form is invalid", () => {
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
    ).as("request");
    cy.getByTestId("email")
      .focus()
      .type(faker.internet.email())
      .type("{enter}");
    cy.get("@request.all").should("have.length", 0);
  });
});
