describe("db test", () => {
  it("Can select a flattened single-column value", () => {
	const sql = `select 'col1'`;

    cy.sqlServer(sql).should('eq', 'col1');
  });

  it("Can select a flattened multi-column set", () => {
	const sql = `select 'col1', 'col2'`;

    cy.sqlServer(sql).should('deep.eq', ['col1', 'col2']);
  });

  it("Can select a multi-row/multi-column set", () => {
	const sql = `select 'row1col1', 'row1col2' UNION select 'row2col1', 'row2col2'`;

    cy.sqlServer(sql).should('deep.eq', [['row1col1', 'row1col2'], ['row2col1', 'row2col2']]);
  });

  it("Can select a multi-row/single-column set", () => {
	const sql = `select 'row1' UNION select 'row2'`;

    cy.sqlServer(sql).should('deep.eq', [['row1'], ['row2']]);
  });
});

