describe('DASH login', () => {
   //cy.get('[data-test=new-todo]')
   //cy.get('[data-icon="pencil"]')// 
  it.only('Random value test', () => {
    let random_search=Math.random().toString(36).substring(2,4)
    cy.log(random_search)
    expect(5).to.be.gte(1)
  }) 
  it('Test new options', () => {
    cy.visit('https://belitsoft.com/')
    cy.scrollTo('bottom')
    cy.get('#quoteTextarea').focus()  
  })
  it('Scroll into view', () => {
     cy.visit('https://belitsoft.com/')
     cy.get('footer').scrollIntoView()
   })
  it.skip('DASH Scroll into view test', () => {
    cy.contains('.link__title','Budgets & KPI').click()
    //cy.contains('.link__title','fbajbchbsacjhsabj').click() - for testing purposes
    cy.contains('.card-name', 'Academy and Learning').scrollIntoView()
  })
  it.skip("API", () => {
    cy.visit(Cypress.env('https://mail.ru/')) 
    let url=cy.url()
     cy.log("URL"+url+"/"+cy.url().toString())
  })
  it.skip('Write response in file', () => {
    cy.visit('http://10.94.6.100/')
    cy.get('#UserName').type('global')
    cy.get('#Password').type('global')
    cy.contains('Log in').click()
    cy.url().should('include', '/Home/Homepage')
    cy.contains('Welcome back').should('be.visible')
    cy.request('GET','http://10.94.6.100/api/NotificationApi/GetNotifications')
      .then((response) => {
        cy.writeFile('cypress/fixtures/notifications.json', response.body) ///
      })
  })
})