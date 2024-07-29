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
    retries:1,
    defaultCommandTimeout: 130000,
    pageLoadTimeout: 100000,
    requestTimeout:80000,
    responseTimeout:80000,
    video:false, 
    // numTestsKeptInMemory: 1,
    ///viewportWidth: 1680,
    //viewportHeight: 1050,
  
  },
env: {
    //clickup parameters
    clickup_usage: true,
    key:'pk_54525861_I991M9GR8VQ8GHZ3VH8OVEVIFFWJA5AC',
    states:"{\"onhold\": \"5099b5ec-242e-4f57-8cdc-b604e9e19e91\", \"failed\": \"d06a1041-540d-43e9-a833-e29676b4a12d\", \"passed\": \"b254d03a-cb45-40af-82a3-c28d27c0b11f\"}",
    // states:{
    //   onhold:'5099b5ec-242e-4f57-8cdc-b604e9e19e91',
    //   passed:'b254d03a-cb45-40af-82a3-c28d27c0b11f'
    // },

    login_g: 'global',
    password_g: 'global',
    IDL_dept: 'Studio Operations',
    DL_dept: 'Assets',
    discipline: 'Assets',
    generalist: ['London (MPC)', 'Berlin (MPC)'],

    //can be changed for test runs
    bu: 'MPC',
    //url_g: 'http://10.94.6.100', 
    url_g: 'http://5.75.182.20', //cloud stage
    site_id: 23002, //London
    IDL_dept_id: 23042, //Studio Operations
    DL_dept_id: 23012, //Assets
    EP_approval: true,
    India_site:false,
    
    // bu: 'Mikros Animation',
    // url_g: 'http://10.94.6.100:105',
    // site_id: 21051, //21003-Paris //21003  - Montreal//21050 - New York// 21051 - Bangalore (MA)
    // IDL_dept_id: 21031, //Production Management
    // DL_dept_id: 21007, //Assets 
    // EP_approval: false,
    // India_site:true,
    
    // bu: 'TCI',
    // url_g: 'http://10.94.6.100:105',
    // site_id: 1002, //TCI
    // IDL_dept_id: 1030, //Production Management
    // DL_dept_id: 1006, //Assets
    // EP_approval: true,
    // India_site:true,

    // bu: 'Technicolor Games',
    // url_g: 'http://10.94.6.100:105',
    // site_id: 11002, //TCI
    // IDL_dept_id: 1030, //Production Management
    // DL_dept_id: 11006, //Assets
    // EP_approval: false,
    //India_site:true,

    // bu: 'MPC',
    // url_g: 'http://10.94.6.100:600', 
    // site_id: 23007, //Bangalore
    // IDL_dept_id: 23043, //Studio Operations
    // DL_dept_id: 23013, //Assets
    // EP_approval: false,
    // India_site:true,



    //useless for now
      /* db: {
        host: "",
        user: "trruUser",
        password: "",
        database: "Dash_Anonymise_stage"
      } */

      
        db: {
          server: "",
          user: "trruUser",
          password: "*",
          database: "Dash_Anonymise_stage"
        }
      
      


  },

};

/* //not working all below
//const mssql = require('mssql');
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
} */