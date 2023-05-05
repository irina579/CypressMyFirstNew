describe("DASH smoke tests/Admin", 
//set enviroment variables for test suite
{
  env: {
    req_timeout: 60000,
    elem_timeout: 80000,
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
  let test_tasks=['DASHCU-3663','DASHCU-3664','DASHCU-3665', 'DASHCU-3772', 'DASHCU-3773', 'DASHCU-3779', 'DASHCU-3783', 'DASHCU-3784', 'DASHCU-3831','DASHCU-3862']
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
  it('Contract admin page', () => { //https://app.clickup.com/t/4534343/DASHCU-3779
    task_id='DASHCU-3779'
    cy.contains('.link__title','Contract Admin').scrollIntoView().click()
    cy.url().should('include', '/Admin/Artists')
    cy.contains('.VInputFake__label', 'Username').parent(1).type(`${Cypress.env('user')}`, {delay: 1000})
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
          cy.get('[placeholder="Global ID"]').type(GlobalId, {delay: 1000})
          cy.contains('.VButton__text', 'Search').click()
          cy.get('div>.VTableRowContractAdmin').first().should('include.text',GlobalId)
        }
        cy.log("The number of users came from BE after search- "+user_count)
      })
  })
  context("Logs", ()=>{
    beforeEach(() => {
      cy.viewport(1680, 1050)
      cy.contains('.link__title','Logs').scrollIntoView().click()
      cy.url().should('include', '/upload/uploadlog')
    }) 
    it('Logs page => Upload Logs', () => { //https://app.clickup.com/t/4534343/DASHCU-3783
      task_id='DASHCU-3783'
      cy.contains('div>.table-header__value', 'Extract').should('exist') //verify the table header is visible
      cy.get('div>.reportrange-text').click()
      cy.get('div>.prev').first().click().click().click()
      cy.get('tr>td').first().click()
      cy.get('tr>td').last().click()
      cy.contains('.applyBtn','Confirm').click()
      cy.intercept('GET','/api/ExtractUploadLog/**').as('grid_list')
      cy.contains('.btn','Apply').click()
      cy.wait('@grid_list',{requestTimeout:`${Cypress.env('req_timeout')}`}).then(({response}) => {
        expect(response.statusCode).to.eq(200)
        let logs_count=response.body.reference.length
        let file_name
        let uploaded_by
        if(logs_count>0){
          file_name=response.body.reference[0].file //store 1-st record's file title
          uploaded_by=response.body.reference[0].uploadedByName //store 1-st record's uploaded by info
          cy.contains('.table-column', file_name).first().scrollIntoView() //scroll to this log on UI to make sure it exists
          cy.contains('.table-column', uploaded_by).first().should('exist')
        }
      })
    })
    it('Logs page => Application Logs', () => { //https://app.clickup.com/t/4534343/DASHCU-3784
      task_id='DASHCU-3784'
      cy.contains('.btn__overflow', 'Upload Logs').click()
      cy.get('[value="Application Logs"]').click()
      cy.get('div>.reportrange-text').click()
      cy.get('div>.prev').first().click()
      cy.get('tr>td').first().click()
      cy.get('tr>td').last().click()
      cy.contains('.applyBtn','Confirm').click()
      cy.intercept('GET','/api/ExtractUploadLog/**').as('grid_list')
      cy.contains('.btn','Apply').click()
      cy.contains('div>.table-header__value', 'Event Name').should('exist') //verify the table header is visible
      cy.wait('@grid_list',{requestTimeout:`${Cypress.env('req_timeout')}`}).then(({response}) => {
        expect(response.statusCode).to.eq(200)
        let logs_count=response.body.reference.length
        let event_name
        let username
        if(logs_count>0){
          event_name=response.body.reference[0].eventName //store 1-st record's event name
          username=response.body.reference[0].username //store 1-st record's uploaded by info
          cy.contains('.table-column', event_name).first().scrollIntoView() //scroll to this log on UI to make sure it exists
          cy.contains('.table-column', username).first().should('exist')
        }
      })
    })
  })
  context("Settings", ()=>{
    beforeEach(() => {
      cy.contains('.link__title','Settings').scrollIntoView().click()
      cy.url().should('include', '/settings')
    }) 
    it('Settings page => Manage Multiple DM', () => { //https://app.clickup.com/t/4534343/DASHCU-3831
      task_id='DASHCU-3831'
      cy.contains('.tab-title', 'Manage Multiple DM').should('exist')
      cy.get('#VTab-btn-manage').should('have.class','VTab__btn_active') //verify Manage multiple DM is active by default
      cy.contains('.header__item','Sites').should('exist')
      cy.contains('.header__item','Departments').should('exist')
      cy.get('div>.body__row').first().should('exist')
      cy.contains('.VButton__text', 'Save').click()
      cy.contains('.toast-message','No changes made').should('exist') //save is not allowed without changes
      cy.get('div>.body__row').then(($table) => {
        let sites_count=$table.length
        let random_site_order=getRandomInt(sites_count)
        cy.log(random_site_order)
        cy.get('div>.item__arrow').eq(random_site_order).click()
        cy.get('div>.body__row').eq(random_site_order).then(($site) => {
          if ($site.find('span','(Generalist)').length>0){//generalist
            cy.log('Site is generalist')
            let depts_selected=$site.find('.item__departments').text()
            cy.log(depts_selected)
            cy.get("li>.ui-checkbox").last().should("have.class","disabled") //check last checkbox (as random) to be disabled
            cy.get('div>.VComboSearch__toggle').should("have.attr","disabled") //search is disabled
            cy.get("ul>.select-all").find('label').first().click()
            cy.get('div>.item__departments').eq(random_site_order).should('not.have.text',depts_selected) //the text is changed          
          }
          else {//not generalist
            cy.log('Site is not generalist')
            let depts_selected=$site.find('.item__departments').text()
            cy.log(depts_selected)
            cy.get("li>.ui-checkbox").last().scrollIntoView().click() //change the state of the last checkbox
            cy.get('div>.item__departments').eq(random_site_order).should('not.have.text',depts_selected) //the text is changed
            cy.get('div>.VComboSearch__toggle').type(Cypress.env('DL_dept')) //search for DL dept
            cy.get("li>.ui-checkbox").last().should('include.text',Cypress.env('DL_dept'))
          }
        })
      })
    })  
    it('Settings page => Manage Publish Days', () => { //https://app.clickup.com/t/4534343/DASHCU-3862
      task_id='DASHCU-3862'
      cy.contains('.tab-title', 'Manage Publish Days').click()
      cy.get('#VTab-btn-manage-days').should('have.class','VTab__btn_active') //verify Manage Publish Days gets active
      cy.contains('.VButton__text', 'Save').click()
      cy.contains('.toast-message','No changes made').should('exist') //save is not allowed without changes
      cy.get('label>.vueSlider').click()
      cy.contains('.VButton__text', 'Save').click()
      cy.contains('div','Are you sure you want to save changes?').should('exist') //warning
      cy.contains('.VButton__text', 'Cancel').click()
      cy.contains('div','Are you sure you want to save changes?').should('not.exist') //warning
      cy.contains('.VButton__text','Edit').click()
      cy.get('div>.select__label').next('div').click()
      const myFirstArray = []
      const mySecondArray= []   
      cy.get('div>.table__body').then(($default)=>{
        let default_count=$default.find('.day_disabled').length
        if (default_count>0){
          // store the elements with default days in the main page in array
          cy.get('div>.day_disabled').each(($el) => {
            myFirstArray.push($el.text().trim())                  
          })
          //store the checked days in 'edit default publish days' pop up
          cy.get('[value]').filter(':checked').next('label').each(($el) => {
            mySecondArray.push($el.text().trim())
          })
          .then(()=>{
                expect(myFirstArray).to.have.members(mySecondArray)  // compare the two arrays
          })
        }
        else{
          cy.get('[placeholder="Select days"]').should('exist')
        }
      })
      cy.contains('label','Select All').click()
      cy.get('[placeholder="Select days"]').should('not.exist')
      cy.get('div>.header__close').click()
    })  
  })
})