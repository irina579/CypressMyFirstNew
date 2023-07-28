// cypress/support/index.js

let Code = "initialValue"; // Your initial value here

before(() => {
  // Define your global variable here
  Cypress.env("Code", Code);
});

// cypress/integration/your_test_spec.js

describe("Your Test Suite", () => {
    it("Test 1", () => {
      // Use the custom command to update the global variable
      cy.log(Cypress.env("Code"))
      cy.updateGlobalVar("Code","newUpdatedValue");
      cy.log(Cypress.env("Code"))
      // Perform your test steps...
    });
  
    it("Test 2", () => {
      // Access the updated global variable here
      //const updatedValue = Cypress.env("globalVar");
      cy.log(Cypress.env("Code")); // This should log "newUpdatedValue"
  
      // Perform your test steps...
    });
  });
  