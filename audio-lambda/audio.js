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

const S3 = new AWS.S3({
    accessKeyId: "AKIAQS6BQ7LYHQ4FAFP7",
    secretAccessKey: "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"
})

exports.handler = async (event) => {
    
    // let audioData = event.body;
    
    // let audioDataSegment = event.headers.index;
    
    // let epoch = getEpoch("2022-07-09 12:25:23") / 1000; //getEpoch(event.headers.timestamp);
    
    // let userid = 1; //event.headers.userid;
    
    // let entryReference = `${epoch}-${userid}-audio`;
    
    // let id = "Boo";
    
    let audioData = event.body;
    
    console.log(audioData)
    
    let audioIndex = event.headers.audioindex;
    
    console.log(audioIndex)
    
    let segmentIndex = event.headers.segmentindex;
    
    console.log(segmentIndex)
    
    let userid = event.headers.userid;
    
    console.log(userid)
    
    let epoch = getEpoch(event.headers.timestamp) / 1000;
    
    console.log(epoch)
    
    let audioReference = `${epoch}-${userid}-${audioIndex}`;
    
    console.log(audioReference)
    
    let query;

    if (segmentIndex == 0) {
        query = `INSERT INTO audio_buffer VALUES(\"${audioReference}\", \"${audioData}\")`;
    } else {
        query = `UPDATE audio_buffer SET \`sound\` = CONCAT(sound, \"${audioData}\") WHERE id = \"${audioReference}\"`;
    }
    
    let results = await mysql.query(query);
    
    await mysql.end();
    
    /**
    
    let audioData = event.body;
    
    let audioIndex = event.headers.audioindex;
    
    let segmentIndex = event.headers.segmentindex;
    
    let userid = event.headers.userid;
    
    let epoch = getEpoch(event.headers.timestamp) / 1000;
    
    let audioReference = `${epoch}-${userid}-${audioIndex}`;
    
    let query;

    if (segmentIndex == 0) {
        query = `INSERT INTO audio_buffer VALUES(\"${audioReference}\", \"${audioData}\")`;
    } else {
        query = `UPDATE audio_buffer SET \`sound\` = CONCAT(sound, \"${audioData}\") WHERE id = \"${audioReference}\"`;
    }
    
    let results = await mysql.query(query);
    
    await mysql.end();
    
    */
    
    // let query = `UPDATE audio_buffer SET \`sound\` = CONCAT(sound, \"${audioData}\") WHERE id = \"${id}\"`;
    
    // let results = await mysql.query(query);
    
    // await mysql.end()
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('Audio Index Upload!'),
    };
    return response;
};
