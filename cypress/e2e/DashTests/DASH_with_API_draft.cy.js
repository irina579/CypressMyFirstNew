describe("DASH API samples", 
//set enviroment variables for test suite
{
    env: {
      url: 'http://10.94.6.100',
      login: 'global',
      password: 'global'
    },
  },
() => {
  
    beforeEach(() => {
      cy.visit(`${Cypress.env('url')}`)
      cy.get('#UserName').type(`${Cypress.env('login')}`)
      cy.get('#Password').type(`${Cypress.env('password')}`)
      cy.contains('Log in').click()
      cy.get(".header-banner__close-button").click()
    })
    it.skip("API works", () => {
        cy.url().should('include', '/Home/Homepage')
        cy.contains('Welcome back').should('be.visible')
        
        //sample of API request
        cy.request('POST', `${Cypress.env('url')}/api/KPI`, { siteId:20002, departmentId:20016, year:2023, snapshotId:0, isIdl:false}).then(
          (response) => {
            // response.body is automatically serialized into JSON
            expect(response.body).to.have.property('status', 'success') // true
          }
        )
        cy.request('GET', `${Cypress.env('url')}/api/NotificationApi/GetNotifications`).then(
        (response) => {
        // response.body is automatically serialized into JSON
        expect(response.body).to.have.property('status', 'success') // true
        expect(response.status).to.eq(200) //status 200
        expect(response.body.status).to.eq('success')

        let category=response.body.reference.categories[1].name
        cy.log('category='+category)
        expect(response.body.reference.notifications.actual).to.have.length(15)
        expect(response.body.reference).to.have.property('categories')
        expect(response.body.reference).to.have.property('labels')
        expect(response.body.reference.categories[0]).to.have.property('name','WFP rules')



        }
     )


      })
    

    })
    export{}