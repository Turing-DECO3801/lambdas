const AWS = require('aws-sdk');
// const mysql = require('serverless-mysql')({
//     config: {
//         host: "iot-core-database.cyxshb8rdcqi.ap-southeast-2.rds.amazonaws.com",
//         database: "hiking_memory_maker",
//         user: "admin",
//         password: "deco3801",
//     }
// })

const getEpoch = (timestamp) => {
    return Date.parse(timestamp);
}

const S3 = new AWS.S3({
    accessKeyId: "AKIAQS6BQ7LYHQ4FAFP7",
    secretAccessKey: "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"
})


exports.handler = async (event) => {
    
    console.log(event);
    
    // let epoch = getEpoch("2022-07-09 12:25:23") / 1000; //getEpoch(event.headers.timestamp);
    
    // let userid = 1; //event.headers.userid;
    
    // let filename = `${epoch}-${userid}-gps`;
    
    // let filePath = `gps-logs/${filename}.csv`;
    
    // let csv = "hello\r\nhello2\r\n"; //event.body;
    
    // let params = {
    //     "acl": 'public-read',
    //     "Body": csv,
    //     "Bucket": "gps-logs-deco",
    //     "Key": filePath
    // }
    
    // S3.upload(params, (err, data) => {
    //     if (err) {
    //         console.log(err);
    //         throw err;
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
    
    // let query = `INSERT INTO hikes VALUES(NULL, ${userid}, \"${filename}\", NULL, NULL, NULL, NULL)`;

    // let results = await mysql.query(query)
    
    // await mysql.end()
    

    
    let gpsLogs = event.body;

    let userid = event.headers.userid;

    let epoch = getEpoch(event.headers.timestamp) / 1000;

    let gpsReference = `${epoch}-${userid}-gps`;

    let filePath = `gps-logs/${gpsReference}.csv`;
    
    //     let params = {
    //     "acl": 'public-read',
    //     "Body": gpsLogs,
    //     "Bucket": "gps-logs-deco",
    //     "Key": filePath
    // }
    
    // S3.upload(params, (err, data) => {
    //     if (err) {
    //         console.log(err);
    //         throw err;
    //     }
    // });
    
    // let query = `INSERT INTO hikes VALUES(NULL, ${userid}, \"${filename}\", NULL, NULL, NULL, NULL)`;

    // let results = await mysql.query(query)
    
    // await mysql.end()
    
    // let statusCode = results.insertId > 0 ? 200 : 400;
    
    const response = {
        statusCode: 200,
    };
    return response;
};
