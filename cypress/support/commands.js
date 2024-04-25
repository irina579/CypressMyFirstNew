// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//Sets resolution for click up and updates date
Cypress.Commands.add('SetClickUpParameter', (value, taskid,usage) => { 
  //clickup 
  if (usage){ 
    const run_date='66d44793-a1bb-40d9-91b5-3b43bffe2f28'
    const resolution='e83f89bd-9e0e-4bd7-a6a9-ec57f31d0e8e'  
    cy.request({
      method: 'POST',
      url: 'https://api.clickup.com/api/v2/task/'+taskid+'/field/'+resolution+'?custom_task_ids=true&team_id=4534343',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cypress.env('key')
      },
      body: JSON.stringify({
        value: [
          value //pass test
        ]
      })
    })
    cy.request({ //set up date_run field
      method: 'POST',
      url: 'https://api.clickup.com/api/v2/task/'+taskid+'/field/'+run_date+'?custom_task_ids=true&team_id=4534343',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cypress.env('key')
      },
      body: JSON.stringify({
        value: Math.floor(Date.now()), //unix timestamp
        value_options: {time: true}
      })
    })
  }
})
Cypress.Commands.add('Login', () => { 
  cy.session('Login',()=>{
    cy.visit(Cypress.env('url_g'))
    cy.get('#UserName').type(Cypress.env('login_g'))
    cy.get('#Password').type(Cypress.env('password_g'))
    cy.contains('Log in').click()
    cy.get(".header-banner__close-button", {timeout: 60000}).click({timeout: 100000})},
    {cacheAcrossSpecs: true}
  ) 
  cy.visit(Cypress.env('url_g'))
      //    //regular login
      // cy.visit(Cypress.env('url_g'))
      // cy.get('#UserName').type(Cypress.env('login_g'))
      // cy.get('#Password').type(Cypress.env('password_g'))
      // cy.contains('Log in').click()
      // cy.get(".header-banner__close-button",{timeout: `${Cypress.env('elem_timeout')}`}).click()
})
// commands.js
Cypress.Commands.add('writeVariablesToFile', (variable1, variable2) => {
  const data = { variable1, variable2 };
  const jsonData = JSON.stringify(data);
  cy.writeFile('cypress/fixtures/variables.json', jsonData);
});


Cypress.Commands.add('readVariablesFromFile', () => {
  cy.readFile('cypress/fixtures/variables.json').then(data => {
    return data;
  });
});
Cypress.Commands.add('ShowPublish', (BU, Discipline, Site, SeniotitySplit) => { 
  cy.contains('.btn__overflow','File').click()
  cy.contains('a','Publish').click()
  cy.contains('.tab-title', BU).click()
  cy.contains('label', Site).click()
  cy.get('.VPopup__content .VTab__tab:not([style="display: none;"])').find('label').contains(Discipline).click()
  cy.contains('.VButton__text','Send').click()
  if(SeniotitySplit){
    cy.contains('.header__title', 'Seniority split distribution').should('exist')
    cy.contains('Note! The Seniority Split rule for the requested Ones has not been observed among the following Disciplines').should('exist')
    cy.contains('.VButton__text','Confirm').click()
  }
});
Cypress.Commands.add("updateGlobalVar", (GlobalVar,newValue) => {
  Cypress.env(GlobalVar, newValue);
});



