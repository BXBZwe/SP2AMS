// Cypress.Cookies.defaults({
//   preserve: 'authToken',
// });

// describe('Navigation Tests', () => {
//   beforeEach(() => {
//     cy.visit('/signin');
//     cy.get('input#name').type('BXBZwe');
//     cy.get('input#password').type('BXBZwe136928');
//     cy.get('button[type="submit"]').click();
//     cy.url().should('include', '/home');
//   });

//   it('navigates to Rate Maintenance page', () => {
//     cy.wait(1000);

//     cy.contains('Rate Maintenance').click();
//     cy.url().should('include', '/rateMaintenance');
//     cy.contains('Rate Table').should('be.visible');
//   });

//   it('navigate to Room Maintenance page', () => {
//     cy.contains('Room Maintenance').click();
//     cy.url().should('include', '/roomMaintenance');
//     cy.contains('Room Maintenace');
//   });

//   it('navigate to Tenant Maintenance page', () => {
//     cy.contains('Tenant Maintenance').click();
//     cy.url().should('include', '/tenantMaintenance');
//     cy.contains('Tenant Maintenance');
//   });

//   it('navigate to Check-In page', () => {
//     cy.contains('Check-In').click();
//     cy.url().should('include', '/checkIn');
//     cy.contains('Check-In');
//   });

//   it('navigate to Check-Out page', () => {
//     cy.contains('Check-Out').click();
//     cy.url().should('include', '/checkOut');
//     cy.contains('Check-Out');
//   });

//   it('navigate to Generate Contract page', () => {
//     cy.contains('Generate Contract').click();
//     cy.url().should('include', '/generatecontract');
//     cy.contains('Contract Generation');
//   });

//   it('navigate to Generate Billing Date page', () => {
//     cy.contains('Generate Billing Date').click();
//     cy.url().should('include', '/generatebilling');
//     cy.contains('Generate Billing');
//   });

//   it('navigate to Enter Billing Details page', () => {
//     cy.contains('Generate Billing Details').click();
//     cy.url().should('include', '/billingdetails');
//     cy.contains('Billing Details');
//   });

//   it('navigate to Summary Billing Detail page', () => {
//     cy.contains('Summary Billing Details').click();
//     cy.url().should('include', '/SummaryBillingDetail');
//     cy.contains('Summary Billing Details');
//   });

//   it('navigate to Printing/Payment page', () => {
//     cy.contains('Printing/Payment').click();
//     cy.url().should('include', '/printpayment');
//     cy.contains('Payment Generation');
//   });

//   it('navigate to Accural Billing Report page', () => {
//     cy.contains('Accural Billing Report').click();
//     cy.url().should('include', '/Summaryperiodicbilling');
//     cy.contains('Accrual Billing Report');
//   });

//   it('navigate to Periodic Billing Report page', () => {
//     cy.contains('Periodic Billing Report').click();
//     cy.url().should('include', '/Summaryaccuralbilling');
//     cy.contains('Periodic Billing Report');
//   });

//   it('navigate to Meter/Water page', () => {
//     cy.contains('Meter/Water').click();
//     cy.url().should('include', '/SummaryMeter');
//     cy.contains('Meter Readings');
//   });

//   it('navigate to Request page', () => {
//     cy.contains('Request').click();
//     cy.url().should('include', '/Feedback');
//     cy.contains('Request Maintenance');
//   });

//   it('navigate to Profile page', () => {
//     cy.contains('Profile').click();
//     cy.url().should('include', '/profile');
//     cy.contains('Profile');
//   });

//   it('logs out and redirects to the sign-in page', () => {
//     cy.contains('Logout').click();

//     cy.window().then((win) => {
//       expect(win.localStorage.getItem('authToken')).to.be.null;
//     });

//     cy.url().should('include', '/signin');
//   });


// });

// Cypress.Cookies.defaults({
//   preserve: 'authToken',
// });

describe('Complete User Journey Test', () => {

  beforeEach(() => {
    // cy.session('userSession', () => {
    cy.visit('/signin');
    cy.get('input#name').type('BXBZwe');
    cy.get('input#password').type('BXBZwe136928');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/home');
    // });
  });

  it('performs a series of navigations after logging in', () => {
    // Step 2: Go to Rate Maintenance
    cy.wait(1000);

    cy.contains('Rate Maintenance').click();
    cy.url().should('include', '/rateMaintenance');
    cy.contains('Rate Table').should('be.visible');

    // Step 3: Navigate to Room Maintenance page
    cy.contains('Room Maintenance').click();
    cy.url().should('include', '/roomMaintenance');
    cy.contains('Room Maintenance').should('be.visible');

    cy.contains('Tenant Maintenance').click();
    cy.url().should('include', '/tenantMaintenance');
    cy.contains('Tenant Maintenance').should('be.visible');

    cy.contains('Check-In').click();
    cy.url().should('include', '/checkIn');
    cy.contains('Check-In').should('be.visible');

    cy.contains('Check-In').should('be.visible').click();
    cy.url().should('include', '/checkOut');
    // cy.contains('Check-Out').should('be.visible');

    cy.contains('Generate Contract').click();
    cy.url().should('include', '/generatecontract');
    cy.contains('Contract Generation').should('be.visible');

    cy.contains('Generate Billing Date').click();
    cy.url().should('include', '/generatebilling');
    cy.contains('Generate Billing').should('be.visible');

    cy.contains('Generate Billing Details').click();
    cy.url().should('include', '/billingdetails');
    cy.contains('Billing Details').should('be.visible');

    cy.contains('Summary Billing Details').click();
    cy.url().should('include', '/SummaryBillingDetail');
    cy.contains('Summary Billing Details').should('be.visible');

    cy.contains('Printing/Payment').click();
    cy.url().should('include', '/printpayment');
    cy.contains('Payment Generation').should('be.visible');

    cy.contains('Accural Billing Report').click();
    cy.url().should('include', '/Summaryperiodicbilling');
    cy.contains('Accrual Billing Report').should('be.visible');

    cy.contains('Periodic Billing Report').click();
    cy.url().should('include', '/Summaryaccuralbilling');
    cy.contains('Periodic Billing Report').should('be.visible');

    cy.contains('Meter/Water').click();
    cy.url().should('include', '/SummaryMeter');
    cy.contains('Meter Readings').should('be.visible');

    cy.contains('Request').click();
    cy.url().should('include', '/Feedback');
    cy.contains('Request Maintenance').should('be.visible');

    cy.contains('Profile').click();
    cy.url().should('include', '/profile').should('be.visible');
    cy.contains('Profile');


    cy.contains('Logout').click();
    cy.window().then((win) => {
      expect(win.localStorage.getItem('authToken')).to.be.null;
    });
    cy.url().should('include', '/signin');
  });
});
