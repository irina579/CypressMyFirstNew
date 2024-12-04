describe('DASH login', () => {
   //cy.get('[data-test=new-todo]')
   //cy.get('[data-icon="pencil"]')
   // cy.get('#wave-loader').should('have.attr','style','display:none') Loader
  let random_search=Math.random().toString(36).substring(2,4)
  it.only('Random value test - simpe check!!!', () => {
    cy.log(random_search)
    if(true){
      random_search="changed"
    }
    cy.log(random_search)
    console.log("Test is finished")

    expect(5).to.be.gte(1)
  }) 
  it('should validate a condition and show custom error message', () => {
    let dynamicValue=1
    let value=2
    cy.readFile('cypress/fixtures/assigned_artists.txt').then((data) => {
      const dataArrayFromFile = data.split(','); // Split the string into an array using comma as the delimiter  
    try {
      expect(value).to.equal(dynamicValue, `Custom Error: The data is incorrect -  ${data}`);
    } catch (error) {
      // Logging custom message to console
     // cy.log(`Test failed. Dynamic value: ${dynamicValue}, Actual: ${value}, Expected: ${dynamicValue}`);
        
      cy.log(data)
      throw new Error(`Test failed: ${error.message}`);
      
  }
});
});
  it('Read/write test', () => {
    // Write the array to a file
    const dataArray = ["John", "Jane", "Alice", "Bob"];
    const dataString = dataArray.join(','); // Convert the array to a comma-separated string
    cy.writeFile('cypress/fixtures/data.txt', dataString);
    // Later in the test...
    cy.readFile('cypress/fixtures/data.txt').then((data) => {
      const dataArrayFromFile = data.split(','); // Split the string into an array using comma as the delimiter
      // Use the array as needed
      dataArrayFromFile.forEach((item) => {
        // Perform checks or assertions on each value in the array
        cy.log(item);
      });
    });
  })
  it('Scroll into view', () => {
     cy.visit('https://belitsoft.com/')
     cy.get('footer').scrollIntoView()
   })
  it.skip('DASH Scroll into view test', () => {
    cy.contains('.link__title','Budgets & KPI').click()
    //cy.contains('.link__title','fbajbchbsacjhsabj').click() - for testing purposes
    cy.contains('.card-name', 'Academy and Learning').scrollIntoView()
  })
  it.skip("API", () => {
    cy.visit(Cypress.env('https://mail.ru/')) 
    let url=cy.url()
     cy.log("URL"+url+"/"+cy.url().toString())
  })
  it.skip('Write response in file', () => {
    cy.visit('http://10.94.6.100/')
    cy.get('#UserName').type('global')
    cy.get('#Password').type('global')
    cy.contains('Log in').click()
    cy.url().should('include', '/Home/Homepage')
    cy.contains('Welcome back').should('be.visible')
    cy.request('GET','http://10.94.6.100/api/NotificationApi/GetNotifications')
      .then((response) => {
        cy.writeFile('cypress/fixtures/notifications.json', response.body) ///
      })
  })
})
