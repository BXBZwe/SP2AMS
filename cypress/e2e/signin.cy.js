describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('/signin');
  });

  it('toggles password visibility', () => {
    cy.get('input#password').type('ManagerPassword');
    cy.get('button[aria-label="toggle password visibility"]').click();
    cy.get('input#password').should('have.attr', 'type', 'text');
    cy.get('button[aria-label="toggle password visibility"]').click();
    cy.get('input#password').should('have.attr', 'type', 'password');
  });

  it('should display the login form with all fields', () => {
    cy.get('input#name').should('be.visible');
    cy.get('input#password').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Sign In');
    cy.contains('Forgot password?').should('be.visible');
  });

  it('allows a manager to sign in and redirects to the home page', () => {
    cy.get('input#name').type('BXBZwe');
    cy.get('input#password').type('BXBZwe136928');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/home');

  });

});
