describe("DASH E2E tests/show_creation", () => {
    beforeEach(() => {
      cy.Login()
    })
    context("Show creation", ()=>{
      it("User can create Show", () => {
        cy.get(".link__title").contains("Create New Show").click()
        cy.location("pathname").should("eq", "/ones/shows/add-edit")
        //set up show code variable
        let code='I'+new Date().getDate()+"_"+new Date().getMonth()+"_"+new Date().getUTCMinutes()
        cy.log("code="+code)   
        //Show Stats tab
        //show code
        cy.contains('.input-group__title', 'Code').next('div').type(code)
        //show name
        cy.contains('.input-group__title', 'Name').next('div').type(code)
        //show type category
        cy.contains('.input-group__title', 'Type').next('div').click()
        cy.contains('a','Awarded').click()
        //show status
        cy.contains('.input-group__title', 'Status').next('div').click()
        cy.contains('a','Active').click()
        //show Planning Category
        cy.contains('.input-group__title', 'Planning Category').next('div').click()
        cy.contains('a','Theatrical').click()
        //show Actual Category
        cy.contains('.input-group__title', 'Actual Category').next('div').click()
        cy.contains('a','Theatrical').click()
        //show color 
        cy.contains('.input-group__title', 'Show Color').next('div').click()
        cy.get('.tab__field .cp-input__input').clear()
        cy.get('.tab__field .cp-input__input').type("#27973C12")
        cy.contains('.btn','Ok').click()
        //assets amount
        cy.contains('.input-group__title', 'Amount of Assets').next('div').type(10)
        //shots amount
        cy.contains('.input-group__title', 'Amount of Shots').next('div').type(20)
        //start date
        cy.contains('.input-group__title','Start Date').next('div').click()
        cy.get('.today').click()
        cy.contains('button', 'Confirm').click()
        //end date
        cy.contains('.input-group__title','End Date').next('div').click()
        cy.get('.mx-btn-current-year').click()
        cy.contains(new Date().getFullYear()+1).click()
        cy.contains('td','Dec').click()
        cy.contains('td','31').click()
        cy.contains('button', 'Confirm').click()
        //release date
        cy.contains('.input-group__title','Release Date').next('div').click()
        cy.get('.mx-btn-current-year').click()
        cy.contains(new Date().getFullYear()+1).click()
        cy.contains('td','Dec').click()
        cy.contains('td','30').click()
        cy.contains('button', 'Confirm').click()
        //seniority split (for regular BU)
        cy.contains('.input-group__title', 'Artist %').next('div').type(10)
        cy.contains('.input-group__title', 'Key Artist %').next('div').type(20)
        cy.contains('.input-group__title', 'Lead %').next('div').type(30)
        cy.contains('.input-group__title', 'Supervisor %').next('div').type(40)
        //DL %
        cy.contains('.input-group__title', 'DL %').next('div').click().type('{backspace}').type('{backspace}').type(99)
        //show currency
        cy.contains('.input-group__title','Show Currency').next('div').click()
        cy.contains('a','USD ($)').click()
        //award est
        cy.contains('.input-group__title', 'Awards Est').next('div').type(99)
        //primary location
        cy.contains('.input-group__title','Primary').next('div').click()
        cy.get('ul>.VSelect__search').find('input').type('London')
        cy.contains('a','London (MPC)').click()
        //secondary location
        cy.contains('.input-group__title','Secondary').next('div').click()
        cy.get('ul').find('label').eq(0).click()
        cy.get('.header__title').click()
        //TPS location
        cy.contains('.input-group__title','TPS').next('div').click()
        cy.get('ul').find('label').eq(0).click()
        //Ones split
        cy.get('#training-course-show-primary-location>.input-group__input>.VInputFake_default-new').type(10)
        cy.get('#training-course-show-secondary-location-0>.input-group__input>.VInputFake_default-new').type(20)
        cy.get('#training-course-show-tps-location-0>.input-group__input>.VInputFake_default-new').type(70)
        //show inputs tab
        cy.contains('.tabTitle', 'Show Inputs').click()
        //Primary producer
        cy.contains('.input-group__title','Primary Producer').next('div').click()
        cy.get('input').type("glob")
        cy.contains('a','glob').click()
        //Secondary producer
        cy.contains('.input-group__title','Secondary Producer').next('div').click()
        cy.get('ul').find('label').eq(0).click()
        //Executive producer
        cy.contains('.input-group__title','Executive Producer').next('div').click()
        cy.get('.search__wrapper>input').type("glob")
        cy.contains('label','glob').click()
        //Period start date
        cy.get('.header__title').click()
        let N=0
        cy.get('.input-group__input_date-picker').its('length').then((n) => {
            N = n
            cy.log("length="+N)
            for (let i = 0; i < N; i++) {
              cy.get('.input-group__input_date-picker').eq(i).click()
              cy.get('.mx-date-row>.cell').not('.not-current-month').not('.disabled').eq(0).click()
              cy.contains("Confirm").click()
            }
          })
        //Confirm creation
        cy.contains('span', 'Create show').click()
        cy.location("pathname").should("eq", "/ones/new/shows")
        cy.get(".search__input").type(code)
        cy.contains("Apply").click()
        cy.contains(code).should("exist")
        })    
    })
})
//export{}