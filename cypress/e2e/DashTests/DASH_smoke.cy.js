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
        cy.get('.TeamsTab__search').should('exist').type("123456789")
        cy.get('.VComboSearch__clear').click()
        cy.get('body').then(($body) => {   
            if ($body.find('.name__team').length>0){ //check if any team exists
              cy.log("The number of existing teams - "+$body.find('.name__team').length)
              cy.get(".name__team").eq(0).should("exist")
              cy.get('[data-icon="pencil"]').should("not.exist") 
            }
            else{
              cy.log("There are NO teams. The number of existing teams - "+$body.find('.name__team').length)
            }
          })
        cy.contains('.Vheader-text',"Dates").prev().click()
        cy.contains("Select All").click()
        cy.contains("label", Cypress.env('IDL_dept')).click() //checks 1 department
        cy.get(".main-heading").click()
        cy.contains("Apply").click()
        //check API whether teams exist for this dept
        cy.request('POST', Cypress.env('url_g')+"/api/ShotTeamsNewApi/GetShotTeams", {departmentIdCollection:[Cypress.env('IDL_dept_id')],siteId:Cypress.env('site_id'),isIdl:true}).then(
        (response) => {
        expect(response.status).to.eq(200) //status 200
        expect(response.body.status).to.eq('success') //status success
        let teams_count=response.body.reference.shotTeams.length
        cy.log(teams_count)
        if (teams_count>0){ //if there are teams
        let FirstTeamName=response.body.reference.shotTeams[0].name
          cy.contains(".name__team",FirstTeamName).should("exist")
          cy.get('[data-icon="pencil"]').eq(0).should("exist")  
          cy.log('The number of existing teams - '+teams_count+'. The first team name is - '+FirstTeamName)
        }
        else{ //if there are no teams
          cy.get(".name__team").should("not.exist")
          cy.get('[data-icon="pencil"]').should("not.exist")  
          cy.log('The number of existing teams - '+teams_count)
        } 
      }) 
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
      it.only("Can open IDL Vacancies converted info", () => {
        cy.xpath("//div[normalize-space(text()) = 'IDL Dept. Ones']").click()
        cy.contains(".tab-title", "Vacancies converted info").click()
        cy.contains(".btn__overflow","Nothing selected").click()
        cy.contains("a",Cypress.env('IDL_dept')).click()
        cy.contains("Apply").click()
        //check API whether there are converted artists
        cy.request('POST', Cypress.env('url_g')+"/api/PositionConverterApi/GetConvertedPositionsHistory", {siteId:Cypress.env('site_id'),departmentIds:[Cypress.env('IDL_dept_id')]}).then(
        (response) => {
        expect(response.status).to.eq(200) //status 200
        expect(response.body.status).to.eq('success') //status success
        let converted_count=response.body.reference.length
        cy.log(converted_count)
        if (converted_count>0){ //if there are converted artists
        let FirstName=response.body.reference[0].realArtistUserName
          cy.get(".table__row").find(".row__column",FirstName).should("exist") //check if artist exists in table 
          cy.log('The number of converted artists - '+converted_count+'. The first artist name is - '+FirstName)
        }
        else{ //if there are no converted artists
          cy.get(".table__row").eq(1).should("not.exist")
          cy.log('The number of converted artists - '+converted_count)
        } 
        }) 
      })  
      
      it("Can open DL Ones => Planning grid", () => {
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

      it("Can open DL Teams", () => {
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
        cy.get('.TeamsTab__search').should('exist').type("123456789")
        cy.get('.VComboSearch__clear').click()
        cy.get('body').then(($body) => {   
            if ($body.find('.name__team').length>0){ //check if any team exists
              cy.log("The number of existing teams - "+$body.find('.name__team').length)
              cy.get(".name__team").eq(0).should("exist")
             // cy.get('[data-icon="pencil"]').should("not.exist") 
            }
            else{
              cy.log("There are NO teams. The number of existing teams - "+$body.find('.name__team').length)
            }
          })
        cy.contains('.Vheader-text',"Dates").prev().click()
        cy.contains("Select All").click()
        cy.contains("label", Cypress.env('DL_dept')).click() //checks 1 department
        cy.get(".main-heading").click()
        cy.contains("Apply").click()
        //check API whether teams exist for this dept
        cy.request('POST', Cypress.env('url_g')+"/api/ShotTeamsNewApi/GetShotTeams", {departmentIdCollection:[Cypress.env('DL_dept_id')],siteId:Cypress.env('site_id'),isIdl:false}).then(
          (response) => {
            // response.body is automatically serialized into JSON
            expect(response.status).to.eq(200) //status 200
            expect(response.body.status).to.eq('success') //status success
            let teams_count=response.body.reference.shotTeams.length
            if (teams_count>0){ //if there are teams
              let FirstTeamName=response.body.reference.shotTeams[0].name
              cy.contains(".name__team",FirstTeamName).should("exist")
              cy.get('[data-icon="pencil"]').eq(0).should("exist")  
              cy.log('The number of existing teams - '+teams_count+'. The first team name is - '+FirstTeamName)
            }
            else{ //if there are no teams
              cy.get(".name__team").should("not.exist")
              cy.get('[data-icon="pencil"]').should("not.exist")  
              cy.log('The number of existing teams - '+teams_count)
            }
            
          }
        )
      })
        it.only("Can open DL Vacancies converted info", () => {
          cy.xpath("//div[normalize-space(text()) = 'DL Dept. Ones']").click()
          cy.contains(".tab-title", "Vacancies converted info").click()
          cy.contains(".btn__overflow","Nothing selected").click()
          cy.contains("a",Cypress.env('DL_dept')).click()
          cy.contains("Apply").click()
          //check API whether there are converted artists
          cy.request('POST', Cypress.env('url_g')+"/api/PositionConverterApi/GetConvertedPositionsHistory", {siteId:Cypress.env('site_id'),departmentIds:[Cypress.env('DL_dept_id')]}).then(
          (response) => {
          expect(response.status).to.eq(200) //status 200
          expect(response.body.status).to.eq('success') //status success
          let converted_count=response.body.reference.length
          cy.log(converted_count)
          if (converted_count>0){ //if there are converted artists
          let FirstName=response.body.reference[0].realArtistUserName
            cy.get(".table__row").find(".row__column",FirstName).should("exist") //check if artist exists in table 
            cy.log('The number of converted artists - '+converted_count+'. The first artist name is - '+FirstName)
          }
          else{ //if there are no converted artists
            cy.get(".table__row").eq(1).should("not.exist")
            cy.log('The number of converted artists - '+converted_count)
          } 
          }) 
        })  
 
      


      it("API", () => {
       // cy.xpath("//div[normalize-space(text()) = 'DL Dept. Ones']").click()
       // cy.contains(".tab-title", "Vacancies converted info").click()
       cy.visit(Cypress.env('https://mail.ru/')) 
       let url=cy.url()
        cy.log("URL"+url+"/"+cy.url().toString())
      })

    })

    })
    export{}