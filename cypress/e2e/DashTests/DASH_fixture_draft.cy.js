/// /reference types="cypress" />

/// JSON fixture file can be loaded directly using
// the built-in JavaScript bundler
//const requiredExample = require('../../fixtures/notifications')

context('Files', () => {
    beforeEach(() => {
      cy.visit('http://10.94.6.100/')
      cy.get('#UserName').type('show')
      cy.get('#Password').type('show')
      cy.contains('Log in').click()
      cy.wait(10000)
  
      //write a fixture file
      cy.request('GET','http://10.94.6.100/api/NotificationApi/GetNotifications')
        .then((response) => {
          cy.writeFile('cypress/fixtures/notifications_write.json', response.body)
        })
  
    })
  
    beforeEach(() => {
      // load example.json fixture file and store
      // in the test context object
      cy.fixture('notifications.json').as('notifications')
    })
  
    it('cy.fixture() - load a fixture', () => {
      // https://on.cypress.io/fixture
  
      // Instead of writing a response inline you can
      // use a fixture file's content.
  
      // when application makes an Ajax request matching "GET **/comments/*"
      // Cypress will intercept it and reply with the object in `example.json` fixture
     // cy.intercept('GET', '**/api/NotificationApi/GetNotifications', { fixture: 'notifications.json' }).as('getComment')
      cy.intercept('GET', '**/NotificationApi/*', { fixture: 'notifications.json' }).as('getComment')
      // we have code that gets a comment when
      // the button is clicked in scripts.js
      //cy.get('.fixture-btn').click()
      cy.contains('.link__title', 'Notification Center').click()
  
      cy.wait('@getComment').its('response.body')
        .should('have.property', 'status')
        .and('include', 'success')
    })
  
    
    })
  