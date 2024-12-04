describe('Dynamic DB Query Test', () => {
  it('Check if the third record has UserName "kate-mu"', () => {
    const query = 'SELECT TOP 5 UserId, UserName FROM dbo.UserProfile';

    cy.task('queryDb', query).then((result) => {
      expect(result).to.have.length.greaterThan(2); // Ensure at least 3 records

      const thirdRecord = result[2]; // Get the third record (index 2)

      // Clean up the UserName by trimming and replacing &nbsp; with an empty string
      const cleanedUserName = thirdRecord.UserName.trim().replace(/&nbsp;/g, '');

      expect(cleanedUserName).to.equal('kate-mu'); // Assert UserName is 'kate-mu'
      expect(thirdRecord.UserId).to.be.a('number'); // Ensure UserId is a number
    });
  });
});








