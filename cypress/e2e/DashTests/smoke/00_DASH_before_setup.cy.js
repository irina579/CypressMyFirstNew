describe("Settings to enable for new DB", 
{
  env: {
    req_timeout: 60000,
    elem_timeout: 80000,
    user:'global',
  },
},
() => 
{ 
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  } 
  const normalizeText = (s) => s.replace(/\s/g, '').toLowerCase()
  //clickup  
  let test_tasks=['DASHCU-4765','DASHCU-4766']
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
    cy.viewport(1680, 1050)
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
  context("Enable all required permissions and settings", ()=>{
    beforeEach(() => {
    }) 
    it('Enable permissions', () => { //https://app.clickup.com/t/4534343/DASHCU-4765
      task_id='DASHCU-4765'
      cy.contains('.link__title','Users').click()
      cy.url().should('include', '/Admin/Users')
      cy.get('div> .search__input').type(`${Cypress.env('user')}`, {delay: 1000}) //search for user
      //cy.intercept('GET', '**/api//UserPermissionApi/FindUsers?userNameOrEmail*').as('grid_list')
      cy.contains('.btn','Apply').click()
      cy.contains('.row__column','global').should('exist').click()
      cy.get('#VTab-btn-'+Cypress.env('bu')).should('exist').click()
      let changes=false //to track changes
      //select all sites and departments
      cy.get('body').then(($body) => {   
        let uncheckedCheckboxes = $body.find('div:contains("Select all").ui-checkbox > input:not(:checked)');
        let count = uncheckedCheckboxes.length;    
        if (count > 0) { // Check if there are unchecked checkboxes
            for (let i = 0; i < count; i++) {
                cy.get('div:contains("Select all").ui-checkbox > input:not(:checked)').first().next().scrollIntoView().click();
                
                // Re-fetch the unchecked checkboxes after each click to ensure the list is up-to-date
                cy.get('body').then(($body) => {
                    uncheckedCheckboxes = $body.find('div:contains("Select all").ui-checkbox > input:not(:checked)');
                    count = uncheckedCheckboxes.length;
                    cy.log(count);
                });
            }
            changes=true
        } else {
            cy.log("All sites and departments are set");
        }
        //select all permissions
        cy.get('body').then(($body) => {   
          let uncheckedCheckboxes = $body.find('.table-row-group__btns__checkbox> input:not(:checked)');
          let count = uncheckedCheckboxes.length;    
          if (count > 0) { // Check if there are unchecked checkboxes
              for (let i = 0; i < count; i++) {
                  cy.get('.table-row-group__btns__checkbox> input:not(:checked)').first().parent(1).scrollIntoView().click();
                  
                  // Re-fetch the unchecked checkboxes after each click to ensure the list is up-to-date
                  cy.get('body').then(($body) => {
                    uncheckedCheckboxes = $body.find('.table-row-group__btns__checkbox> input:not(:checked)');
                    count = uncheckedCheckboxes.length;
                    cy.log(count);
                  });
              } 
              changes=true
          } else {
              cy.log("All permissions are set");
          }
          if (changes){
            cy.contains('.VButton__text','Save').click()
            cy.contains('successfully saved').should('exist')
          }
        })
      })
    })
    it('Enable Publish Days', () => { //https://app.clickup.com/t/4534343/DASHCU-4766
      task_id='DASHCU-4766'
      cy.contains('.link__title','Settings').scrollIntoView().click()
      cy.url().should('include', '/settings')
      cy.contains('.tab-title', 'Manage Publish Days').click()
      cy.get('#VTab-btn-manage-days').should('have.class','VTab__btn_active') //verify Manage Publish Days gets active
      cy.get('.ui-checkbox_default').should('have.length',7)
      cy.get('div>.table__body').then(($default)=>{
        let default_count=$default.find('.day_disabled').length
        cy.log(default_count)
        if (default_count<7){
          cy.contains('.VButton__text','Edit').click()
          cy.get('div>.select__label').next('div').click()
          cy.get('body').then(($body) => {   
            if ($body.find('[placeholder="Select days"]').length>0){ //check if there are enabled permissions
              cy.contains('label','Select All').click() //click once to select all days
            }
            else{
              cy.contains('label','Select All').click().click() //click twice to unselect all and then select all
            }
            cy.get('[placeholder="Select days"]').should('not.exist')
            cy.get('div>.select__label').next('div').click()
            cy.contains('.VButton__text','Apply').click()
          })
        }
        else{
          cy.log('All days are publish days')
        }
      })     
    })
  })
})
