module.exports = {
  e2e: {
   experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    retries:0,
    defaultCommandTimeout: 15000
  
  },
env: {
    login_g: 'global',
    password_g: 'global',
    IDL_dept: 'Production Management',
    DL_dept: 'Assets',
    generalist: ['London (MPC)', 'Berlin (MPC)'],
    //MPC
    url_g: 'http://10.94.6.100', 
    site_id: 20002, //London
    IDL_dept_id: 20032, //Production Management
    DL_dept_id: 20008 //Assets
    
    //Mikros Anim
    // url_g: 'http://10.94.6.100:105',
    // site_id: 21002, //London
    // IDL_dept_id: 20031, //Production Management
    // DL_dept_id: 20008 //Assets
   

  },
};
