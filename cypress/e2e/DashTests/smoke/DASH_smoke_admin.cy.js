describe("DASH smoke tests/Admin", 
//set enviroment variables for test suite
{
  env: {
    req_timeout: 50000,
    elem_timeout: 50000,
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
  let test_tasks=['DASHCU-3663','DASHCU-3664','DASHCU-3665', 'DASHCU-3772', 'DASHCU-3773', 'DASHCU-3779']
  let task_id=''
  const myObject = JSON.parse(Cypress.env('states'));
  before(() => {
  Cypress.session.clearAllSavedSessions()  
  for (let i=0;i<test_tasks.length;i++){
    cy.SetClickUpParameter((myObject.onhold),test_tasks[i],Cypress.env('clickup_usage'))
  }
  })
  beforeEach(() => { 
    cy.Login()
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
  })
  context("Users", ()=>{
    beforeEach(() => {
      cy.contains('.link__title','Users').click()
      cy.url().should('include', '/Admin/Users')
    }) 
    it('Users=> Search tab', () => { //https://app.clickup.com/t/4534343/DASHCU-3664
      task_id='DASHCU-3664'
      cy.get('div> .search__input').type(`${Cypress.env('user')}`, {delay: 1000}) //search for user
      cy.intercept('GET', '**/api//UserPermissionApi/FindUsers?userNameOrEmail*').as('grid_list')
      cy.contains('.btn','Apply').click()
      cy.wait('@grid_list',{requestTimeout:`${Cypress.env('req_timeout')}`}).then(({response}) => {
        expect(response.statusCode).to.eq(200)
        let user_count=response.body.length
        let FirstName
        if(user_count>0){
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
    })
    it('Users => Create new user page (on button click)', () => { //https://app.clickup.com/t/4534343/DASHCU-3772
      task_id='DASHCU-3772'
      cy.contains('.VButton__text', 'Create new user').click()
      cy.url().should('include', '/Admin/Users/Edit')
      cy.contains('.tab-title',Cypress.env('bu'))
      cy.contains('.user-info__item__text','Username').next('div').first().type('test_user')
      cy.contains('.user-info__item__text','Email Address').next('div').first().type('test_user@gmail.com')
      cy.contains('.user-info__item__text','First Name').next('div').first().type('Bred')
      cy.contains('.user-info__item__text','Last Name').next('div').first().type('Pitt')
      cy.contains('.user-info__item__text','Comment').next('div').first().type('This is test user')
      cy.get('.user-info__item>.ui-checkbox').find('input').first().should('be.checked')
      cy.contains('.table-content__column__item__title', 'Site').should('exist')
      cy.contains('.table-content__column__item__title', 'Department').should('exist')
      cy.contains('.table-content__column__item__title', 'Indirect Department').should('exist')
      cy.contains('.table-header__title', 'Groups of permissions').should('exist')
      cy.contains('.VButton__text', 'Create').click()
      cy.contains('.toast-message', 'Please input Global ID').should('exist')
    })
  })
  it('Create new user page', () => { //https://app.clickup.com/t/4534343/DASHCU-3773
    task_id='DASHCU-3773'
    cy.contains('.link__title','Create New User').scrollIntoView().click()
    cy.url().should('include', '/Admin/Users/Edit')
    cy.contains('.tab-title',Cypress.env('bu'))
    cy.contains('.user-info__item__text','Username').next('div').first().type('test_user')
    cy.contains('.user-info__item__text','Email Address').next('div').first().type('test_user@gmail.com')
    cy.contains('.user-info__item__text','First Name').next('div').first().type('Bred')
    cy.contains('.user-info__item__text','Last Name').next('div').first().type('Pitt')
    cy.contains('.user-info__item__text','Global ID').next('div').first().type('1111111111')
    cy.contains('.user-info__item__text','Comment').next('div').first().type('This is test user')
    cy.get('.user-info__item>.ui-checkbox').find('input').first().should('be.checked')
    cy.contains('.table-content__column__item__title', 'Site').parent(1).find('label','Select all').first().click()
    cy.contains('.table-content__column__item__title', 'Department').parent(1).find('label','Select all').first().click()
    cy.contains('.table-content__column__item__title', 'Indirect Department').parent(1).find('label','Select all').first().click()
    cy.get('.table-row-group__btns>div>label').first().click({force:true})
    cy.contains('label', Cypress.env('DL_dept')).prev('input').should('be.checked')
    cy.contains('label', Cypress.env('IDL_dept')).prev('input').should('be.checked')
    cy.contains('label', Cypress.env('DL_dept')).prev('input').should('be.checked')
    cy.get('.table-row-group__btns>div>input').first().should('be.checked')
    cy.contains('.VButton__text', 'Create').click()
    cy.contains('div', "This global ID doesn't exist. Are you sure you want to proceed?").should('exist')
    cy.contains('.VButton__text','Cancel').click()
    cy.contains('div', "This global ID doesn't exist. Are you sure you want to proceed?").should('not.exist')
  })
  it.only('Contract admin page', () => { //https://app.clickup.com/t/4534343/DASHCU-3779
    task_id='DASHCU-3779'
    cy.contains('.link__title','Contract Admin').scrollIntoView().click()
    cy.url().should('include', '/Admin/Artists')
    cy.contains('.VInputFake__label', 'Username').parent(1).type(`${Cypress.env('user')}`)
    cy.intercept('POST','/api/Artists/GetArtistDetails/**').as('grid_list')
    cy.contains('.VButton__text', 'Search').click()
    cy.wait('@grid_list',{requestTimeout:`${Cypress.env('req_timeout')}`}).then(({response}) => {
      expect(response.statusCode).to.eq(200)
      let user_count=response.body.reference.artistsInfo.length
        let GlobalId
        if(user_count>0){
          cy.contains('.ContractAdmin__response-table-header', 'Artist Username').should('exist') //verify the table header is visible
          expect(JSON.stringify(response.body.reference.artistsInfo[getRandomInt(user_count)]).toLowerCase(),'There is a text matching search in random user').to.contain(`${Cypress.env('user')}`)
          GlobalId=response.body.reference.artistsInfo[getRandomInt(user_count)].globalId //store random globalId
          cy.log(GlobalId)
          cy.contains('.VTableRowContractAdmin__column', GlobalId).scrollIntoView() //scroll to this user on UI to make sure he exists
          cy.get('[placeholder="Global ID"]').type(GlobalId)
          cy.contains('.VButton__text', 'Search').click()
          cy.get('div>.VTableRowContractAdmin').first().should('include.text',GlobalId)
        }
        cy.log("The number of users came from BE after search- "+user_count)
      })















    // cy.contains('.user-info__item__text','Username').next('div').first().type('test_user')
    // cy.contains('.user-info__item__text','Email Address').next('div').first().type('test_user@gmail.com')
    // cy.contains('.user-info__item__text','First Name').next('div').first().type('Bred')
    // cy.contains('.user-info__item__text','Last Name').next('div').first().type('Pitt')
    // cy.contains('.user-info__item__text','Global ID').next('div').first().type('1111111111')
    // cy.contains('.user-info__item__text','Comment').next('div').first().type('This is test user')
    // cy.get('.user-info__item>.ui-checkbox').find('input').first().should('be.checked')
    // cy.contains('.table-content__column__item__title', 'Site').parent(1).find('label','Select all').first().click()
    // cy.contains('.table-content__column__item__title', 'Department').parent(1).find('label','Select all').first().click()
    // cy.contains('.table-content__column__item__title', 'Indirect Department').parent(1).find('label','Select all').first().click()
    // cy.get('.table-row-group__btns>div>label').first().click({force:true})
    // cy.contains('label', Cypress.env('DL_dept')).prev('input').should('be.checked')
    // cy.contains('label', Cypress.env('IDL_dept')).prev('input').should('be.checked')
    // cy.contains('label', Cypress.env('DL_dept')).prev('input').should('be.checked')
    // cy.get('.table-row-group__btns>div>input').first().should('be.checked')
    // cy.contains('.VButton__text', 'Create').click()
    // cy.contains('div', "This global ID doesn't exist. Are you sure you want to proceed?").should('exist')
    // cy.contains('.VButton__text','Cancel').click()
    // cy.contains('div', "This global ID doesn't exist. Are you sure you want to proceed?").should('not.exist')
  })
})