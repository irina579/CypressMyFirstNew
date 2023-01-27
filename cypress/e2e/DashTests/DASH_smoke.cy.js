describe("DASH smoke tests", () => {
    
    beforeEach(() => {
      cy.visit(Cypress.env('url_g'))
      //cy.xpath("button[contains(text(), 'Log in')]").click()
      cy.get('#UserName').type(Cypress.env('login_g'))
      cy.get('#Password').type(Cypress.env('password_g'))
      cy.contains('Log in').click()
      cy.get(".header-banner__close-button").click()
    })
    it("User can log in", () => {
        cy.url().should('include', '/Home/Homepage')
        cy.contains('Welcome back').should('be.visible')
      })
    context("Ones Unit", ()=>{
     it("Can open IDL Ones => Planning grid", () => {
        //cy.get(".link__title").contains("DL Dept. Ones").click()
        cy.xpath("//div[normalize-space(text()) = 'IDL Dept. Ones']").click()
        cy.url().should('include', '/idlones/new')
        cy.contains('.Vheader-text',"Dates").prev().click().as('departments_drdw')
        cy.contains("Select All").click() //checks all departments
        cy.get(".main-heading").click()
        cy.contains("Apply").click()
        cy.get(".item_artist").eq(0).should("exist")
        cy.get('@departments_drdw').click()
        cy.contains("Select All").click()
        cy.contains("label", Cypress.env('IDL_dept')).click() //checks 1 department
        cy.get(".main-heading").click()
        cy.contains("Apply").click()
        cy.get(".item_artist").eq(0).should("exist")
        cy.contains(".item__info__department-name",Cypress.env('IDL_dept')).should("exist")
      })
      it("Can open IDL Teams", () => {
        cy.xpath("//div[normalize-space(text()) = 'IDL Dept. Ones']").click()
        cy.contains(".tab-title", "Teams").click()
        cy.contains('.Vheader-text',"Dates").prev().click()
        cy.contains("Select All").click() //checks all departments
        cy.get(".main-heading").click()
        cy.contains("Apply").click()
        cy.get(".name__team").eq(0).should("exist")
        cy.get('[data-icon="pencil"]').should("not.exist")   
        cy.contains('.Vheader-text',"Dates").prev().click()
        cy.contains("Select All").click()
        cy.contains("label", Cypress.env('IDL_dept')).click() //checks 1 department
        cy.get(".main-heading").click()
        cy.contains("Apply").click()
        cy.get(".name__team").eq(0).should("exist")
        cy.get('[data-icon="pencil"]').eq(0).should("exist")   
      })
      it("Can open IDL Manager Lab", () => {
        cy.xpath("//div[normalize-space(text()) = 'IDL Dept. Ones']").click()
        cy.contains(".VTab__btn", "Manager Lab").click()
        cy.contains(".btn__overflow","Nothing selected").click()
        cy.contains("a",Cypress.env('IDL_dept')).click()
        cy.contains("Apply").click()
        cy.get(".approval-status").eq(0).should("exist") //checks there is an artist in the grid=>approval status
        cy.contains(".btn__overflow","File").should("exist") //checks if File button available
        cy.contains(".btn__overflow","Current State").click() //open snapshot dropdown
        //counts snapshots
        let CountSnap=0
        cy.get('[aria-labelledby="dropdownMenu1"]').find("li").its('length').then((n) => {
            cy.log("length="+n)
            if(n>10){
            CountSnap = 10
            }
            else if (n=0) {
            CountSnap = n  
            } 
            else {
            CountSnap = n-1  
            }
            cy.get('[aria-labelledby="dropdownMenu1"]').find("li").eq(CountSnap).click()
        })
       // cy.contains("Last updated by josie-c").click()
        cy.contains("Apply").click()
        cy.get(".approval-status").eq(0).should("exist") //checks there is an artist in the grid
        cy.contains(".btn__overflow","File").should("not.exist") //checks if File button UNavailable (read only mode)
      })
      it("Can open IDL Vacancies converted info", () => {
        cy.xpath("//div[normalize-space(text()) = 'IDL Dept. Ones']").click()
        cy.contains(".tab-title", "Vacancies converted info").click()
        cy.contains(".btn__overflow","Nothing selected").click()
        cy.contains("a",Cypress.env('IDL_dept')).click()
        cy.contains("Apply").click()
        cy.contains(".row__column","CH").eq(0).should("exist") //check if CH exists in table
      })
      it.only("Can open DL Ones => Planning grid", () => {
        //cy.get(".link__title").contains("DL Dept. Ones").click()
        cy.xpath("//div[normalize-space(text()) = 'DL Dept. Ones']").click()
        cy.url().should('include', '/ones/new')
        //checks if generalist or not
        
       cy.get(".v-select-grouped__toggle").then(($text1)=>{
        if (!Cypress.env('generalist').includes($text1.text().trim())){ //not generalist
          cy.contains('.Vheader-text',"Dates").prev().click()
          cy.contains("Select All").click() //checks all departments
          cy.get(".main-heading").click()  
        }
       })
        cy.contains("Apply").click()
        cy.get(".item_artist").eq(0).should("exist")
        cy.contains('.Vheader-text',"Dates").prev().click()
        cy.contains("Select All").click()
        cy.contains("label", Cypress.env('DL_dept')).click() //checks 1 department
        cy.get(".main-heading").click()
        cy.contains("Apply").click()
        cy.get(".item_artist").eq(0).should("exist")
        cy.get(".v-select-grouped__toggle").then(($text1)=>{
          if (!Cypress.env('generalist').includes($text1.text().trim())){ //not generalist
            cy.contains(".item__info__department-name",Cypress.env('DL_dept')).should("exist")
          }
        })
      })

      it.only("Can open DL Teams", () => {
        //cy.wait(10000)
        cy.xpath("//div[normalize-space(text()) = 'DL Dept. Ones']").click()
        cy.contains(".tab-title", "Teams").click()
        cy.wait(10000) //some delay to wait until notifications are loaded. Otherwise network error fails
        //checks if generalist or not
        cy.get(".v-select-grouped__toggle").then(($text1)=>{
          if (!Cypress.env('generalist').includes($text1.text().trim())){ //not generalist
            cy.contains('.Vheader-text',"Dates").prev().click()
            cy.contains("Select All").click() //checks all departments
            cy.get(".main-heading").click()  
          }
        })  
        cy.contains("Apply").click()  
        cy.get(".name__team").eq(0).should("exist")
        cy.contains('.Vheader-text',"Dates").prev().click()
        cy.contains("Select All").click()
        cy.contains("label", Cypress.env('DL_dept')).click() //checks 1 department
        cy.get(".main-heading").click()
        cy.contains("Apply").click()
        cy.get(".name__team").eq(0).should("exist")
        cy.get('[data-icon="pencil"]').eq(0).should("exist")   
      })
    })

    })
    export{}