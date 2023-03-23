describe("DASH smoke tests/Admin", 
//set enviroment variables for test suite
{
  env: {
    req_timeout: 30000,
    elem_timeout: 30000,
    user:'alex',
  },
},
() => 
{ 
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  } 
  const normalizeText = (s) => s.replace(/\s/g, '').toLowerCase()
  //clickup  
  let test_tasks=['DASHCU-3663','DASHCU-3664','DASHCU-3665']
  let task_id=''
  const myObject = JSON.parse(Cypress.env('states'));
  before(() => {
  Cypress.session.clearAllSavedSessions()  
  for (let i=0;i<test_tasks.length;i++){
   // SetTaskParameter(states['onhold'],test_tasks[i])
    cy.SetClickUpParameter((myObject.onhold),test_tasks[i],Cypress.env('clickup_usage'))
  }
  })
  beforeEach(() => { 
    cy.session('Login',()=>{
       cy.visit(Cypress.env('url_g'))
       cy.get('#UserName').type(Cypress.env('login_g'))
       cy.get('#Password').type(Cypress.env('password_g'))
       cy.contains('Log in').click()
       cy.get(".header-banner__close-button",{timeout: 60000}).click()}, 
       {cacheAcrossSpecs: true}
     ) 
    cy.visit(Cypress.env('url_g'))
     //regular login
       // cy.visit(Cypress.env('url_g'))
       // cy.get('#UserName').type(Cypress.env('login_g'))
       // cy.get('#Password').type(Cypress.env('password_g'))
       // cy.contains('Log in').click()
       // cy.get(".header-banner__close-button",{timeout: `${Cypress.env('elem_timeout')}`}).click()
 
  })
  
  it('Upload test', () => {
    cy.contains('.link__title','Budgets & KPI').click()
    //cy.contains('.link__title','fbajbchbsacjhsabj').click() - for testing purposes
    cy.contains('.card-name', 'Academy and Learning').scrollIntoView()
  })
})