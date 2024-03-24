describe('Complete User Journey Test', () => {

  beforeEach(() => {
    cy.signIn();
  });

  it('performs a series of navigations after logging in', () => {
    cy.wait(1000);

    cy.url().should('include', '/home');


    cy.contains('Rate Maintenance').click();
    cy.url().should('include', '/rateMaintenance');
    cy.contains('Rate Table').should('be.visible');

    cy.contains('Room Maintenance').click();
    cy.url().should('include', '/roomMaintenance');
    cy.contains('Room Maintenance').should('be.visible');

    cy.contains('Tenant Maintenance', { timeout: 10000 }).click();
    cy.url({ timeout: 10000 }).should('include', '/tenantMaintenance');
    cy.contains('Tenant Maintenance').should('be.visible');

    cy.contains('Check In').click();
    cy.url().should('include', '/checkIn');

    cy.contains('Check Out').click();
    cy.url().should('include', '/checkOut');

    cy.contains('Generate Contract').click();
    cy.url().should('include', '/generatecontract');
    cy.contains('Contract Generation').should('be.visible');

    cy.contains('Generate Billing Date').click();
    cy.url().should('include', '/generatebilling');
    cy.contains('Generate Billing').should('be.visible');

    cy.contains('Enter Billing Details').click();
    cy.url().should('include', '/billingdetails');
    cy.contains('Billing Details').should('be.visible');

    cy.contains('Summary Billing Detail').click();
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

    cy.contains('Meter/Water').click();
    cy.url().should('include', '/SummaryMeter');
    cy.contains('Meter Readings').should('be.visible');

    cy.contains('Request').click();
    cy.url().should('include', '/Feedback');
    cy.contains('Request Maintenance').should('be.visible');

    cy.contains('ProfileSetting').click();
    cy.url().should('include', '/profile');


    cy.contains('Logout').click();
    cy.window().then((win) => {
      expect(win.localStorage.getItem('authToken')).to.be.null;
    });
    cy.url().should('include', '/signin');
  });
});
