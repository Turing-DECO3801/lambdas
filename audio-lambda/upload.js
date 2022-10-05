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
 * Function used to asynchronously wait for S3 and MYSQL calls to finish
 * 
 * @param {Time} ms 
 * @returns 
 */
const sleep = ms => new Promise(r => setTimeout(r, ms));

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
});


exports.handler = async (event) => {
    
    // Reference Information
    
    let userid = event.headers.userid;

    let epoch = getEpoch(event.headers.timestamp) / 1000;
    
    let audioIndex = event.headers.audioindex;
    
    let filename = `${epoch}-${userid}-audio-${audioIndex}`;
    
    let latitude = Number(event.headers.latitude);
    
    let longitude = Number(event.headers.longitude);
    

    // Information logs for use on AWS CloudWatch
    console.log(filename);
    
    console.log(latitude);
    
    console.log(longitude);

    
    
    // Obtaining the Hike ID as the Foreign Key in the Audio table
    
    let gpsReference = `${epoch}-${userid}-gps`;
    
    let idQuery = `SELECT id FROM hikes WHERE gps_logs = \"${gpsReference}\"`;
    
    let idResult = await mysql.query(idQuery);
    
    let hikeRefId = idResult[0].id;
    
    console.log(hikeRefId);
    
    await mysql.end();
    
    await sleep(300);
    
    
    // Obtain the Raw Binary Data for the Audio File
    
    let audioReference = `${epoch}-${userid}-${audioIndex}`;
    
    let filePath = `audio/${filename}.wav`;
    
    let audioDataQuery = `SELECT sound FROM audio_buffer WHERE id = \"${audioReference}\"`;
        
    let audioDataResult = await mysql.query(audioDataQuery);
    
    await mysql.end();
    
    let base64 = Buffer.from((audioDataResult[0].sound).toString(), "base64");
    
    let decodedData = Buffer.from(base64, "base64");
    
    console.log(decodedData);
    
    await sleep(300);
    
    
    // Upload Of Data to the S3 Database
    
    let params = {
        "acl": 'public-read',
        "Body": decodedData,
        "Bucket": "gps-logs-deco",
        "Key": filePath,
    }
    
    S3.upload(params, (err, data) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });

    await sleep(300);
    
    
    // Upload the audio reference to the Memo table

    let memoUploadQuery = `INSERT INTO memos VALUES(NULL, ${hikeRefId}, \"${filename}\", ${latitude}, ${longitude}, NULL, NULL, )`;
    
    let memoUploadResult = await mysql.query(memoUploadQuery);
    
    await mysql.end();
    
    await sleep(300);
    
    const response = {
        statusCode: 200,
        body: "Hello"
    };
    return response;
};
