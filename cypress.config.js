module.exports = {
  e2e: {
   experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    retries:0,
    defaultCommandTimeout: 10000
  
  },
env: {
    url_g: 'http://10.94.6.100',
    login_g: 'global',
    password_g: 'global'
  },
};
