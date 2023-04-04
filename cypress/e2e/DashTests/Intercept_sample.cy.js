describe('Interception', () => {
    it.skip("Sample of Intercept in  Notification request", () => {
        cy.intercept('/api/NotificationApi/GetNotifications').as('status');
        cy.get(".link__title").contains("Notification Center").click()
        cy.wait('@status').then(({response}) => {
          expect(response.statusCode).to.eq(200)
          let category_count=response.body.reference.categories.length
          cy.log(category_count)
        });
    });
 })
 
 