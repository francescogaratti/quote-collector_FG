describe('Insert new quote', () => {
  it('Saves a new quote', () => {
    cy.visit('/home');
    cy.get('[id=copy-button]').eq(0).click();
    cy.window()
      .its('navigator.clipboard')
      .invoke('readText')
      .then((data: any) => {
        cy.log(data);
      });
  });
});
