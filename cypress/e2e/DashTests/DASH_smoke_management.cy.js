describe("DASH smoke tests/Managements", 
//set enviroment variables for test suite
{
  env: {
    req_timeout: 30000,
    elem_timeout: 30000,
   // password: 'global'
  },
},
() => 
{ 
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  } 
  const normalizeText = (s) => s.replace(/\s/g, '').toLowerCase()
  beforeEach(() => {
      cy.visit(Cypress.env('url_g'))
      cy.get('#UserName').type(Cypress.env('login_g'))
      cy.get('#Password').type(Cypress.env('password_g'))
      cy.contains('Log in').click()
      cy.get(".header-banner__close-button",{setTimeout: 40000}).click()
    })
    context("Manage Shows", ()=>{
      beforeEach(() => {
        cy.xpath("//div[normalize-space(text()) = 'Manage Shows']").click()
        cy.url().should('include', '/ones/new/shows')
      }) 
     it("Can open Manage Shows", () => {
       cy.get('.show__content').eq(0).should("exist") //waits the grid is loaded
       cy.get('body').then(($body) => {   
          if ($body.find('.show__content',{setTimeout: `${Cypress.env('elem_timeout')}`}).length>1){ //check if any show exists
            cy.contains(".status__label","Active").eq(0).should("exist")
            //Inactive Shows counter=0
            cy.contains(".counters__item","Inactive").find("span").should(($counter) => {
              expect(normalizeText($counter.text()), 'Count of Inactive Shows is zero by default').to.equal("0")
            })
            //Delivered Shows counter=0
            cy.contains(".counters__item","Delivered").find("span").should(($counter) => {
              expect(normalizeText($counter.text()),'Count of Delivered Shows is zero by default').to.equal("0")
            })
            cy.log($body.find('.show__content').length)
          }
          else{
            cy.log("There are NO shows.")
          }
        })
        cy.contains('.VButton__text',"Apply").click() //click Apply to initiate response
        cy.intercept('/api/Shows/Search').as('grid_list')
        cy.wait('@grid_list',{requestTimeout:`${Cypress.env('req_timeout')}`}).then(({response}) => {
            expect(response.statusCode).to.eq(200)
            expect(JSON.stringify(response.body), 'There are no inactive shows in response by deafult').to.not.contain('Inactive')
            expect(JSON.stringify(response.body),'There are no delivered shows in response by deafult').to.not.contain('Delivered')
            let show_count=response.body.items.length
            let FirstName
            if(show_count>0){
            FirstName=response.body.items[0].showCode
            cy.get(".show__content",{setTimeout: `${Cypress.env('elem_timeout')}`}).eq(0).should("exist")
            cy.contains(".info__title",FirstName).eq(0).should("exist") //check if 1-st show exists and matches response
            //active Shows UI counter displays correct value, similar to response count
            cy.contains(".counters__item","Active").find("span").should(($counter) => {
              expect(parseInt(normalizeText($counter.text())),'Count of Active Shows corresponds to BE response').to.equal(show_count)
            })
            cy.log("The show is - "+FirstName)
            cy.contains(".VButton__text","Create New Show").should("exist") //create button exists
            }
            cy.log("The number of shows came from BE - "+show_count)
          })

      })
      it("Manage Shows=> search and filters work", () => {
        cy.contains('.v-filter__placeholder', 'Active').click()
        cy.contains('label','Active').click()
        let filter_status=['Delivered', 'Inactive']
        let status=filter_status[getRandomInt(2)] //selects random status to filter
        cy.contains('label',status).click()
        cy.contains('.VButton__text',"Apply").click()         
        cy.intercept('/api/Shows/Search').as('grid_list')
        cy.wait('@grid_list',{requestTimeout:`${Cypress.env('req_timeout')}`}).then(({response}) => {
            expect(response.statusCode).to.eq(200)
            let show_count=response.body.items.length
            let RandomIndex=getRandomInt(show_count)
            cy.log(RandomIndex)
            let RandomName
            if(show_count>0){
            expect(response.body.items[RandomIndex].showStatus, 'Random Show status corresponds to filtered one').to.equal(status)
            RandomName=response.body.items[RandomIndex].showCode //store random show code came in BE response
            //filtered Shows UI counter displays correct value, similar to response count
            cy.contains(".counters__item",status).find("span").should(($counter) => {
              expect(parseInt(normalizeText($counter.text())),'Count of '+status+ ' Shows corresponds to BE response').to.equal(show_count)
            })         
            cy.get('.search__input').type(RandomName) //initiate searching of this Show Code on UI
            cy.contains('.VButton__text',"Apply").click()
            cy.contains(".info__title",RandomName,{setTimeout: `${Cypress.env('elem_timeout')}`}).eq(0).should("exist") //check if the searched Show exists
            cy.log("The show is - "+RandomName)
            //Active Shows counter=0
            cy.contains(".counters__item","Active").find("span").should(($counter) => {
              expect(normalizeText($counter.text()), 'Count of Active Shows is zero').to.equal("0")
            })          
          
            }
            cy.log("The number of shows came from BE - "+show_count)
          })

      })
      it.skip("Manage Shows=>Show card links work", () => {
        cy.get('.show__content').eq(0).should("exist") //waits the grid is loaded
        cy.get('body').then(($body) => {   
           if ($body.find('.show__content',{setTimeout: `${Cypress.env('elem_timeout')}`}).length>1){ //check if any show exists
             cy.contains(".status__label","Active").eq(0).should("exist")
             cy.get('.VDataTable').scrollTo('bottom', { ensureScrollable: false })
             cy.log($body.find('.show__content').length)
           }
           else{
             cy.log("There are NO shows.")
           }
         })
         
 
       })  
    })
    context("Manage Projects", ()=>{
      beforeEach(() => {
        cy.xpath("//div[normalize-space(text()) = 'Manage Projects']").click()
        cy.url().should('include', '/ones/projects/')
      }) 
     it("Can open Manage Projects", () => {
       cy.get('.project__content').eq(0).should("exist") //waits the grid is loaded
       cy.get('body').then(($body) => {   
          if ($body.find('.project__content',{setTimeout: `${Cypress.env('elem_timeout')}`}).length>1){ //check if any show exists
            cy.contains(".actions__item","Summary").eq(0).should("exist")
            cy.log($body.find('.project__content').length)
          }
          else{
            cy.log("There are NO projects.")
          }
        })
        cy.intercept('/api/Projects/Search').as('grid_list')
        cy.contains('.VButton__text',"Apply").click() //click Apply to initiate response
        
        cy.wait('@grid_list',{requestTimeout:`${Cypress.env('req_timeout')}`}).then(({response}) => {
            expect(response.statusCode).to.eq(200)
            let project_count=response.body.items.length
            let FirstName
            if(project_count>0){
            FirstName=response.body.items[0].showCode
            cy.get(".project__content",{setTimeout: `${Cypress.env('elem_timeout')}`}).eq(0).should("exist")
            cy.contains(".info__title",FirstName).eq(0).should("exist") //check if 1-st show exists and matches response
            //active Shows UI counter displays correct value, similar to response count
            cy.contains(".counters__item","Active").find("span").then(($counterA) => {
              cy.contains(".counters__item","Inactive").find("span").then(($counterI) => {
                cy.contains(".counters__item","Delivered").find("span").then(($counterD) => {
                expect(parseInt(normalizeText($counterA.text()))+parseInt(normalizeText($counterI.text()))+parseInt(normalizeText($counterD.text())),'Count of Active&Inactive&Delivered Shows corresponds to total shows in BE response').to.equal(project_count)
                cy.log(parseInt(normalizeText($counterA.text()))+parseInt(normalizeText($counterI.text()))+parseInt(normalizeText($counterD.text())))
                })
            })
            })
            cy.log("The project is - "+FirstName)
            }
            cy.log("The number of projects came from BE - "+project_count)
          })

      })
      it("Manage Projects=> search and filters work", () => {
        cy.contains('.v-filter__placeholder', 'Active, Inactive, Delivered').click()
        cy.get('.header__control').eq(3).find('li').eq(0).click()
        let filter_status=['Active','Inactive','Delivered']
        let status=filter_status[getRandomInt(3)] //selects random status to filter
        cy.contains('label',status).click()
        cy.intercept('/api/Projects/Search').as('grid_list')
        cy.contains('.VButton__text',"Apply").click()         
        cy.wait('@grid_list',{requestTimeout:`${Cypress.env('req_timeout')}`}).then(({response}) => {
            expect(response.statusCode).to.eq(200)
            let project_count=response.body.items.length
            let RandomIndex=getRandomInt(project_count)
            cy.log(RandomIndex)
            let RandomName
            if(project_count>0){
            expect(response.body.items[RandomIndex].showStatus, 'Random Project status corresponds to filtered one').to.equal(status)
            RandomName=response.body.items[RandomIndex].showCode //store random show code came in BE response
            //filtered Project UI counter displays correct value, similar to response count
            cy.contains(".counters__item",status).find("span").should(($counter) => {
              expect(parseInt(normalizeText($counter.text())),'Count of '+status+ ' Projects corresponds to BE response').to.equal(project_count)
            })             
            cy.get('.search__input').type(RandomName) //initiate searching of this Show Code on UI
            cy.contains('.VButton__text',"Apply").click()
            cy.contains(".info__title",RandomName,{setTimeout: `${Cypress.env('elem_timeout')}`}).eq(0).should("exist") //check if the searched Show exists
            cy.log("The show is - "+RandomName) 
          
            }
            cy.log("The number of projects came from BE - "+project_count)
          })

      })
        
    })

    })
    export{}