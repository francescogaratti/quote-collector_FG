import { includes } from 'cypress/types/lodash';

describe('Quote filter', () => {
  it('Filters by keywords', () => {
    cy.visit('/');
    cy.wait(1000);
    //cy.get('[id=filter]').type('two');
    cy.get('[id=filter]').type('Michael Scott');
    cy.get('tr').contains(
      'td',
      'I’m not superstitious, but I am a little stitious.'
    );
    cy.get('[id=filter]').clear();
    cy.get('[id=filter]').type('two three');
    cy.get('tr').contains('td', 'Two gust is megl che uan');
    cy.get('tr').contains('td', 'Three is a magic number');
    //cy.wait(3000);
  });
});
