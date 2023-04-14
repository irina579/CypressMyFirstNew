describe("DASH smoke tests/Bid weeks upload", 
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
  beforeEach(() => { 
    cy.Login()
  })
  
  it('Upload test', () => { //Hardcoded for Mikros Animation and ASTX show
    cy.contains('.link__title','Show Ones',{timeout: `${Cypress.env('elem_timeout')}`}).click() //wait for loading
    cy.contains('.tab-title','Ones',{timeout: `${Cypress.env('elem_timeout')}`}).click() //wait for loading
      cy.get('#app').then(($body) => {   
        if ($body.find('div>.filter-view-current').length>0){ //check if default custom filter exists
          cy.contains("to see Ones content").should("not.exist")
          cy.get('.item__info__department-name').should('exist')
          cy.contains('.btn__overflow', 'MASTER').should('exist')
          cy.get('div>.filter-view-current__delete').click()
          cy.log('Clear default filter')
        }
      })
      cy.contains('.tab-title','Bid Weeks').click()
      cy.contains('.btn__overflow','Select show').click()
      cy.get('li.VSelect__search').first().parent().find('li').eq(4).click()
      cy.fixture('Bidweeks_Template.xlsx', { encoding: null }).as('myFixture')
      cy.get('input[type=file]').selectFile('@myFixture',{force: true})
      cy.contains('.uploader__btn','Upload').click()
      cy.contains('Upload successfully').should('exist')       
  })
})