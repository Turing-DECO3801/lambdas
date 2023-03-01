const AWS = require('aws-sdk');

/**
 * MYSQL Reference used to create calls on the AWS RDS.
 * 
 * The data here has been set as Environment Variables on the AWS server.
 */
const mysql = require('serverless-mysql')({
    config: {
        host: "",
        database: "hiking_memory_maker",
        user: "",
        password: "",
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
    accessKeyId: "",
    secretAccessKey: ""
})

exports.handler = async (event) => {
    
    // Reference Information

    let audioData = event.body;
    
    let audioIndex = event.headers.audioindex;
    
    let segmentIndex = event.headers.segmentindex;
    
    console.log(segmentIndex);
    
    let userid = event.headers.userid;
    
    let epoch = getEpoch(event.headers.timestamp) / 1000;
    
    let audioReference = `${epoch}-${userid}-${audioIndex}`;
    
    console.log(audioReference);

    let query;

    // Checks whether the Audio Segment is the first to be uploaded or if there already
    // exists a reference that the audio segment should be appended to
    if (segmentIndex == 0) {
        query = `INSERT INTO audio_buffer VALUES(\"${audioReference}\", \"${audioData}\")`;
    } else {
        query = `UPDATE audio_buffer SET \`sound\` = CONCAT(sound, \"${audioData}\") WHERE id = \"${audioReference}\"`;
    }
    
    let results = await mysql.query(query);
    
    await mysql.end();
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('Audio Index Upload!'),
    };
    return response;
};
