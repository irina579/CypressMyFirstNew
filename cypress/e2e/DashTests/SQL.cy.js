describe('My Test Suite', () => {
  it('SQL', function () {
    cy.task('queryDb', `SELECT COUNT(*) as "rowCount" FROM dwh.Artist WHERE EmployeeType='NH' and BuId=1001`).then((result) => {

        expect(result[0].rowCount).to.equal(394)
    })
})
})