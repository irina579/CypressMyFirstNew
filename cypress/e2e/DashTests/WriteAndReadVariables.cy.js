describe('Example Test', () => {
  it('should store and retrieve variables from a file', () => {
    const variable1 = 'Hello';
    const variable2 = 'World';

    // Write the variables to the file
    cy.writeVariablesToFile(variable1, variable2);

    // Read the variables from the file
    cy.readVariablesFromFile().then((storedVariables) => {
      // Access the stored variables
      const storedVariable1 = storedVariables.variable1;
      const storedVariable2 = storedVariables.variable2;

      // Use the stored variables
      expect(storedVariable1).to.equal(variable1);
      expect(storedVariable2).to.equal(variable2);
    });
  });
  it.only('should store and retrieve variables from a file', () => {
    cy.visit('http://10.94.6.100/')
    // Store the element text in variables
let element1Text;
let element2Text;

cy.get('.btn').invoke('text').then((text) => {
  element1Text = text;
});

cy.get('.btn').invoke('text').then((text) => {
  element2Text = text;
});

// Write the variables to a file
cy.then(() => {
  const data = {
    element1Text,
    element2Text
  };

  const jsonData = JSON.stringify(data);
  cy.writeFile('cypress/fixtures/elements.json', jsonData);
});

// Later in the test...
cy.readFile('cypress/fixtures/elements.json').then((data) => {
  const { element1Text, element2Text } = data;

  // Use the stored element texts in assertions
  cy.get('.btn').should('have.text', element1Text);
  cy.get('.btn').should('have.text', element2Text);
});


  });
});
