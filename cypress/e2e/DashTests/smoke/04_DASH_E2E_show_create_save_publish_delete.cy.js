describe("DASH E2E - Show Create/Save/Publish/Delete", () => {
    //set up show code variable
    //const code='I12_7_5'// for debugging
    const code='I'+new Date().getDate()+"_"+(new Date().getMonth()+1)+"_"+new Date().getUTCMinutes()
    const SelectCreatedShow = ()=>{
      cy.contains('.link__title','Show Ones').click()
      cy.url().should('include', '/ones/show')
      cy.contains('.tab-title','Ones',{timeout: `${Cypress.env('elem_timeout')}`}).click()
      cy.get('#app').then(($body) => {
        cy.log($body.find('div>.filter-view-current').length)
        if ($body.find('div>.filter-view-current').length>0){ //check if default custom filter exists
          cy.contains("to see Ones content").should("not.exist")
          cy.get('.item__info__department-name').should('exist')
          cy.contains('.btn__overflow', 'MASTER').should('exist')
          cy.get('div>.filter-view-current__delete').click()
          cy.log('Clear default filter')
        }
      })
      cy.contains('.btn__overflow','Select show').click()
      cy.get('.search__wrapper>input').eq(0).type(code)
      cy.contains('a',code).click()
    }
    const normalizeText = (s) => s.replace(/\s/g, '')
    const SelectCreateShowInManageShows=()=>{
      cy.get(".search__input").type(code)
      cy.contains("Apply").click()
      cy.contains('.counters__item', 'Delivered').should('include.text','0') //to wait until page loads
      cy.contains(code).should("exist")
      let locator_id='training-courses-manage-shows-'+code.toLowerCase()+'-actions'
      cy.get('#'+locator_id+'>.actions__item').eq(0).click()
      cy.location("pathname").should("eq", '/ones/shows/add-edit/'+code)
    }
    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
    beforeEach(() => {
      cy.Login()
      cy.viewport(1680, 1050)
    })
    context("Show create, create positions and Ones, Save and Publish", ()=>{
        it("User can create Show", () => {
        cy.get(".link__title").contains("Create New Show").click()
        cy.location("pathname").should("eq", "/ones/shows/add-edit")
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
        //!!! For none- A&G BUs
        if (Cypress.env("bu")!='Technicolor Games'){
          //show Planning Category
          cy.contains('.input-group__title', 'Planning Category').next('div').click()
          cy.contains('a','Theatrical').click()
          //show Actual Category
          cy.contains('.input-group__title', 'Actual Category').next('div').click()
          cy.contains('a','Theatrical').click()
        }
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
        cy.contains('td','30').click()
        cy.contains('button', 'Confirm').click()
        //release date
        cy.contains('.input-group__title','Release Date').next('div').click()
        cy.get('.mx-btn-current-year').click()
        cy.contains(new Date().getFullYear()+1).click()
        cy.contains('td','Dec').click()
        cy.contains('td','31').click()
        cy.contains('button', 'Confirm').click()
        //seniority split
        //checks if regular BU or BU with specific seniorities
        cy.get("div>.section__groups_seniority-split .input-group__title_required").eq(0).then(($text1)=>{
        if ($text1.text().trim()=='Artist %'){ //regular BU
          cy.contains('.input-group__title', 'Artist %').next('div').type(10)
          cy.contains('.input-group__title', 'Key Artist %').next('div').type(20)
          cy.contains('.input-group__title', 'Lead %').next('div').type(30)
          cy.contains('.input-group__title', 'Supervisor %').next('div').type(40)
        }
        else if ($text1.text().trim()=='Lead %') { //with spesific seniorities
          cy.contains('.input-group__title', 'Lead %').next('div').type(10)
          cy.contains('.input-group__title', 'Senior %').next('div').type(20)
          cy.contains('.input-group__title', 'Mid %').next('div').type(30)
          cy.contains('.input-group__title', 'Junior %').next('div').type(40)
        }
        })  
        //DL %
        cy.contains('.input-group__title', 'DL %').next('div').click().type('{backspace}').type('{backspace}').type(99)
        //show currency
        cy.contains('.input-group__title','Show Currency').next('div').click()
        cy.contains('a','USD ($)').click()
        //award est
        cy.contains('.input-group__title', 'Awards Est').next('div').type(99)
        //primary location
        cy.contains('.input-group__title','Primary').next('div').click()
        cy.get("[value="+Cypress.env("site_id")+"]").click()
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
        //for writing some values in the file
        let StartDateText;
        let EndDateText;
        let ReleaseDateText;
        let SecondaryLocationText;
        let TPSLocationText;
        let SecondaryProducerText
        cy.contains('.input-group__title','Start Date').next('div').invoke('text').then((text) => {
          StartDateText = text;
        });
        cy.contains('.input-group__title','End Date').next('div').invoke('text').then((text) => {
          EndDateText = text;
        });
        cy.contains('.input-group__title','Release Date').next('div').invoke('text').then((text) => {
          ReleaseDateText = text;
        });
        cy.contains('.input-group__title','Secondary').next('div').invoke('text').then((text) => {
          SecondaryLocationText = text;
        });
        cy.contains('.input-group__title','TPS').next('div').invoke('text').then((text) => {
          TPSLocationText = text;
        });
        //show inputs tab
        cy.contains('.tabTitle', 'Show Inputs').click()
        //Primary producer
        cy.contains('.input-group__title','Primary Producer').next('div').click()
        cy.get('input').type("glob")
        cy.contains('a','glob').click()
        //Secondary producer
        cy.contains('.input-group__title','Secondary Producer').next('div').click()
        cy.get('ul').find('label').eq(0).click()
        cy.get('.header__title').click()
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
        //for writing in the file 
        cy.contains('.input-group__title','Secondary Producer').next('div').invoke('text').then((text) => {
          SecondaryProducerText = text;
        });       
        // Write the variables to a file
        cy.then(() => {
          const data = {
            StartDateText,
            EndDateText,
            ReleaseDateText,
            SecondaryLocationText,
            TPSLocationText,
            SecondaryProducerText
          };
          const jsonData = JSON.stringify(data);
          cy.writeFile('cypress/fixtures/show_elements.json', jsonData);
        });
        //check creation
        cy.contains('span', 'Create show').click()
        cy.location("pathname").should("eq", "/ones/new/shows")
        SelectCreateShowInManageShows()
        //Show Stats tab
        //show code
        cy.contains('.input-group__title', 'Code').next('div').should('include.text',code)
        //show name
        cy.contains('.input-group__title', 'Name').next('div').should('include.text',code)
        //show type category
        cy.contains('.input-group__title', 'Type').next('div').should('include.text','Awarded')
        //show status
        cy.contains('.input-group__title', 'Status').next('div').should('include.text','Active')
        //For Non A-G BUs only
        if (!Cypress.env("bu")=='Technicolor Games'){
          //show Planning Category
          cy.contains('.input-group__title', 'Planning Category').next('div').should('include.text','Theatrical')
          //show Actual Category
          cy.contains('.input-group__title', 'Actual Category').next('div').should('include.text','Theatrical')
        }
        //assets amount
        cy.contains('.input-group__title', 'Amount of Assets').next('div').should('include.text','10')
        //shots amount
        cy.contains('.input-group__title', 'Amount of Shots').next('div').should('include.text','20')
        //seniority split
        //checks if regular BU or BU with specific seniorities
        cy.get("div>.section__groups_seniority-split .input-group__title_required").eq(0).then(($text1)=>{
        if ($text1.text().trim()=='Artist %'){ //regular BU
          cy.contains('.input-group__title', 'Artist %').next('div').should('include.text','10')
          cy.contains('.input-group__title', 'Key Artist %').next('div').should('include.text','20')
          cy.contains('.input-group__title', 'Lead %').next('div').should('include.text','30')
          cy.contains('.input-group__title', 'Supervisor %').next('div').should('include.text','40')
        }
        else if ($text1.text().trim()=='Lead %') { //with spesific seniorities
          cy.contains('.input-group__title', 'Lead %').next('div').should('include.text','10')
          cy.contains('.input-group__title', 'Senior %').next('div').should('include.text','20')
          cy.contains('.input-group__title', 'Mid %').next('div').should('include.text','30')
          cy.contains('.input-group__title', 'Junior %').next('div').should('include.text','40')
        }
        })  
        //DL %
        cy.contains('.input-group__title', 'DL %').next('div').should('include.text','99')
        //show currency
        cy.contains('.input-group__title','Show Currency').next('div').should('include.text','USD ($)')
        //award est
        cy.contains('.input-group__title', 'Awards Est').next('div').should('include.text','99')
        //primary location
        cy.contains('.input-group__title','Primary').next('div').should('include.text','London (MPC)')
        //Ones split
        cy.get('#training-course-show-primary-location>.input-group__input>.VInputFake_default-new').should('include.text','10')
        cy.get('#training-course-show-secondary-location-0>.input-group__input>.VInputFake_default-new').should('include.text','20')
        cy.get('#training-course-show-tps-location-0>.input-group__input>.VInputFake_default-new').should('include.text','70')
        
        //read values from file to compare
        cy.readFile('cypress/fixtures/show_elements.json').then((data) => {
          const { StartDateText, EndDateText, ReleaseDateText, SecondaryLocationText,TPSLocationText,SecondaryProducerText } = data;
          // Use the stored element texts in assertions
          //Start date 
          cy.contains('.input-group__title','Start Date').next('div').should('have.text', StartDateText);
          //End date
          cy.contains('.input-group__title','End Date').next('div').should('have.text', EndDateText);
          //Release date
          cy.contains('.input-group__title','Release Date').next('div').should('have.text', ReleaseDateText);
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
      it('Creating Positions & Ones on a new Show and Save', () => {
        SelectCreatedShow()
        cy.contains('.item__info__department-name',Cypress.env('discipline')).prev('div').click()
        let N=0
        cy.get('.levels__item>.col-lg-5').its('length').then((n) => {
            N = n
            cy.log("length="+N)
            for (let i = 0; i < N; i++) {
              cy.get('.levels__item>.col-lg-5').find('label').eq(i).click()
              cy.get('div>.amount__input').eq(i).clear().type(i+1)        
            }  
            cy.contains('.VButton__text','Add').click()          
        })
        let Ones=0
        cy.get('.item_artist.collapsed>.item__months>.item__month>.row__cell').eq(1).click()
        if(Cypress.env("EP_approval")){
          cy.contains('.VButton__text','OK').click()  //only for BUs with EP approval=ON
        }      
        cy.get('.item_artist.collapsed>.item__months>.item__month>.row__cell').its('length').then((n) => {
            Ones = n
            cy.get('.item_artist.collapsed>.item__months>.item__month>.row__cell').eq(1).click()
            cy.get('.item_artist.collapsed>.item__months>.item__month>.row__cell').eq((Ones-1)-20).click({shiftKey: true,}) //(Ones-1)-20 - this is to selact only half of grid weeks/visible area                  
        })
        cy.contains('.VButton__text','Confirm').click()
        cy.contains('.btn__overflow','File').click()
        cy.contains('a','Save').click()
        cy.contains('Save operation completed')
        cy.get('.item_artist.collapsed>.item__months>.item__month>.row__cell>div').eq(0).should('have.class', 'statusId1')
      })
      it('Show Ones Publish', () => {
        SelectCreatedShow()
        cy.contains('.item__info__department-name', Cypress.env('discipline')).should('exist')
        cy.get('.v-select-grouped__toggle').invoke('text').then((text) => {
          let site_name_long = normalizeText(text)
          cy.log(site_name_long)
          const re = /[(]/
          let site_name=site_name_long.substring(0,site_name_long.search(re)).trim()
          cy.log('Show Ones, Site trimmed= '+site_name)
          cy.ShowPublish(Cypress.env('bu'), Cypress.env('discipline'), site_name, true)
        })       
        if(Cypress.env("EP_approval")){
          cy.contains('.VNotification__title','Publish Request').should('exist')
          cy.contains('.VButton__text','Yes').click()  //only for BUs with EP approval=ON
          cy.get('.item_artist.collapsed>.item__months>.item__month>.row__cell>div').eq(0).should('have.class', 'statusId8')
        }
        else{           
        cy.get('.item_artist.collapsed>.item__months>.item__month>.row__cell>div').eq(0).should('have.class', 'statusId2')
        }
      })      
      it('Approve Show Ones EP requests', () => {
        if(Cypress.env("EP_approval")){
          cy.contains('.link__title','Notification Center').click()
          cy.url().should('include', '/notification-center/')
          //cy.get('.select-all.VCheckboxSimple>span').click()
          cy.get('[placeholder="Search"]').type(code).type('{enter}') //initiate searching of this title on UI
          cy.get('div>.notification__title').first().should('include.text',code) //verify the search gives result
          cy.get('span.vueSlider').click() //show only awaiting approval
          cy.get('.select-all.VCheckboxSimple>span').click()
          cy.contains('.VButton__text', 'Approve').click()
          cy.contains('.VButton__text', 'Yes, Continue').click()
          cy.contains('div>.notification__title', code).should('not.exist') //verify there are no more pending notifications      
        }
        else{           
        cy.log('No approval is required')
        }
      }) 
    })
    context("Assign published Ones in DL, Save and Publish", ()=>{
      it('Assign published Ones from Shopping cart and Save', () => {
        cy.visit(Cypress.env('url_g')+"/ones/new?siteId="+Cypress.env('site_id')+"&departmentIds="+Cypress.env('DL_dept_id')) 
        cy.get('#ShowPopupButton').should('not.have.attr','disabled')
        cy.get('#ShowPopupButton').click()
        if (Cypress.env("bu")=='Technicolor Games'){ //for TC Games we'll check Episodic tab
          cy.contains('.card__title', "Episodic")
        }
        cy.get('.item_artist').its('length').then((n) => {
          let grid_artist_count=n
          cy.contains('.show__title',code).parent().find('span').first().click()
          cy.contains('.discipline__name',Cypress.env('discipline')).prev('span').click()
          //cy.contains('.discipline__name','Design').prev('span').click() //for debug
          let N=0
          cy.get('div>.one__title').its('length').then((n) => { //verify the positions counter corresponds to that was set in Show Ones
            N = n
            cy.log("length="+N)
            for (let i = 0; i < N; i++) {
              cy.contains('div>.one__count',i+1).should('exist')   
            }  
            let cart_pos_count=getRandomInt(N-1)+1
            cy.contains('div>.one__count',cart_pos_count).click()
            cy.contains('.modal-footer>.btn-cancel','Close').click()
            cy.get('body').then(($body) => {   //clear seniority filter if artists in grid < then requested in cart
              let artist_count=$body.find('.item_artist').length
              cy.log(artist_count)
              if (artist_count<cart_pos_count){
                cy.get('.header__shows__seniority').click()
                cy.get('.item_artist').should('not.have.length',artist_count) //to wait the grid is loaded
                if (cart_pos_count>grid_artist_count){
                 cart_pos_count=grid_artist_count  //set cart positions to be assigned=artists in grid
                 cy.log('New_count='+cart_pos_count)
                }
              }
              let artist_name
              let artist_name_full=""
              for (let i = 0; i < cart_pos_count; i++) {
                cy.get('.header__shows__items .header__month').first().children('div').eq(1).find('div').first().click()
                cy.get('.header__shows__items .header__month').last().children('div').eq(1).find('div').first().click({shiftKey: true,})
                cy.get('.item_artist').eq(i).find('.row__cell').first().click()
                cy.get('.item__info__name').eq(i).invoke('text').then((text) => {
                  artist_name = normalizeText(text)
                  cy.get('body').then(($body) => {   
                    if ($body.find('div.VNotification__title').length>0){ //check if Add pop up appears
                      cy.contains('.VButton__text','Add').click()
                    }
                  })
                  artist_name_full=artist_name_full+artist_name
                })
              } 
              // Write the assigned artist to a file
              cy.then(() => {
                const data = {
                  artist_name_full
                };
                const jsonData = JSON.stringify(data);
                cy.writeFile('cypress/fixtures/assigned_artists.json', jsonData);
              })
            }) 
          })
        })
        cy.contains('.btn__overflow','File').scrollIntoView().click()
        cy.contains('a','Save').click()
        cy.contains('Save operation completed').should('exist')
      }) 
      it('Publish DL Ones', () => {
        cy.visit(Cypress.env('url_g')+"/ones/new?siteId="+Cypress.env('site_id')+"&departmentIds="+Cypress.env('DL_dept_id'))
        //cy.visit('http://10.94.6.100/ones/new?siteId=20002&departmentIds=20016')
        let popup_count=0
        cy.intercept('/api/departmentonesnew/publishdepartmentones').as('grid_list')
        cy.request('POST', Cypress.env('url_g')+"/api/DepartmentOnesNewApi/CheckIsExistArtistsWithOnesOutOfContract", {siteId:Cypress.env('site_id'),departmentIds:[Cypress.env('DL_dept_id')]}).then((response) => {
          expect(response.status).to.eq(200) //status 200
          if (response.body.reference.length>0){ //if there are teams
            popup_count=popup_count+1
            cy.log('OnesOnArtists='+ popup_count)
          }
          cy.request('POST', Cypress.env('url_g')+"/api/departmentonesnew/checkonespriorities/?siteId="+Cypress.env('site_id'), [Cypress.env('DL_dept_id')]).then((response) => {
            expect(response.status).to.eq(200) //status 200
            if (response.body==true){ //if
              popup_count=popup_count+1
              cy.log('Priority='+popup_count)
            }
            cy.contains('.btn__overflow','File').scrollIntoView().click()
            cy.contains('a','Publish').click()
            cy.log("Pop up count="+popup_count)
            for (let i = 0; i <= popup_count; i++) {
            cy.get('div>.btn_submit').click()
            }
            if (popup_count>0){
              cy.wait('@grid_list').then(({response}) => {
                expect(response.statusCode).to.eq(200)
              })
            }
            cy.contains('Publish operation completed').should('exist')
          }) 
        })
      }) 
    })
    context("Check Publish results, Delete created Ones in Show Ones grid (in progress), Publish and Delete Show", ()=>{
      it('Delete created Ones in Show Ones and Publish', () => {
        SelectCreatedShow()
        cy.contains('.item__info__department-name', Cypress.env('discipline')).should('exist')
/*         //read assigned artist info from file
        cy.readFile('cypress/fixtures/assigned_artists.json').then((data) => {
        const {artist_name_full} = data;
        // Use the stored element texts in assertions
  
        cy.contains('.input-group__title','Start Date').next('div').should('have.text', StartDateText); */
        
        
        let Ones=0
        cy.get('.item_artist.collapsed>.item__months>.item__month>.row__cell').eq(1).click()
        if(Cypress.env("EP_approval")){
          cy.contains('.VButton__text','OK').click()  //only for BUs with EP approval=ON
        }   
        cy.get('.item_artist.collapsed>.item__months>.item__month>.row__cell').its('length').then((n) => {
          Ones = n
          cy.get('.item_artist.collapsed>.item__months>.item__month>.row__cell').eq(1).click()
          cy.get('.item_artist.collapsed>.item__months>.item__month>.row__cell').eq((Ones-1)-20).click({shiftKey: true,}) //(Ones-1)-20 - this is to selact only half of grid weeks/visible area                  
        })
        cy.contains('.VButton__text','Remove Ones').click()
        cy.contains('.VButton__text','Confirm').click()
        cy.contains('.btn__overflow','File').scrollIntoView().click()
        cy.contains('a','Save').click()
        cy.contains('Save operation completed').should('exist')
        cy.get('.v-select-grouped__toggle').invoke('text').then((text) => {
          let site_name_long = normalizeText(text)
          cy.log(site_name_long)
          const re = /[(]/
          let site_name=site_name_long.substring(0,site_name_long.search(re)).trim()
          cy.log('Show Ones, Site trimmed= '+site_name)
          cy.ShowPublish(Cypress.env('bu'), Cypress.env('discipline'), site_name, false)
        }) 
      })      
      it('Delete created Show', () => {
        cy.contains('.link__title','Manage Shows').click()
        cy.url().should('include', '/ones/new/shows')
        SelectCreateShowInManageShows()
        cy.contains('.VButton__text', 'Delete').parent().should("have.attr","disabled")
        cy.contains('.input-group__title', 'Status').next('div').click()
        cy.contains('a','Inactive').click() //Make show Inactive to be able to delete
        cy.contains('.VButton__text', 'Save').click()
        cy.contains('.v-filter__placeholder','Active').scrollIntoView().click()
        cy.contains('label','Inactive').click() //add inactive Shows in filter
        cy.contains('.VButton__text',"Apply").click()
        SelectCreateShowInManageShows() 
        cy.contains('.VButton__text', 'Delete').click()
        cy.contains('.VButton__text', 'Yes, Delete').click()
        cy.contains('.v-filter__placeholder','Active').scrollIntoView().click()
        cy.contains('label','Inactive').click() //add inactive Shows in filter
        cy.get(".search__input").type(code)
        cy.contains('.VButton__text',"Apply").click()
        cy.contains(code).should("not.exist")
      }) 
    })
})
//export{}