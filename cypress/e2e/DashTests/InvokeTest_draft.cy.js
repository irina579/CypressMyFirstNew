let x
describe("find text of an attribute in Cypress ", () => {
    it("Alias First Test - Using Invoke Command ", function () {
           cy.visit("https://www.linkedin.com/")
           cy.get('[data-test-id="hero__headline"]').invoke('text').as('textFunction');
           cy.log("Hey", this.textFunction)
   
       });
   
   
       it("Print Value - ALias => Invoke - Command ", function () {
           cy.log("===== Print Value Using Invoke Command ==== ", this.textFunction)
       })
       
       })
       it.skip("Capture part of link", () => {
        // cy.xpath("//div[normalize-space(text()) = 'DL Dept. Ones']").click()
        // cy.contains(".tab-title", "Vacancies converted info").click()
        cy.visit('https://docs.cypress.io/api/commands/location') 
        cy.url().then(urlString =>x=urlString)
        cy.log(x) 
       })
       it.skip("API2", () => {
        // cy.xpath("//div[normalize-space(text()) = 'DL Dept. Ones']").click()
        // cy.contains(".tab-title", "Vacancies converted info").click()
        cy.log(x) 
        let from=x.search('=')+1;
        let to=x.length;
        let newstr=x.substring(from,to);
        cy.log(newstr)
       })