describe('DASH login', () => {
  it.skip('Visit login page', () => {
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

  it('SQL', function () {
    cy.task('queryDb', `SELECT COUNT(*) as "rowCount" FROM dwh.Artist WHERE EmployeeType='NH' and BuId=1001`).then((result) => {

        expect(result[0].rowCount).to.equal(394)
    })
})
})

