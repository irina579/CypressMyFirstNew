describe('Dynamic DB Query Test', () => {
  it('Should successfully connect to the database', () => {
    cy.task('testDbConnection').then((result) => {
      // Assert that the connection was successful
      expect(result).to.equal('Connection successful');
    });
  });
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
  it('Check if feature=18 is enabled for MPC BU in Config.BusinessUnitFeatures table', () => {
    //const query = "Select * from Config.BusinessUnitFeatures where BusinessUnitId in (select EntityId from dbo.entities where Name='MPC' and Deleted=0)";
    const query = "Select * from Config.BusinessUnitFeatures where BusinessUnitId in (select EntityId from dbo.entities where Name="+"'"+Cypress.env('bu')+"'"+" and Deleted=0)";

    Cypress.env('bu')
    cy.task('queryDb', query).then((result) => {
      // Ensure at least 3 records exist
      expect(result).to.have.length.greaterThan(1);
  
      // Check if any record has FeatureId = 18
      const hasFeatureId18 = result.some(item => item.FeatureId === 18);
      expect(hasFeatureId18).to.be.true; // Assert that at least one record has FeatureId = 18
  
      // Verify other assertions
      const thirdRecord = result[1]; // Get the second record (index 1)
      expect(thirdRecord.FeatureId).to.equal(19); // Example assertion for FeatureId
      expect(thirdRecord.FeatureId).to.be.a('number'); // Ensure FeatureId is a number
    });
  });
  
});








