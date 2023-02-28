# Introduction
Allows interaction with a SQL Server database from Cypress commands

# Install
Add git repo to your `package.json` dependencies

```
"cypress-sql-server": "*"
```

or use `npm install` and save

```
npm install --save-dev cypress-sql-server
```

# Configure
## Plugin file
The plug-in can be initialised in your `cypress/plugins/index.js` file as below.

```
const sqlServer = require('cypress-sql-server');

module.exports = (on, config) => {
  tasks = sqlServer.loadDBPlugin(config.db);
  on('task', tasks);
}
```

## Commands file
The extension provides multiple sets of commands. You can import the ones you need. Example `support/index.js` file.

```
import sqlServer from 'cypress-sql-server';
sqlServer.loadDBCommands();
```

## cypress.json
Your cypress.json (or environment specific files in the config directory) should specify the DB redentials in the following format

    "db": {
        "userName": "",
        "password": "",
        "server": "",
        "options": {
            "database": "",
            "encrypt": true,
            "rowCollectionOnRequestCompletion" : true
        }
    }

# Usage
## cy.sqlServer(query)

```
cy.sqlServer(`SELECT 'test').should('eq', 'test');
```

# Testing
## Run `npm test` to execute Cypress tests. Note that DB credentials will need to be provided in your cypress.json file first.