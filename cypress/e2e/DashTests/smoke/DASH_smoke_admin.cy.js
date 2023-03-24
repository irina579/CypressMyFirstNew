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
  afterEach(function() { 
  // Check if the test failed
    cy.log(this.currentTest.state)
    cy.log(Cypress.currentTest.title)
    if (this.currentTest.state === 'passed') {
      cy.SetClickUpParameter((myObject.passed),task_id,Cypress.env('clickup_usage'))       // Mark the ClickUp task as failed
      cy.log('Test passed',task_id)
    }
    else {
      cy.SetClickUpParameter((myObject.failed),task_id,Cypress.env('clickup_usage'))
      cy.log('Test failed',task_id)
    }
  })
  it.skip('Scroll into view test', () => {
    task_id='DASHCU-3687'
    cy.contains('.link__title','Budgets & KPI').click()
    //cy.contains('.link__title','fbajbchbsacjhsabj').click() - for testing purposes
    cy.contains('.card-name', 'Academy and Learning').scrollIntoView()
  })
  it('Manage site permissions', () => { //https://app.clickup.com/t/4534343/DASHCU-3663
    task_id='DASHCU-3663'
    cy.contains('.link__title','Manage Sites Permissions').click()
    cy.url().should('include', '/UserPermission/Index')
    cy.contains('.btn','Save').should('have.attr', 'disabled') //verify Save disabled until changes are done
    cy.get('div .Vheader-select').click()
    cy.get("[value="+Cypress.env("site_id")+"]").click() //select site mentioned in config
    cy.contains('.col-sm-6','Local Head of Workforce Planning').siblings('.col-sm-1').click()
    cy.get('ul>.select-all').find('label').click() //select all
    cy.contains('.col-sm-6','Local Head of Workforce Planning').siblings('.col-sm-5').contains(/[a-z]+/)
    cy.get('ul>.select-all').find('label').click() //unselect all
    //verify users are removed
    cy.contains('.col-sm-6','Local Head of Workforce Planning').siblings('.col-sm-5').invoke('text').then((text) => {
        expect(text.trim()).to.eq('')
    });
    cy.contains('.btn','Save').should('not.have.attr', 'disabled') //save button is enabled after changes
    cy.get('.main-title').click()
    cy.contains('.btn','Cancel').click() //cancel the changes
    cy.contains('.btn','Save').should('have.attr', 'disabled') //verify Save disabled without changes
    // SetTaskParameter(states['passed'],test_tasks[0])
  //  cy.SetClickUpParameter((myObject.passed),test_tasks[0],Cypress.env('clickup_usage'))
  })
  context("Users", ()=>{
    beforeEach(() => {
      cy.contains('.link__title','Users').click()
      cy.url().should('include', '/Admin/Users')
    }) 
    it.only('Users=> Search tab', () => { //https://app.clickup.com/t/4534343/DASHCU-3664
      task_id='DASHCU-3664'
      cy.get('div> .search__input').type(`${Cypress.env('user')}`, {delay: 1000}) //search for user
      cy.intercept('GET', '**/api//UserPermissionApi/FindUsers?userNameOrEmail*').as('grid_list')
      cy.contains('.btn','Apply').click()
      cy.wait('@grid_list',{requestTimeout:`${Cypress.env('req_timeout')}`}).then(({response}) => {
        expect(response.statusCode).to.eq(200)
        let user_count=response.body.length
        let FirstName
        if(user_count>0){
          cy.contains('.btn','Authorise').click() //mostly to wait the UI is loaded
          cy.contains('.VNotification__message','Please select the user(s).').should('exist')
          cy.contains('.btn','Ok').click() //close warming
          expect(JSON.stringify(response.body[getRandomInt(user_count)]).toLowerCase(),'There is a text matching search in random user').to.contain(`${Cypress.env('user')}`)
          FirstName=normalizeText(response.body[getRandomInt(user_count)].userName) //store any random user
          cy.log(FirstName)
          cy.contains('.row__column', FirstName).scrollIntoView() //scroll to this user on UI to make sure he exists
          cy.get('.ui-checkbox_default').eq(1).scrollIntoView().click()
          cy.contains('.btn','Delete').click() //check Delete button action
          cy.get('.VNotification__message').should('exist')
          cy.contains('.btn','Cancel').click()
          cy.contains('.btn','Reset').click() //Reset search
          cy.get('div .users-row').should('not.exist')         
        }
        cy.log("The number of users came from BE after search- "+user_count)
      })
     // cy.SetClickUpParameter((myObject.passed),test_tasks[1],Cypress.env('clickup_usage'))
    })
    it('Users=> Filter tab', () => { //https://app.clickup.com/t/4534343/DASHCU-3665
      task_id='DASHCU-3665'
      cy.contains('.tab-title', 'Filter').click()
      cy.contains('.header__label', 'Entity').next('div').first().click()
      cy.get("[value="+Cypress.env("site_id")+"]").click() //select site mentioned in config
      cy.get("[value="+Cypress.env("site_id")+"]").find('a').invoke('text').then((site) => {
        cy.contains('.header__label', 'Group of permissions').next('div').first().click()
        let random_permission=getRandomInt(10)+1
        cy.get("[value="+random_permission+"]").click() //select random permission
        cy.get("[value="+random_permission+"]").find('a').invoke('text').then((permission) => {
          //expect(text.trim()).to.eq('')
          cy.log(permission)
          cy.intercept('GET', '**/api/UserPermissionApi/GetUsersByFilter?entityId*').as('grid_list') 
          cy.contains('.btn','Apply').click()
          cy.wait('@grid_list',{requestTimeout:`${Cypress.env('req_timeout')}`}).then(({response}) => {
            expect(response.statusCode).to.eq(200)
            let user_count=response.body.length
            if(user_count>0){
              expect(JSON.stringify(response.body[getRandomInt(user_count)]).toLowerCase(),'There is a text matching filtered site').to.contain(site.toLowerCase().trim())
              expect(JSON.stringify(response.body[getRandomInt(user_count)]).toLowerCase(),'There is a text matching filtered permission').to.contain(permission.toLowerCase().trim())
              cy.get('.ui-checkbox_default').eq(1).scrollIntoView().click()
              cy.contains('.btn','Delete').click() //check Delete button action
              cy.get('.VNotification__message').should('exist')
              cy.contains('.btn','Cancel').click()
              cy.contains('.btn','Reset').click() //Reset search
              cy.get('div .users-row').should('not.exist')         
            }
            cy.log("The number of users came from BE after search- "+user_count)
          })
        })      
      })
     // cy.SetClickUpParameter((myObject.passed),test_tasks[2],Cypress.env('clickup_usage'))
    })
  })
})
    //export{}