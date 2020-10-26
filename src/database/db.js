var mysql = require('mysql');

var connection = mysql.createConnection({ host: '', database: '', user: '', password: '', });
connection.connect(function (err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
});

export default connection;