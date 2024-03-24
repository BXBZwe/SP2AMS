
describe('Login Page Tests', () => {
    beforeEach(() => {
        cy.visit('/signin');
        // window.localStorage.setItem('authToken', 'testtoken');

      });
    it('Case_1: Displays an error when fields are empty', () => {
        cy.get('button[type="submit"]').click().wait(1000);
        cy.contains('Manager name is required').should('be.visible');
        cy.contains('Password is required').should('be.visible');
      });
    
      it('Case_2: Displays an error Snackbar for incorrect credentials', () => {
        cy.get('input#name').type('Test').wait(250);
        cy.get('input#password').type('Wrong').wait(250);
        cy.get('button[type="submit"]').click().wait(1000);
        cy.get('.MuiAlert-message').should('contain', 'Incorrect Credentials!');
      });
    
      it('Case_3: Toggles password visibility', () => {
        cy.get('input#password').type('123');
        cy.get('button[aria-label="toggle password visibility"]').click().wait(500);
        cy.get('input#password').should('have.attr', 'type', 'text');
        cy.get('button[aria-label="toggle password visibility"]').click().wait(500);
        cy.get('input#password').should('have.attr', 'type', 'password');
      });
  
    
      it('Case_4: Allows a manager to sign in with correct credentials and redirects to the home page', () => {
        cy.get('input#name').type('Saw').wait(250);
        cy.get('input#password').type('123').wait(250);
        cy.intercept('POST', 'http://localhost:3000/login', {
          statusCode: 200,
          body: {
            token: 'testtoken'
          }
        }).as('loginRequest');
        cy.get('button[type="submit"]').click().wait(1000);
        cy.wait('@loginRequest');
        cy.url().should('include', '/home');

        // After successful login, navigate to Rate Maintenance
        cy.contains('Rate Maintenance').click();
        cy.url().should('include', '/rateMaintenance').wait(1000);
        // cy.contains('RateTable').should('be.visible');

  // Check if the DataGrid says "No rows" indicating it's empty
  cy.get('.MuiDataGrid-overlay').should('contain', 'No rows');

  // Or you could check if the count of rows is 0
  // You would need to replace 'data-grid-rows-container' with the actual selector for your rows container
  cy.get('data-grid-rows-container').children().should('have.length', 0);

      });
  
  });
  
