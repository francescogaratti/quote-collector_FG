describe('Quote filter', () => {
  it('Filters by keywords', () => {
    cy.visit('/');
    cy.wait(1000);

    let quote = cy.get('[id=quote-of-the-day]').invoke('val');
    // cy.get('[id=save-quote-of-the-day]').click();
    cy.wait(2000);
    cy.get('tr').eq(1).get('td').should('contain', quote);

    //cy.get('tr').contains('td', 'Three is a magic number');
  });
});
