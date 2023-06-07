describe("DASH E2E tests/show_creation", () => {
    beforeEach(() => {
      cy.Login()
    })
    context("Show creation", ()=>{
      it("User can create Show", () => {
        cy.viewport(1680, 1050)
        cy.get(".link__title").contains("Create New Show").click()
        cy.location("pathname").should("eq", "/ones/shows/add-edit")
        //set up show code variable
        let code='I'+new Date().getDate()+"_"+(new Date().getMonth()+1)+"_"+new Date().getUTCMinutes()
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
        cy.get(".search__input").type(code)
        cy.contains("Apply").click()
        cy.contains(code).should("exist")
        //check of filled data
        let locator_id='training-courses-manage-shows-'+code.toLowerCase()+'-actions'
        cy.log(locator_id)
        cy.get('#'+locator_id+'>.actions__item').eq(0).click()
        cy.location("pathname").should("eq", '/ones/shows/add-edit/'+code)
        //Show Stats tab
        //show code
        cy.contains('.input-group__title', 'Code').next('div').should('include.text',code)
        //show name
        cy.contains('.input-group__title', 'Name').next('div').should('include.text',code)
        //show type category
        cy.contains('.input-group__title', 'Type').next('div').should('include.text','Awarded')
        //show status
        cy.contains('.input-group__title', 'Status').next('div').should('include.text','Active')
        //show Planning Category
        cy.contains('.input-group__title', 'Planning Category').next('div').should('include.text','Theatrical')
        //show Actual Category
        cy.contains('.input-group__title', 'Actual Category').next('div').should('include.text','Theatrical')
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
    })
})
//export{}