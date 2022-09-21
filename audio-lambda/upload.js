const AWS = require('aws-sdk');
const mysql = require('serverless-mysql')({
    config: {
        host: "iot-core-database.cyxshb8rdcqi.ap-southeast-2.rds.amazonaws.com",
        database: "hiking_memory_maker",
        user: "admin",
        password: "deco3801",
    }
})

const sleep = ms => new Promise(r => setTimeout(r, ms));

const getEpoch = (timestamp) => {
    return Date.parse(timestamp);
}

const S3 = new AWS.S3({
    accessKeyId: "AKIAQS6BQ7LYHQ4FAFP7",
    secretAccessKey: "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"
});


exports.handler = async (event) => {
    
    // Reference Information
    
    // let userid = event.headers.userid;

    // let epoch = getEpoch(event.headers.timestamp) / 1000;
    
    // let audioIndex = event.headers.audioindex;
    
    // let filename = `${epoch}-${userid}-audio-${audioIndex}`;
    
    // let latitude = event.headers.latitude;
    
    // let longitude = event.headers.longitude;
    
    
    let epoch = getEpoch("2022-07-09 12:25:23") / 1000; //getEpoch(event.headers.timestamp);
    
    let userid = 1; //event.headers.userid;
    
    let audioIndex = 1;
    
    let filename = `${epoch}-${userid}-audio28`;
    
    
    // Obtaining the Hike ID as the Foreign Key in the Audio table
    
    let gpsReference = `${epoch}-${userid}-gps`;
    
    let idQuery = `SELECT id FROM hikes WHERE gps_logs = \"1662027950-test-gps\"`;
    
    let idResult = await mysql.query(idQuery);
    
    let hikeRefId = idResult[0].id;
    
    console.log(hikeRefId);
    
    await mysql.end();
    
    await sleep(300);
    
    
    // Obtain the Raw Binary Data for the Audio File
    
    let audioReference = `${epoch}-${userid}-${audioIndex}`;
    
    let filePath = `audio/${filename}.wav`;
    
    // let audioDataQuery = `SELECT sound FROM audio_buffer WHERE id = \"${audioReference}\"`;
    
    let audioDataQuery = `SELECT sound FROM audio_buffer WHERE id = \"Boo\"`;
    
    let audioDataResult = await mysql.query(audioDataQuery);
    
    await mysql.end();
    
    let base64 = Buffer.from((audioDataResult[0].sound).toString(), "base64");
    
    let decodedData = Buffer.from(base64, "base64");
    
    console.log(decodedData);
    
    await sleep(300);
    
    
    // Upload Of Data to the S3 Database
    
    // let params = {
    //     "acl": 'public-read',
    //     "Body": decodedData,
    //     "Bucket": "gps-logs-deco",
    //     "Key": filePath,
    // }
    
    // S3.upload(params, (err, data) => {
    //     if (err) {
    //         console.log(err);
    //         throw err;
    //     }
    // });

    await sleep(300);

    let memoUploadQuery = `INSERT INTO memos VALUES(NULL, ${hikeRefId}, \"${filename}\", -25, -25, NULL)`;
    
    let memoUploadResult = await mysql.query(memoUploadQuery);
    
    await mysql.end();
    
    await sleep(300);

    
    /**
    
    let userid = event.headers.userid;

    let epoch = getEpoch(event.headers.timestamp) / 1000;
    
    let audioIndex = event.headers.audioindex;
    
    let audioReference = `${epoch}-${userid}-${audioIndex}`;
    
    let filePath = `audio/${filename}.wav`;
    
    let query = `SELECT sound FROM audio_buffer WHERE id = \"${audioReference}\"`;
    
    let result = await mysql.query(query);
    
    await mysql.end();
    
    let binaryData = Buffer.from(result[0].sound, "binary");
    
    let base64 = Buffer.from((result[0].sound).toString(), "base64");
    
    let decodedData = Buffer.from(temp, "base64");
    
    await sleep(200);
    
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
    
    await sleep(200);
    */
    
    
    // let epoch = getEpoch("2022-07-09 12:25:23") / 1000; //getEpoch(event.headers.timestamp);
    
    // let userid = 1; //event.headers.userid;
    
    // let filename = `${epoch}-${userid}-audio28`;
    
    // let filePath = `audio/${filename}.wav`;
    
    // let query = `SELECT sound FROM audio_buffer WHERE id = \"Boo\"`;
    
    // let result = await mysql.query(query);
    
    // await mysql.end();
    
    // let binaryData = Buffer.from(result[0].sound, "binary");
    
    // let temp = Buffer.from((result[0].sound).toString(), "base64");
    
    // let temp2 = Buffer.from(temp, "base64");
    
    // await sleep(500);
    
    // let params = {
    //     "acl": 'public-read',
    //     "Body": temp2,
    //     "Bucket": "gps-logs-deco",
    //     "Key": filePath,
    // }
    
    // S3.upload(params, (err, data) => {
    //     if (err) {
    //         console.log(err);
    //         throw err;
    //     }
    // });
    
    // await sleep(500);
    
    const response = {
        statusCode: 200,
        body: "Hello"
    };
    return response;
};
