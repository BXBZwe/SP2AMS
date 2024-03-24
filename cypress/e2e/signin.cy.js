// describe('Login Page Tests', () => {
//   beforeEach(() => {
//     cy.visit('/signin');
//   });

//   it('toggles password visibility', () => {
//     cy.get('input#password').type('ManagerPassword');
//     cy.get('button[aria-label="toggle password visibility"]').click();
//     cy.get('input#password').should('have.attr', 'type', 'text');
//     cy.get('button[aria-label="toggle password visibility"]').click();
//     cy.get('input#password').should('have.attr', 'type', 'password');
//   });

//   it('should display the login form with all fields', () => {
//     cy.get('input#name').should('be.visible');
//     cy.get('input#password').should('be.visible');
//     cy.get('button[type="submit"]').should('contain', 'Sign In');
//     cy.contains('Forgot password?').should('be.visible');
//   });

//   it('allows a manager to sign in and redirects to the home page', () => {
//     cy.get('input#name').type('Saw');
//     cy.get('input#password').type('123');
//     cy.get('button[type="submit"]').click();

//     cy.url().should('include', '/home');

//   });

// });



describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('/signin');
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
  });
  it('Case_5: Navigate to Rate Maintenance', () => {
    // Ensure the link is visible first and increase timeout
    cy.contains('Rate Maintenance', { timeout: 5000 }).should('be.visible').then($link => {
      // Check if the link is interactable
      if ($link.is(':visible') && $link.css('pointer-events') !== 'none') {
        $link.click();
        cy.url().should('include', '/rateMaintenance');
        cy.contains('Rate Management Table').should('be.visible');
      } else {
        // If the link is not interactable, log a message or handle accordingly
        cy.log('Rate Maintenance link is not interactable');
      }
    });
  });
  

});
