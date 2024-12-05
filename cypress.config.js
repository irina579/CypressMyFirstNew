const sqlServer = require('cypress-sql-server');

module.exports = {
  projectId: "e3m7sj",
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: 'true'
  },
  e2e: {
    experimentalStudio: true, // Keep this if you're using experimental Studio feature
    setupNodeEvents(on, config) {
      // Existing task for dynamic database queries
      on('task', {
        // Task to execute dynamic SQL query and return the result
        queryDb(query) {
          return new Promise((resolve, reject) => {
            const sql = require('mssql'); // Ensure this dependency is installed
            const dbConfig = {
              server: '167.235.134.236',
              user: 'dash-sql-admin',
              password: 'MuKSn2zor%u7)Awt@759',
              database: 'Dash_Anonymise_stage',
              options: {
                encrypt: false,
                trustServerCertificate: true,
              },
            };

            // Connect to the database and execute the query dynamically
            sql.connect(dbConfig, (err) => {
              if (err) {
                reject(`Error connecting to database: ${err.message}`);
              } else {
                // Execute the provided query dynamically
                new sql.Request().query(query, (err, result) => {
                  if (err) {
                    reject(`Error executing query: ${err.message}`);
                  } else {
                    if (result.recordset.length > 0) {
                      // Return the result in JSON format for easier parsing
                      resolve(result.recordset);
                    } else {
                      resolve([]); // Return an empty array if no data is found
                    }
                  }
                });
              }
            });
          });
        },

        // Test DB connection to ensure database is reachable
        testDbConnection() {
          return new Promise((resolve, reject) => {
            const sql = require('mssql'); // Ensure this dependency is installed
            const dbConfig = {
              server: '167.235.134.236',
              user: 'dash-sql-admin',
              password: 'MuKSn2zor%u7)Awt@7',
              database: 'Dash_Anonymise_stage',
              options: {
                encrypt: false,
                trustServerCertificate: true,
              },
            };

            // Connect to the database and test the connection
            sql.connect(dbConfig, (err) => {
              if (err) {
                reject(`Error connecting to database: ${err.message}`);
              } else {
                resolve('Connection successful');
              }
            });
          });
        },
      });

      // Optional: Include other plugins (like cypress-mochawesome-reporter) if needed
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    retries: 1,
    defaultCommandTimeout: 80000,
    pageLoadTimeout: 80000,
    requestTimeout: 80000,
    responseTimeout: 80000,
    video: false,
  },

  env: {
    clickup_usage: false,
    key: 'pk_54525861_I991M9GR8VQ8GHZ3VH8OVEVIFFWJA5AC',
    states: "{\"onhold\": \"5099b5ec-242e-4f57-8cdc-b604e9e19e91\", \"failed\": \"d06a1041-540d-43e9-a833-e29676b4a12d\", \"passed\": \"b254d03a-cb45-40af-82a3-c28d27c0b11f\"}",
    login_g: 'global',
    password_g: 'global',
    IDL_dept: 'Studio Operations',
    DL_dept: 'Assets',
    discipline: 'Assets',
    generalist: ['London (MPC)', 'Berlin (MPC)'],
    bu: 'MPC',
    url_g: 'http://5.75.182.20', // cloud stage
    site_id: 23002, // London
    IDL_dept_id: 23042, // Studio Operations
    DL_dept_id: 23012, // Assets
    EP_approval: true,
    India_site: false,
  },
};