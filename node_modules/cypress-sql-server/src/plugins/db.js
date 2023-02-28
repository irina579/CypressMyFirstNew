const Tedious = require('tedious');

module.exports = (dbConfig) => {
    return {
      'sqlServer:execute': (sql) => {
        const connection = new Tedious.Connection(dbConfig);
        return new Promise((res, rej) => {
          connection.on('connect', err => {
            if (err) {
              rej(err);
            }

            const request = new Tedious.Request(sql, function(err, rowCount, rows) {
              return err ? rej(err) : res(rows);
            });

            connection.execSql(request);
          });
        });
      }
    }
  };