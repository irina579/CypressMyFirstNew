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
        
        //sample of API request
        cy.request('POST', Cypress.env('url_g')+"/api/KPI", { siteId:20002, departmentId:20016, year:2023, snapshotId:0, isIdl:false}).then(
          (response) => {
            // response.body is automatically serialized into JSON
            expect(response.body).to.have.property('status', 'success') // true
          }
        )
        cy.request('GET', Cypress.env('url_g')+"/api/NotificationApi/GetNotifications").then(
          (response) => {
          // response.body is automatically serialized into JSON
          expect(response.body).to.have.property('status', 'success') // true
          }
       )


      })
    context("Ones Unit", ()=>{
      it.only("Can open IDL Ones => Planning grid", () => {
        //cy.get(".link__title").contains("DL Dept. Ones").click()
        cy.xpath("//div[normalize-space(text()) = 'IDL Dept. Ones']").click()
        cy.url().should('include', '/idlones/new')
        cy.contains(".v-filter__placeholder","Nothing selected").click()
        cy.contains("Select All").click() //checks all departments
        cy.get(".main-heading").click()
        cy.contains("Apply").click()
        cy.get(".item_artist").eq(0).should("exist")
        cy.contains(".v-filter__placeholder","Academy and Learning").click()
        cy.contains("Select All").click()
        cy.contains("label", "Production Management").click() //checks 1 department
        cy.get(".main-heading").click()
        cy.contains("Apply").click()
        cy.get(".item_artist").eq(0).should("exist")
        cy.contains(".item__info__department-name","Production Management").should("exist")
      })
      it("Can open IDL Teams", () => {
        cy.xpath("//div[normalize-space(text()) = 'IDL Dept. Ones']").click()
        cy.contains(".tab-title", "Teams").click()
        cy.contains(".v-filter__placeholder","Nothing selected").click()
        cy.contains("Select All").click() //checks all departments
        cy.get(".main-heading").click()
        cy.contains("Apply").click()
        cy.get(".name__team").eq(0).should("exist")
        cy.get('[data-icon="pencil"]').should("not.exist")   
        cy.contains(".v-filter__placeholder","Academy and Learning").click()
        cy.contains("Select All").click()
        cy.contains("label", "Production Management").click() //checks 1 department
        cy.get(".main-heading").click()
        cy.contains("Apply").click()
        cy.get(".name__team").eq(0).should("exist")
        cy.get('[data-icon="pencil"]').eq(0).should("exist")   
      })
      it("Can open IDL Manager Lab", () => {
        cy.xpath("//div[normalize-space(text()) = 'IDL Dept. Ones']").click()
        cy.contains(".VTab__btn", "Manager Lab").click()
        cy.contains(".btn__overflow","Nothing selected").click()
        cy.contains("a","Production Management").click()
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
        cy.contains("a","Production Management").click()
        cy.contains("Apply").click()
        cy.contains(".row__column","CH").eq(0).should("exist") //check if CH exists in table
        })




      it.skip("User can create Show", () => {
          //cy.wait(20000)
          cy.get(".link__title").contains("Create New Show").click()
          cy.location("pathname").should("eq", "/ones/shows/add-edit")
          //cy.wait(10000)

          //set up show code variable
          let code='I'+new Date().getDate()+"_"+new Date().getMonth()+"_"+new Date().getUTCMinutes()
          cy.log("code="+code)
                                    
          //show code
          cy.xpath("//div[contains(text(), 'Code')]/following::span").eq(0).click()
          cy.xpath("//div[contains(text(), 'Code')]/following::input").type(code)
          //show name
          cy.xpath("//div[contains(text(), 'Name')]/following::span").eq(0).click()
          cy.xpath("//div[contains(text(), 'Name')]/following::input").type(code)
          //show type category
          cy.xpath("//span[contains(text(), 'Awarded')]").click()
          cy.xpath("//a[contains(text(), 'Awarded')]").click()
          //show status
          cy.xpath("//div[contains(text(), 'Status')]/following::span").eq(0).click()
          cy.xpath("//a[contains(text(), 'Active')]").click()
          //show Planning Category
          cy.xpath("//div[normalize-space(text()) = 'Planning Category']/following::div").eq(0).click()
          cy.xpath("//a[contains(text(), 'Theatrical')]").click() 
          //show Actual Category
          cy.xpath("//div[normalize-space(text()) = 'Actual Category']/following::div").eq(0).click()
          cy.xpath("//a[contains(text(), 'Theatrical')]").click() 
          //show color ---the sample of aliases usage
          cy.xpath("//div[@class='toggle__label']").click()
          cy.xpath("//input[@class='cp-input__input']").eq(0).as("color").clear()
          cy.get("@color").type("#27973C12")
          cy.xpath("//span[@class='VButton__text' and contains(text(), 'Ok')]").click()
          //show currency
          cy.xpath("//div[contains(text(), 'Show Currency')]/following::div").eq(0).click()
          cy.xpath("//a[contains(text(), 'GBP (£)')]").click()
          //assets amount
          cy.xpath("//div[contains(text(), 'Amount of Assets')]/following::span").eq(0).click()
          cy.xpath("//div[contains(text(), 'Amount of Assets')]/following::input").type("50")
          //shots amount
          cy.xpath("//div[contains(text(), 'Amount of Shots')]/following::span").eq(0).click()
          cy.xpath("//div[contains(text(), 'Amount of Shots')]/following::input").type("50")
          //award est
          cy.xpath("//div[contains(text(), 'Awards Est')]/following::span").eq(0).click()
          cy.xpath("//div[contains(text(), 'Awards Est')]/following::input").type("50")
          //start date
          cy.contains("Start Date").next(".input-group__input").should("exist").click()
          //cy.get('td').find('.today').click()
          cy.xpath("//td[@class='cell today']").click()
          cy.contains("Confirm").click()
          //end date
          cy.contains("End Date").next(".input-group__input").should("exist").click()
          cy.xpath("//button[@class='mx-btn mx-btn-text mx-btn-current-year']").click()
          cy.xpath("//td[@data-year='2023']").click()
          cy.xpath("//td[@data-month='11']").click()
          cy.xpath("//td[@data-day='31']").click()
          cy.contains("Confirm").click()
          //seniority split
          cy.xpath("//div[normalize-space(text()) = 'Artist %']/following::span").eq(0).click()
          cy.xpath("//div[normalize-space(text()) = 'Artist %']/following::input").type("10")
          cy.xpath("//div[normalize-space(text()) = 'Key Artist %']/following::span").eq(0).click()
          cy.xpath("//div[normalize-space(text()) = 'Key Artist %']/following::input").type("20")
          cy.xpath("//div[normalize-space(text()) = 'Lead %']/following::span").eq(0).click()
          cy.xpath("//div[normalize-space(text()) = 'Lead %']/following::input").type("30")
          cy.xpath("//div[normalize-space(text()) = 'Supervisor %']/following::span").eq(0).click()
          cy.xpath("//div[normalize-space(text()) = 'Supervisor %']/following::input").type("40")
          //DL %
          //cy.xpath("//div[normalize-space(text()) = 'DL %']/following::span").eq(0).click()
          //cy.xpath("//div[normalize-space(text()) = 'DL %']/following::input").type("33")
          //primary location
          cy.contains("Primary").next(".input-group__input").should("exist").click()
          cy.xpath("//a[contains(text(), 'London')]").eq(0).click()
          //secondary location
          cy.contains("Secondary").next(".input-group__input").should("exist").click()
          cy.get('ul').find('label').eq(0).click()

          //show inputs tab
          cy.xpath("//span[contains(text(), 'Show Inputs')]").click()
          //Primary producer
          cy.contains("Primary Producer").next(".input-group__input").should("exist").click()
          cy.get('input').type("glob")
          cy.xpath("//a[contains(text(), 'glob')]").click()
          //Secondary producer
          cy.contains("Secondary Producer").next(".input-group__input").should("exist").click()
          cy.get('ul').find('label').eq(0).click()
          //Executive producer
          cy.contains("Executive Producer").next(".input-group__input").should("exist").click()
          cy.get('input').eq(0).type("glob")
                   
          cy.get('ul').find('label').eq(0).click()
          cy.get(".edit-show").click()
          //Period start date
          cy.get('.input-group__input_date-picker').its('length').should('eq',6)
          cy.get('.input-group__input_date-picker').should('have.length',6)
          let N=0
          cy.get('.input-group__input_date-picker').its('length').then((n) => {
            N = n
            cy.log("length="+N)
            for (let i = 0; i < N; i++) {
              cy.get('.input-group__input_date-picker').eq(i).click()
              //cy.contains(".input-group__title_required").next('.input-group__input_date-picker').click()
              cy.xpath("//tbody/tr/td[@class='cell']").eq(0).click()
              cy.contains("Confirm").click()
            }
          })
         // cy.screenshot()
          //click create new Show
          cy.contains("Create show").click()
         // cy.wait(10000)
          cy.location("pathname").should("eq", "/ones/new/shows")
          cy.get(".header-banner__close-button").click()
          cy.get(".search__input").type(code)
          cy.contains("Apply").click()
          cy.contains(code).should("exist")

        })
        it.skip("Show is visible in Manage Shows", () => {
          cy.get(".link__title").contains("Manage Shows").click()
          cy.location("pathname").should("eq", "/ones/new/shows")
          cy.get(".header-banner__close-button").click()
          //cy.xpath("//a[contains(text(), 'Financials')]").should('have.length',6)
          cy.xpath("//a[contains(text(), 'Financials')]").eq(5).click()
        })
      
    })

    })
    export{}