describe("DASH E2E tests/show_creation", () => {
    beforeEach(() => {
      cy.Login()
    })
    context("Show creation", ()=>{
      it("User can create Show", () => {
        cy.viewport(1680, 1050)
        let code='I8_6_30'




        cy.visit('http://10.94.6.100:105/ones/new/shows')
        cy.get(".search__input").type(code)
        cy.contains("Apply").click()
        cy.contains('.counters__item', 'Active').should('include.text','1')

        cy.contains(code).should("exist")
        //check of filled data
        let locator_id='training-courses-manage-shows-'+code.toLowerCase()+'-actions'
        cy.log(locator_id)
        cy.get('#'+locator_id+'>.actions__item').eq(0).click()
        cy.location("pathname").should("eq", '/ones/shows/add-edit/'+code)




        cy.readFile('cypress/fixtures/show_elements.json').then((data) => {
          const { StartDateText, EndDateText, ReleaseDateText, SecondaryLocationText,TPSLocationText,SecondaryProducerText } = data;
          // Use the stored element texts in assertions
          //Start date 
          cy.contains('.input-group__title','Start Date').next('div').should('have.text', StartDateText);
          //End date 
          cy.contains('.input-group__title','End Date').next('div').should('have.text', EndDateText);
          //Release date
       //   cy.contains('.input-group__title','Release Date').next('div').should('have.text', ReleaseDateText);
          //Secondary location
          cy.contains('.input-group__title','Secondary').next('div').should('have.text', SecondaryLocationText);
          //TPS location
          cy.contains('.input-group__title','TPS').next('div').should('have.text', TPSLocationText);
          //show inputs tab check
          cy.contains('.tabTitle', 'Show Inputs').click()
          //Primary producer
          cy.contains('.input-group__title','Primary Producer').next('div').should('include.text','glob')
          //Executive producer
          cy.contains('.input-group__title','Executive Producer').next('div').should('include.text','glob')
          //Secondary producer
          cy.contains('.input-group__title','Secondary Producer').next('div').should('have.text', SecondaryProducerText);
        });
      })    
    })
})
//export{}