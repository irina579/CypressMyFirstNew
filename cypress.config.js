module.exports = {
  projectId: "e3m7sj",
  e2e: {
   experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    retries:0,
    defaultCommandTimeout: 30000
  
  },
env: {
    login_g: 'global',
    password_g: 'global',
    IDL_dept: 'Production Management',
    DL_dept: 'Assets',
    generalist: ['London (MPC)', 'Berlin (MPC)'],
    // bu: 'MPC',
    // url_g: 'http://10.94.6.100', 
    // site_id: 20003, //London
    // IDL_dept_id: 20032, //Production Management
    // DL_dept_id: 20008 //Assets
    
    bu: 'Mikros Animation',
    url_g: 'http://10.94.6.100:105',
    site_id: 21002, //London
    IDL_dept_id: 21031, //Production Management
    DL_dept_id: 21007 //Assets
   

  },
};
