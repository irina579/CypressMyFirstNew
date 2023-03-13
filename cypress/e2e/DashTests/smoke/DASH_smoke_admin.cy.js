describe("DASH smoke tests/Managements", 
//set enviroment variables for test suite
{
  env: {
    req_timeout: 30000,
    elem_timeout: 30000,
    user:'alex',
    //key:'pk_8777980_9C24F28JFIX3JDZ7RJ6GM7AN42D65TFF'
   // password: 'global'
  },
},
() => 
{ 
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  } 
  function SetTaskParameter(value,taskid) {
    cy.request({
      method: 'POST',
      url: 'https://api.clickup.com/api/v2/task/'+taskid+'/field/e83f89bd-9e0e-4bd7-a6a9-ec57f31d0e8e?custom_task_ids=true&team_id=4534343',
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
      url: 'https://api.clickup.com/api/v2/task/'+taskid+'/field/66d44793-a1bb-40d9-91b5-3b43bffe2f28?custom_task_ids=true&team_id=4534343',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cypress.env('key')
      },
      body: JSON.stringify({
        value: Math.floor(Date.now()), //unix timestamp
        value_options: {time: false}
      })
    })
    cy.log(Math.floor(Date.now()))

  } 
  const normalizeText = (s) => s.replace(/\s/g, '').toLowerCase()
    //clickup  
  let test_tasks=['DASHCU-3663','DASHCU-3664','DASHCU-3665']
  let states={
      onhold:'5099b5ec-242e-4f57-8cdc-b604e9e19e91',
      passed:'b254d03a-cb45-40af-82a3-c28d27c0b11f'
    }
  let run_date='66d44793-a1bb-40d9-91b5-3b43bffe2f28'  
  before(() => {
  for (let i=0;i<test_tasks.length;i++){
    SetTaskParameter(states['onhold'],test_tasks[i])
  }
  })
  beforeEach(() => { 
    cy.session('Login',()=>{
       cy.visit(Cypress.env('url_g'))
       cy.get('#UserName').type(Cypress.env('login_g'))
       cy.get('#Password').type(Cypress.env('password_g'))
       cy.contains('Log in').click()
       cy.get(".header-banner__close-button",{timeout: 40000}).click()}, 
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
     it.skip('Scroll into view test', () => {
        cy.contains('.link__title','Budgets & KPI').click()
        cy.contains('.card-name', 'Academy and Learning').scrollIntoView()
    })
    it('Manage site permissions', () => {
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
        cy.contains('.col-sm-6','Local Head of Workforce Planning').siblings('.col-sm-5').invoke('text').then((text => {
            expect(text.trim()).to.eq('')
        }));
        cy.contains('.btn','Save').should('not.have.attr', 'disabled') //save button is enabled after changes
        cy.get('.main-title').click()
        cy.contains('.btn','Cancel').click() //cancel the changes
        cy.contains('.btn','Save').should('have.attr', 'disabled') //verify Save disabled without changes
        SetTaskParameter(states['passed'],test_tasks[0])
    })
    context("Users", ()=>{
        beforeEach(() => {
            cy.contains('.link__title','Users').click()
            cy.url().should('include', '/Admin/Users')
        }) 
    it('Users=> Search tab', () => {
        cy.get('div> .search__input').type(`${Cypress.env('user')}`) //search for user
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
          SetTaskParameter(states['passed'],test_tasks[1])

        
    })
    it('Users=> Filter tab', () => {
        cy.contains('.tab-title', 'Filter').click()
        cy.contains('.header__label', 'Entity').next('div').first().click()
        cy.get("[value="+Cypress.env("site_id")+"]").click() //select site mentioned in config
        cy.get("[value="+Cypress.env("site_id")+"]").find('a').invoke('text').then((site => {
        cy.contains('.header__label', 'Group of permissions').next('div').first().click()

        let random_permission=getRandomInt(10)+1
        cy.get("[value="+random_permission+"]").click() //select site mentioned in config
        cy.get("[value="+random_permission+"]").find('a').invoke('text').then((permission => {
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
        )
        SetTaskParameter(states['passed'],test_tasks[2])
    })
    )
})
})






    
    
    
    
    
      

    })
    export{}