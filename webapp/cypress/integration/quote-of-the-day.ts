describe('Save quote of the day', () => {
  it('Save suggested quote', () => {
    cy.visit('/home');
    cy.wait(1000);
    let quoteOfTheDay = '';
    let quoteText = '';
    let quoteAuthor = '';
    cy.get('[id=quote-of-the-day]')
      .invoke('val')
      .then((quote: any) => {
        quoteOfTheDay = quote;
        cy.log(quoteOfTheDay);
        let splitted = quoteOfTheDay.split('(');
        quoteText = splitted[0].trimEnd();
        quoteAuthor = splitted[1].slice(0, -1).trim();
        cy.get('[id=save-quote-of-the-day]').click();
        cy.wait(2000);
        cy.get('tr').eq(1).get('td').eq(0).should('contain', quoteAuthor);
        cy.get('tr').eq(1).get('td').eq(1).should('contain', quoteText);
        cy.get('[id=toolbar]').should('not.exist');
      });
  });
});
