module.exports = {
  projectId: "e3m7sj",
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir:'cypress/reports',
    charts: 'true'
     },
  e2e: {
   experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', { queryDb: query => { return queryTestDb(query, config) }, }); 
       require('cypress-mochawesome-reporter/plugin')(on);
    },
    retries:0,
    defaultCommandTimeout: 40000,
    pageLoadTimeout: 80000
    ///viewportWidth: 1680,
    //viewportHeight: 1050,
  
  },
env: {
    key:'pk_8777980_', //to be replaced while running
    login_g: 'global',
    password_g: 'global',
    IDL_dept: 'Production Management',
    DL_dept: 'Assets',
    discipline: 'Assets',
    generalist: ['London (MPC)', 'Berlin (MPC)'],
    bu: 'MPC',
    url_g: 'http://10.94.6.100', 
    site_id: 20003, //Berlin
    IDL_dept_id: 20032, //Production Management
    DL_dept_id: 20008, //Assets
    
    // bu: 'Mikros Animation',
    // url_g: 'http://10.94.6.100:105',
    // site_id: 21002, //London
    // IDL_dept_id: 21031, //Production Management
    // DL_dept_id: 21007 //Assets
    

    //useless for now
      /* db: {
        host: "10.94.6.100\SQL2017_2,14334",
        user: "trruUser",
        password: "oa12Sql17",
        database: "Dash_Anonymise_stage"
      } */

      
        db: {
          server: "10.94.6.100\SQL2017_2,14334",
          user: "trruUser",
          password: "oa12Sql17",
          database: "Dash_Anonymise_stage"
        }
      
      


  },

};

//not working all below
const mssql = require('mssql');
//const syncSql=require('sync-sql');
function queryTestDb(query, config) {
  // creates a new mysql connection using credentials from cypress.json env's
  const connection = mssql.createConnection(config.env.db)

  
  // start connection to db
  connection.connect()
  // exec query + disconnect to db as a Promise
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) reject(error)
      else {
        connection.end()
        return resolve(results)
      }
    })
  })
}