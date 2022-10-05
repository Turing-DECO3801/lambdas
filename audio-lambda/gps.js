const AWS = require('aws-sdk');

/**
 * MYSQL Reference used to create calls on the AWS RDS.
 * 
 * The data here has been set as Environment Variables on the AWS server.
 */
const mysql = require('serverless-mysql')({
    config: {
        host: "iot-core-database.cyxshb8rdcqi.ap-southeast-2.rds.amazonaws.com",
        database: "hiking_memory_maker",
        user: "admin",
        password: "deco3801",
    }
})

/**
 * Converts a date-time to an epoch for unique file referencing based on
 * time of data logs and user ID.
 * 
 * @param {Epoch} timestamp 
 * @returns 
 */
const getEpoch = (timestamp) => {
    return Date.parse(timestamp);
}

/**
 * AWS S3 Reference used to upload files for reference in the RDS.
 */
const S3 = new AWS.S3({
    accessKeyId: "AKIAQS6BQ7LYHQ4FAFP7",
    secretAccessKey: "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"
})


exports.handler = async (event) => {

    // Reference Information
    
    let gpsLogs = event.body;

    let userid = event.headers.userid;

    let epoch = getEpoch(event.headers.timestamp) / 1000;
    
    let startTimeDate = event.headers.timestamp;
    
    let endTimeDate = event.headers.endtimestamp;

    let gpsReference = `${epoch}-${userid}-gps`;
    
    console.log(gpsReference);
    
    let filePath = `gps-logs/${gpsReference}.csv`;
    
    let params = {
        "acl": 'public-read',
        "Body": gpsLogs,
        "Bucket": "gps-logs-deco",
        "Key": filePath
    }
    
    S3.upload(params, (err, data) => {
        if (err) {
            console.log("Error Caught Here" + err);
            throw err;
        }
    });

    // Attempting to insert a reference of a new hike into the database
    let query = `INSERT INTO hikes VALUES(NULL, \"${userid}\", \"${gpsReference}\", NULL, \"${startTimeDate}\", \"${endTimeDate}\", \"Unnamed\", 0, NOW())`;

    let results = await mysql.query(query)


    await mysql.end()
    
    let statusCode = results.insertId > 0 ? 200 : 400;
    
    const response = {
        statusCode: 200,
    };
    return response;
};
