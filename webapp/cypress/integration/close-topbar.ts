describe('Close quote of the day topbar', () => {
  it('Close quote suggestion topbar', () => {
    cy.visit('/home');
    // cy.get('[id=google-login]').click();
    cy.wait(1000);
    cy.get('[id=close-suggestion]').click();
    cy.get('[id=toolbar]').should('not.exist');
  });
});
