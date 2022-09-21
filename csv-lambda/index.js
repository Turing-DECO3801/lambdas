const AWS = require('aws-sdk');
const mysql = require('serverless-mysql')({
    config: {
        host: "iot-core-database.cyxshb8rdcqi.ap-southeast-2.rds.amazonaws.com",
        database: "hiking_memory_maker",
        user: "admin",
        password: "deco3801",
    }
})

const getEpoch = (timestamp) => {
    return Date.parse(timestamp);
}

const S3 = new AWS.S3();

exports.handler = async (event) => {
    
    let csv = event.body;
    
    // console.log(event);
    
    let query = `INSERT INTO test VALUES(\'hello\')`;

    let results = await mysql.query(query)
    
    let timestamp = getEpoch(event.headers.timestamp);

    let username = event.headers.user;
                
    let filePath = `gps-logs/${timestamp}-${username}-gps.csv`;
    
    // var params = {
    //     "Body": decodedCSV,
    //     "Bucket": "gps-logs-deco",
    //     "Key": filePath
    // }
    
    // S3.upload(params, (err, data) => {
    //     if (err) {
    //         callback(err, null);
    //     } else {
    //         let response = {
    //             "statusCode": 200,
    //             "headers": {
    //                 "my_header": "my_value"
    //             },
    //             "body": JSON.stringify(data),
    //             "isBase64Encoded": false
    //         };
    //     }
    // });
    
    // callback(null, response);

    await mysql.end()
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello From Lambda!'),
    };
    return response;
};
