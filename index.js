var MYSQL = require('mysql');
const AWS = require('aws-sdk');

exports.handler = async (event, context, callback) => {
    let connection = MYSQL.createConnection({
        host: "iot-core-database.cyxshb8rdcqi.ap-southeast-2.rds.amazonaws.com",
        user: "admin",
        password: "deco3801",
        port: "3306",
        database: "iotdb"
    });

    const s3 = new AWS.S3({
        accessKeyId: "AKIAQS6BQ7LYHQ4FAFP7",
        secretAccessKey: "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"
    })
    
    let str2 = JSON.stringify(event, null, 2);
    let data = JSON.parse(str2);
    
    let timestamp = data["timestamp"];
    let payload = data["payload"];
    let query = `insert into iot values(\'${timestamp}\',\'${payload}\')`;
    
    const params = {
        acl: 'public-read',
        Bucket: "gps-logs-deco",
        Key: `test.csv`,
        Body: payload
    }
      
    s3.upload(params, (err, data) => {
        if (err) {
          reject(err)
        }
        resolve(data.Location)
    })

    connection.query(query, function(error, results, fields) {
        if (error) throw error;
        console.log("The solution is: ", results);
    });

    connection.end();
};
