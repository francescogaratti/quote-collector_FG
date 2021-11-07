describe('Insert new quote', () => {
  it('Saves a new quote', () => {
    cy.visit('/');
    cy.get('[id=copy-button]').eq(1).click();
    // cy.task('getClipboard').then((data) => {
    //   console.log(data);
    // });
    // cy.task('getClipboard').then((data) => {
    //   console.log(data);
    // });
  });
});
