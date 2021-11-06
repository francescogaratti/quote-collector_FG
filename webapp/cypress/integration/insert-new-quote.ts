import { includes } from 'cypress/types/lodash';

let tester = 'tester';
let testQuote = 'This is a test quote.';

describe('Insert new quote', () => {
  it('Saves a new quote', () => {
    cy.visit('/');
    cy.get('[id=insert_author]').type(tester);
    cy.get('[id=insert_text]').type(testQuote);
    //cy.get('[id=save_quote]').click();
    cy.get('tr').eq(1).get('td').eq(0).should('contain', tester);
    cy.get('tr').eq(1).get('td').eq(1).should('contain', testQuote);
    //cy.wait(3000);
  });
});
