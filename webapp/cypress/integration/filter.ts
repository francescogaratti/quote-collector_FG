describe('Quote filter', () => {
  it('Filters by keywords', () => {
    cy.visit('/');
    cy.wait(1000);
    cy.get('[id=filter]').type('Dwight Schrute');
    cy.get('tr').should('contain', 'Today, smoking is going to save lives.');
    cy.get('[id=filter]').clear();
    cy.get('[id=filter]').type('two three');
    cy.get('tr').should('contain', 'Two gust is megl che uan');
    cy.get('tr').should('contain', 'Three is a magic number');
  });
});
