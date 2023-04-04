describe("DASH smoke tests/Ones", 
//set enviroment variables for test suite
{
  env: {
    req_timeout: 60000,
    elem_timeout: 80000,
  },
},
() => 
{  
  const SelectAllDepts = ()=>{
    cy.log("Selecting all depts in header")
    cy.contains('.Vheader-text',"Dates").prev().click()
    cy.contains("Select All").click() //checks all departments
    cy.get(".main-heading").click()  
    cy.contains("Apply").click()
  }
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  const characters ='abcdefghijklmnopqrstu';
  function generateString(length) { //used for random show title search generation
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  } 
  let test_tasks=['DASHCU-3675','DASHCU-3676','DASHCU-3677','DASHCU-3678','DASHCU-3679','DASHCU-3680','DASHCU-3681','DASHCU-3682','DASHCU-3683','DASHCU-3684','DASHCU-3685','DASHCU-3686','DASHCU-3687']
  let task_id=''
  const myObject = JSON.parse(Cypress.env('states'));
  before(() => {
    Cypress.session.clearAllSavedSessions()  
    for (let i=0;i<test_tasks.length;i++){
      cy.SetClickUpParameter((myObject.onhold),test_tasks[i],Cypress.env('clickup_usage'))
    }
  })  
  beforeEach(() => {
    cy.Login()
  })
  afterEach(function() { 
    // Check if the test failed
      cy.log(this.currentTest.state)
      cy.log(Cypress.currentTest.title)
      if (this.currentTest.state === 'passed') {
        cy.SetClickUpParameter((myObject.passed),task_id,Cypress.env('clickup_usage'))       // Mark the ClickUp task as failed
        cy.log('Test passed',task_id)
      }
      else {
        cy.SetClickUpParameter((myObject.failed),task_id,Cypress.env('clickup_usage'))
        cy.log('Test failed',task_id)
      }
  })
  it.skip("User can log in", () => {
    cy.url().should('include', '/Home/Homepage')
    cy.contains('Welcome back').should('be.visible')
  })
  context("Ones Unit - IDL grid", ()=>{
    beforeEach(() => {
      cy.contains('.link__title','IDL Dept. Ones').click()
      cy.url().should('include', '/idlones/new')
      cy.contains('.Vheader-text',"Site").next().click()
      cy.contains('.option-group__label',Cypress.env("bu")).next().find("[value="+Cypress.env("site_id")+"]").click()
    }) 
    it("Can open IDL Ones => Planning grid", () => { //https://app.clickup.com/t/4534343/DASHCU-3675
      task_id='DASHCU-3675'
      // cy.contains('.Vheader-text',"Dates").prev().click().as('departments_drdw')
      SelectAllDepts() //checks all departments
      cy.get(".item_artist").eq(0).should("exist")
      cy.contains(".btn__overflow","File").should("not.exist") //checks if File button is not available
      cy.contains('.Vheader-text',"Dates").prev().click()
      cy.contains("Select All").click()
      cy.contains("label", Cypress.env('IDL_dept')).click() //checks 1 department
      cy.get(".main-heading").click()
      cy.contains("Apply").click()
      //checks if any artist comes from BE
      cy.intercept('/api/idldepartmentonesnew/GetDepartmentOnes').as('grid_list')
      cy.contains("Apply").click()
      cy.wait('@grid_list').then(({response}) => {
        expect(response.statusCode).to.eq(200)
        let artist_count=response.body.reference.artistPositions.items.length
        let FirstName
        if(artist_count>0){
          FirstName=response.body.reference.artistPositions.items[1].name.username
          cy.get(".item_artist",{timeout: `${Cypress.env('elem_timeout')}`}).eq(0).should("exist")
          cy.contains(".item__info__name",FirstName).eq(0).should("exist") //check if 1-st artist exists in table and matches response
          cy.log("The first artist is - "+FirstName)
          cy.contains(".item__info__department-name",Cypress.env('IDL_dept')).should("exist")
          artist_count=artist_count-1
        }
        cy.log("The number of artist came from BE - "+artist_count)
      })
      cy.contains(".btn__overflow","File").should("exist") //checks if File button available
    })
    it("Can open IDL Teams", () => { //https://app.clickup.com/t/4534343/DASHCU-3676
      task_id='DASHCU-3676'
      cy.contains(".tab-title", "Teams").click()
      SelectAllDepts() //checks all departments
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
      cy.request('POST', Cypress.env('url_g')+"/api/ShotTeamsNewApi/GetShotTeams", {departmentIdCollection:[Cypress.env('IDL_dept_id')],siteId:Cypress.env('site_id'),isIdl:true}).then((response) => {
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
    it("Can open IDL Manager Lab", () => { //https://app.clickup.com/t/4534343/DASHCU-3677
      task_id='DASHCU-3677'
      cy.contains(".VTab__btn", "Manager Lab").click()
      cy.contains(".btn__overflow","Nothing selected").click()
      cy.contains("a",Cypress.env('IDL_dept')).click()
      //checks if any artist comes from BE
      cy.intercept("/api/departmentones/site/"+Cypress.env('site_id')+"/department/"+Cypress.env('IDL_dept_id')+"/dss").as('grid_list')
      cy.log("/api/departmentones/site/"+Cypress.env('site_id')+"/department/"+Cypress.env('IDL_dept_id')+"/dss")
      cy.contains("Apply").click()
      cy.contains(".btn__overflow","File").should("exist") //checks if File button available
      cy.wait('@grid_list',{requestTimeout:`${Cypress.env('req_timeout')}`}).then(({response}) => {
        expect(response.statusCode).to.eq(200)
        let artist_count=response.body.reference.artistInfos.items.length
        let FirstName
        cy.log("The number of artist came from BE - "+artist_count)
        if(artist_count>0){
          FirstName=response.body.reference.artistInfos.items[0].userName
          cy.get(".approval-status").eq(0).should("exist") //checks there is an artist in the grid=>approval status
          cy.contains(".cell_username",FirstName).eq(0).should("exist") //check if 1-st artist exists in table and matches response   
          cy.log("The first artist is - "+FirstName)
        } 
      })
      cy.contains(".btn__overflow","Current State").click() //open snapshot dropdown
      let CountSnap=0
      // further checks will go if there are any snapshots
      cy.get('[value="0"]').parent().find('li').its('length').then((CountSnap) => {
        cy.log("length="+CountSnap)
        if(CountSnap>=2){
          cy.get('[value="0"]').parent().find('li').eq(CountSnap-1).click()
          //checks if any artist comes from BE
          cy.contains("Apply").click()
          cy.wait('@grid_list',{requestTimeout:`${Cypress.env('req_timeout')}`}).then(({response}) => {
            expect(response.statusCode).to.eq(200)
            let artist_count=response.body.reference.artistInfos.items.length
            let FirstName=response.body.reference.artistInfos.items[0].userName
            cy.log("The number of artist came from BE - "+artist_count)
            cy.log("The first artist is - "+FirstName)
            if(artist_count>0){
              cy.get(".approval-status").eq(0).should("exist") //checks there is an artist in the grid=>approval status
              cy.contains(".cell_username",FirstName).eq(0).should("exist") //check if 1-st artist exists in table and matches response   
              cy.contains(".btn__overflow","File").should("not.exist") //checks if File button UNavailable (read only mode)
            }
          })     
        }
      })
    })
    it("Can open IDL Vacancies converted info", () => { //https://app.clickup.com/t/4534343/DASHCU-3678
      task_id='DASHCU-3678'
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
  })
  context("Ones Unit - DL grid", ()=>{  
    beforeEach(() => {
      cy.xpath("//div[normalize-space(text()) = 'DL Dept. Ones']").click()
      cy.url().should('include', '/ones/new')
      cy.contains('.Vheader-text',"Site").next().click()
      cy.contains('.option-group__label',Cypress.env("bu")).next().find("[value="+Cypress.env("site_id")+"]").click()
    }) 
    it("Can open DL Ones => Planning grid",  () => { //https://app.clickup.com/t/4534343/DASHCU-3679
      task_id='DASHCU-3679'
      //checks if generalist or not
      cy.get(".v-select-grouped__toggle").then(($text1)=>{
      if (Cypress.env('generalist').includes($text1.text().trim())){ //is generalist
        cy.contains("Apply").click()
        cy.contains(".btn__overflow","File").should("exist") //checks if File button available
        cy.contains(".item__info__department-name",Cypress.env('DL_dept')).should("not.exist") //dept split is unavailable
      }
      else{
        SelectAllDepts()
      }
      })  
      cy.get(".item_artist",{timeout: `${Cypress.env('elem_timeout')}`}).eq(0).should("exist")
      cy.contains('.Vheader-text',"Dates").prev().click()
      cy.contains("Select All").click()
      cy.contains("label", Cypress.env('DL_dept')).click() //checks 1 department
      cy.get(".main-heading").click()
      //checks if any artist comes from BE
      cy.intercept('/api/departmentonesnew/getdepartmentones').as('grid_list')
      cy.contains("Apply").click()
      cy.wait('@grid_list').then(({response}) => {
        expect(response.statusCode).to.eq(200)
        let artist_count=response.body.reference.artistPositions.items.length
        let FirstName
        if(artist_count>1){
          FirstName=response.body.reference.artistPositions.items[1].name.username
          cy.get(".item_artist",{timeout: `${Cypress.env('elem_timeout')}`}).eq(0).should("exist")
          cy.contains(".item__info__name",FirstName).eq(0).should("exist") //check if 1-st artist exists in table and matches response
          cy.log("The first artist is - "+FirstName)
          artist_count=artist_count-1
        }
        cy.log("The number of artist came from BE - "+artist_count)
      })
      //cy.SetClickUpParameter((myObject.passed),test_tasks[4],Cypress.env('clickup_usage'))
    })
    it("Can open DL Ones => Actualised grid", () => { //https://app.clickup.com/t/4534343/DASHCU-3680
      task_id='DASHCU-3680'
      cy.contains(".tab-title", "Actualised Grid").click()
      //checks if generalist or not
      cy.get(".v-select-grouped__toggle").then(($text1)=>{
        if (Cypress.env('generalist').includes($text1.text().trim())){ //is generalist
          cy.contains("Apply").click()
          cy.contains(".item__info__department-name",Cypress.env('DL_dept')).should("not.exist") //dept split is unavailable
        }
        else{
          SelectAllDepts()
        }
      })  
      cy.contains(".btn__overflow","File").should("not.exist") //checks if File button available
      cy.get(".item_artist",{timeout: `${Cypress.env('elem_timeout')}`}).eq(0).should("exist")
      cy.contains('.Vheader-text',"Dates").prev().click()
      cy.contains("Select All").click()
      cy.contains("label", Cypress.env('DL_dept')).click() //checks 1 department
      cy.get(".main-heading").click()
      //checks if any artist comes from BE
      cy.intercept('/api/departmentonesnew/getdepartmentones').as('grid_list')
      cy.contains("Apply").click()
      cy.wait('@grid_list').then(({response}) => {
        expect(response.statusCode).to.eq(200)
        let artist_count=response.body.reference.artistPositions.items.length
        cy.log("The number of artist came from BE - "+artist_count)
        let FirstName
        if(artist_count>1){
          FirstName=response.body.reference.artistPositions.items[1].name.username
          cy.get(".item_artist",{timeout: `${Cypress.env('elem_timeout')}`}).eq(0).should("exist")
          cy.contains(".item__info__name",FirstName).eq(0).should("exist") //check if 1-st artist exists in table and matches response
          cy.log("The first artist is - "+FirstName)
          artist_count=artist_count-1
        }
        cy.log("The number of artist came from BE - "+artist_count)
      })
      //cy.SetClickUpParameter((myObject.passed),test_tasks[5],Cypress.env('clickup_usage'))
    })
    it("Can open DL Ones => Disciplines tab", () => { //https://app.clickup.com/t/4534343/DASHCU-3681
      task_id='DASHCU-3681'
      cy.contains(".tab-title", "Disciplines").click()
      cy.wait(10000) //some delay to wait until notifications are loaded. Otherwise network error fails
      //checks if generalist or not
      cy.get(".v-select-grouped__toggle").then(($text1)=>{
        if (Cypress.env('generalist').includes($text1.text().trim())){ //is generalist
          cy.contains("Apply").click()
          cy.contains(".btn__overflow","File").should("exist") //checks if File button available
          cy.get(".ui-checkbox_default").eq(0).should("not.have.class","disabled") //checkboxes enabled  
          //cy.contains(".item__info__department-name",Cypress.env('DL_dept')).should("not.exist") //dept split is unavailable
        }
        else{
          SelectAllDepts()
          cy.contains(".btn__overflow","File").should("not.exist") //checks if File button unavailable
          cy.get(".ui-checkbox_default",{timeout: `${Cypress.env('elem_timeout')}`}).eq(0).should("have.class","disabled") //checkboxes disabled
        }
      })  
      cy.get(".info__name").eq(0).should("exist")
      cy.contains('.Vheader-text',"Dates").prev().click()
      cy.contains("Select All").click()
      cy.contains("label", Cypress.env('DL_dept')).click() //checks 1 department
      cy.get(".main-heading").click()
      //checks if any artist comes from BE
      cy.intercept('/api/departmentonesnew/getdirectartistsdisciplines').as('grid_list')
      cy.contains("Apply").click()
      cy.wait('@grid_list',{requestTimeout:`${Cypress.env('req_timeout')}`}).then(({response}) => {
        expect(response.statusCode).to.eq(200)
        let artist_count=response.body.reference.length
        let FirstName
        cy.log("The number of artist came from BE - "+artist_count)
        if(artist_count>0){
          FirstName=response.body.reference[0].name
          cy.get(".info__name").eq(0).should("exist") //checks there is an artist in the grid
          cy.get('[placeholder="Enter name..."]').type(FirstName).type('{enter}')
          cy.contains(".info__name",FirstName).eq(0).should("exist") //check if 1-st artist exists in table
          cy.get(".ui-checkbox_default").eq(0).should("not.have.class","disabled") //checkboxes enabled  
          cy.log("The first artist is - "+FirstName)  
        }
      })
      //cy.SetClickUpParameter((myObject.passed),test_tasks[6],Cypress.env('clickup_usage'))
    })
    it("Can open DL Teams", () => { //https://app.clickup.com/t/4534343/DASHCU-3682
      task_id='DASHCU-3682'
      cy.contains(".tab-title", "Teams").click()
      cy.wait(10000) //some delay to wait until notifications are loaded. Otherwise network error fails
      //checks if generalist or not
      cy.get(".v-select-grouped__toggle").then(($text1)=>{
        if (Cypress.env('generalist').includes($text1.text().trim())){ //is generalist
          cy.contains("Apply").click()
        }
        else{
          SelectAllDepts()
        }
      }) 
      cy.get('.TeamsTab__search').should('exist').type("123456789")
      cy.get('.VComboSearch__clear').click()
      cy.get('body').then(($body) => {   
        if ($body.find('.name__team').length>0){ //check if any team exists
          cy.log("The number of existing teams - "+$body.find('.name__team').length)
          cy.get(".name__team").eq(0).should("exist")
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
      })
      //cy.SetClickUpParameter((myObject.passed),test_tasks[7],Cypress.env('clickup_usage'))
    })
    it("Can open DL Manager Lab", () => { //https://app.clickup.com/t/4534343/DASHCU-3683
      task_id='DASHCU-3683'
      cy.contains(".VTab__btn", "Manager Lab").click()
      cy.contains(".btn__overflow","Nothing selected").click()
      cy.contains("a",Cypress.env('DL_dept')).click()
      //checks if any artist comes from BE
      cy.intercept("/api/departmentones/site/"+Cypress.env('site_id')+"/department/"+Cypress.env('DL_dept_id')+"/dss").as('grid_list')
      cy.log("/api/departmentones/site/"+Cypress.env('site_id')+"/department/"+Cypress.env('DL_dept_id')+"/dss")
      cy.contains("Apply").click()
      cy.contains(".btn__overflow","File").should("exist") //checks if File button available
      cy.wait('@grid_list',{requestTimeout:`${Cypress.env('req_timeout')}`}).then(({response}) => {
        expect(response.statusCode).to.eq(200)
        let artist_count=response.body.reference.artistInfos.items.length
        cy.log("The number of artist came from BE - "+artist_count)
        if(artist_count>0){
          let FirstName=response.body.reference.artistInfos.items[0].userName
          cy.get(".approval-status").eq(0).should("exist") //checks there is an artist in the grid=>approval status
          cy.contains(".cell_username",FirstName).eq(0).should("exist") //check if 1-st artist exists in table and matches response   
          cy.log("The first artist is - "+FirstName)
        }
      })
      cy.contains(".btn__overflow","Current State").click() //open snapshot dropdown
      let CountSnap=0
      // further checks will go if there are any snapshots
      cy.get('[value="0"]').parent().find('li').its('length').then((CountSnap) => {
        cy.log("length="+CountSnap)
        if(CountSnap>=2){
          cy.get('[value="0"]').parent().find('li').eq(CountSnap-1).click()
          //checks if any artist comes from BE
          cy.contains("Apply").click()
          cy.wait('@grid_list',{requestTimeout:`${Cypress.env('req_timeout')}`}).then(({response}) => {
            expect(response.statusCode).to.eq(200)
            let artist_count=response.body.reference.artistInfos.items.length
            let FirstName
            cy.log("The number of artist came from BE - "+artist_count)
            if(artist_count>0){
              FirstName=response.body.reference.artistInfos.items[0].userName
              cy.get(".approval-status").eq(0).should("exist") //checks there is an artist in the grid=>approval status
              cy.contains(".cell_username",FirstName).eq(0).should("exist") //check if 1-st artist exists in table and matches response   
              cy.log("The first artist is - "+FirstName)
            } 
          })
        }
      })
      //cy.SetClickUpParameter((myObject.passed),test_tasks[8],Cypress.env('clickup_usage'))
    })
    it("Can open DL Vacancies converted info", () => { //https://app.clickup.com/t/4534343/DASHCU-3684
      task_id='DASHCU-3684'
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
      //cy.SetClickUpParameter((myObject.passed),test_tasks[9],Cypress.env('clickup_usage'))
    })  
  })
  context("Ones Unit - Show Ones grid", ()=>{
    beforeEach(() => {
      cy.contains('.link__title','Show Ones').click()
      cy.url().should('include', '/ones/show')
    }) 
    it("Can open Show Ones => Ones grid", () => { //https://app.clickup.com/t/4534343/DASHCU-3685
      task_id='DASHCU-3685'
      cy.contains('.tab-title','Ones',{timeout: `${Cypress.env('elem_timeout')}`}).click() //wait for loading
      cy.get('#app').then(($body) => {   
        if ($body.find('div>.filter-view-current').length>0){ //check if default custom filter exists
          cy.contains("to see Ones content").should("not.exist")
          cy.get('.item__info__department-name').should('exist')
          cy.contains('.btn__overflow', 'MASTER').should('exist')
          cy.get('div>.filter-view-current__delete').click()
          cy.log('Clear default filter')
        }
      })
      cy.contains("to see Ones content").should("exist")
      cy.contains('.btn__overflow','Select show').click()
      cy.intercept('GET', '**/api/showones/sites/*').as('grid_list')      
      let date = new Date().getFullYear() //detects current year
      cy.get('.search__wrapper>input').eq(0).type(date) //search show with date in current year (aim: to have not old show for test)
      cy.get('li.VSelect__search').first().parent().then(($Filter) => {
        cy.log($Filter.find('li').length)
        if($Filter.find('li').length<=1) {
          cy.get('.search__wrapper>input').eq(0).clear()         //if there are no shows with current year, we'll test any other
        }
        cy.get('li.VSelect__search').first().parent().find('li').eq(getRandomInt(12)+1).click() //select random Show within 10 first
        cy.wait('@grid_list',{requestTimeout:`${Cypress.env('req_timeout')}`}).then(({response}) => {
          expect(response.statusCode).to.eq(200)
          if(response.body.reference.sites.length>1){  //select random site if there are more than 1
            cy.log(response.body.reference.sites.length)
            let site_id=(response.body.reference.sites[getRandomInt(response.body.reference.sites.length)].id)
            cy.get('.v-select-grouped__toggle>.toggle__text',{timeout: `${Cypress.env('elem_timeout')}`}).click({timeout: `${Cypress.env('elem_timeout')}`}).get('[value='+site_id+']').first().click()
          }
          cy.get('[data-content="Select a discipline"]').parent().next(1).click() //select any random discipline
          cy.get('.Vheader-select').then(($IDL) => {
            cy.log($IDL.find('#allColumnSelectInput').length)
            if($IDL.find('#allColumnSelectInput').length>0) {
              cy.contains('label', 'DL').first().click()       
            }
            else{
              cy.contains('label', 'Select All').first().click()

            } 
          })        
          cy.contains('label', Cypress.env('discipline')).first().click()
          cy.get('.main-title').click()
          cy.contains('.btn-apply','Apply').click()
          cy.contains('.item__info__department-name', Cypress.env('discipline')).should('exist')
          cy.contains('.btn__overflow', 'MASTER').click() //check scenarios
          cy.get('[value="0"]').parent().find('li').its('length').then((CountScenario) => {
            cy.log("length="+CountScenario)
            if(CountScenario>1){
              cy.get('[value="0"]').parent().find('li').eq(getRandomInt(CountScenario-1)+1).click()
              cy.contains('.item__info__department-name', Cypress.env('discipline')).should('exist')
              cy.contains('.btn__overflow', 'MASTER').should('not.exist')
            }
            else{
              cy.log('Scenarios do not exist')
            }  
          })
        })     
      })
    })
    it("Can open Show Ones => Quota grid", () => { //https://app.clickup.com/t/4534343/DASHCU-3686
      task_id='DASHCU-3686'
      cy.contains('.tab-title','Ones',{timeout: `${Cypress.env('elem_timeout')}`}).click() //wait for loading
      cy.get('#app').then(($body) => {   
        if ($body.find('div>.filter-view-current').length>0){ //check if default custom filter exists
          cy.contains("to see Ones content").should("not.exist")
          cy.contains('.btn__overflow','|').should('exist').then(($code)=>{
            let code_long=$code.text().trim()
            const re = /[|]/;
            let ShowCode=code_long.substring(0,code_long.search(re)).trim()
            cy.log('Show Ones, Show Code= '+ShowCode)
            cy.contains('.tab-title','Quota').click()
            cy.get('.Vheader__show .btn__overflow').should('include.text',ShowCode)
          })
        }
        else {
          cy.contains("to see Ones content").should("exist")
          cy.contains('.tab-title','Quota').click()
          cy.contains('.btn__overflow','Select show').click()
          let random_search=generateString(2)
          cy.get('.search__wrapper>input').eq(0).type(random_search) //search generated 2 symbols combination
          cy.get('li.VSelect__search').first().parent().then(($Filter) => {
            cy.log($Filter.find('li').length)
            if($Filter.find('li').length<=1) {
              cy.get('.search__wrapper>input').eq(0).clear()         //if there are no shows with current year, we'll test any other
            }
            else{
              cy.get('li.VSelect__search').first().parent().find('li').eq(getRandomInt($Filter.find('li').length-1)+1).find('a').contains(random_search.trim(), { matchCase: false }) //check random search result includes search text
            } 
            cy.get('li.VSelect__search').first().parent().find('li').eq(getRandomInt($Filter.find('li').length-1)+1).click() //select random Show within 10 first
          })  
          cy.contains('.VButton__text','Sync Show Ones').click()
          cy.contains('.VButton__text','Cancel').click()
          cy.get('div>.show-ones-quota__header__settings__disciplines').find('span').first().then(($text) => { 
            cy.log($text.text())  
            if ($text.text().trim()!=='Select discipline'){ 
              cy.contains('div','Scheduled Q').should('exist')
              cy.contains('div','Show Ones').should('exist')
              cy.contains('.toggle__text','Select Site').click()
              cy.get('div>.VCheckboxSimple').first().click()
              cy.get('div>.VCheckboxSimple').first().find('span').then(($text) => {
                let site=$text.text()
                cy.get('div>.p-10').first().should('include.text',site.trim())
              })   
            }          
          })  
        }
      })           
    })    
    it("Can open Show Ones => Bid weeks tab", () => { //https://app.clickup.com/t/4534343/DASHCU-3687
      task_id='DASHCU-3687'
      cy.contains('.tab-title','Ones',{timeout: `${Cypress.env('elem_timeout')}`}).click() //wait for loading
      cy.get('#app').then(($body) => {   
        if ($body.find('div>.filter-view-current').length>0){ //check if default custom filter exists
          cy.contains("to see Ones content").should("not.exist")
          cy.contains('.btn__overflow','|').should('exist').then(($code)=>{
            let code_long=$code.text().trim()
            const re = /[|]/;
            let ShowCode=code_long.substring(0,code_long.search(re)).trim()
            cy.log('Show Ones, Show Code= '+ShowCode)
            cy.contains('.tab-title','Bid Weeks').click()
            cy.get('.Vheader__show .btn__overflow').should('include.text',ShowCode)
          })
        }
        else {
          cy.contains("to see Ones content").should("exist")
          cy.contains('.tab-title','Bid Weeks').click()
          cy.contains('.btn__overflow','Select show').click()
          let random_search=generateString(2)
          cy.get('.search__wrapper>input').eq(0).type(random_search) //search generated 2 symbols combination
          cy.get('li.VSelect__search').first().parent().then(($Filter) => {
            cy.log($Filter.find('li').length)
            if($Filter.find('li').length<=1) {
              cy.get('.search__wrapper>input').eq(0).clear()         //if there are no shows with current year, we'll test any other
            }
            else{
              cy.get('li.VSelect__search').first().parent().find('li').eq(getRandomInt($Filter.find('li').length-1)+1).find('a').contains(random_search.trim(), { matchCase: false }) //check random search result includes search text
            } 
            cy.get('li.VSelect__search').first().parent().find('li').eq(getRandomInt($Filter.find('li').length-1)+1).click() //select random      
          })  
        } 
      })
      cy.get('.VTab__body').then(($TPS) => {
        if($TPS.find('.tab-placeholder').length>0) {
          cy.contains("You don't have permissions to view this show.")
          cy.get('.dropdown-toggle>.btn__overflow').first().should('include.text','(')
        }
        else{
          cy.contains('.unit-btn','Total').click()
          cy.get('[placeholder="Enter name..."]').type(Cypress.env('discipline')).type('{enter}')
          cy.contains('div>.total-disciplines',Cypress.env('discipline')).should('exist')
          cy.get('div>.total-disciplines').last().should('include.text',Cypress.env('discipline'))
          cy.get('.unit-btn').last().click()
          cy.contains('.discipline-name',Cypress.env('discipline')).scrollIntoView()           
        }           
      }) 
    })
  })
})  