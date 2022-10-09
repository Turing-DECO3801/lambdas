# GPS Logging and Audio Recording Upload

## How To Use
These Serverless functions have been uploaded to the AWS Lambdas and are highly dependent on other AWS services such as AWS RDS as the database provider and AWS S3 for file storage. These functions can be uploaded to AWS as a ZIP file however, configuration of environment variables containing passwords and authorisation keys must also be included the Lambda.  

## Functionality

![image](https://user-images.githubusercontent.com/86467852/194072490-8ef8fa89-0225-4d67-8b5f-1393273a47bd.png)


The prototype contains a hardware device that is capable of recording and storing audio and GPS information and we wanted a way of uploading the data in an easy way for users. The most sought after method of data upload was wireless through the internet. These Lambda Functions allow for this to take place with different Serverless functions uploading and storing data.

## AWS Lambdas

The Serverless Function being used for the upload of data has been with Lambda functions as they have their own endpoints for HTTPS requests. The hardware device used to record audio and GPS logs are able to communicate with the Lambda function where the lambda function will store uploaded data into databases and file storage.

So clearly seperate the different functions that are required for the data upload, multiple Lambda functions are running simultaneously for a single data upload so keep the HTTPS request minimal and specific to their function. The lambda functions that are being used are shown below.

Multiple Lambda functions have allowed multiple calls to be made as there are many dependencies in the upload process after a single hike. This is the upload and insertino of multiple voice memos in a single hike which requires a reference to the hike in the main table. 

### GPS Upload

The GPS upload will require the CSV data of the GPS logs to be sent along with relevant information such as timestamp and user ID to correctly reference the user that this will be storerd under. In the GPS call, a CSV file will be inserted into the S3 database with a reference ID dependent on the timestamp and the S3 reference will then be stored in the MySQL database along with information required on the front end application.

Information required to be sent with the HTTP POST request will be the 
```
POST Request

Headers: {
  id: device_id,
  start_time: float,
}

Body: {
  value: raw_csv_data
}
```


### Audio Buffer Upload

Through testing, it was found that hardware libraries such as HTTPClient used on the M5STACK CORE2 had a limited number of bytes that could be sent in a single HTTP request. To counteract this, multiple HTTP requests are made with an intermediate buffer to concatenate the data to build the complete file. The concatenated data will be used in the final Audio Upload to decode the data into raw binary audio data and complete the process with insertions into the database and file storage.

```
POST Request

Headers: {
  id: device_id,
  start_time: float,
  audio_segment_index: integer,
}

Body: {
  value: encoded_audio_data
}
```

### Audio Upload

The last AWS Lambda was used to concatenate all the different audio segments that have been uploaded and decode it back into their raw audio data. The data had been encoded with Base64 encoding to prevent loss or corruption of data during upload. Once the data has been retrieved from the Buffer database table, it will be decoded and uploaded to an S3 Bucket and into the Memo table in the RDS for reference on the front end so it can be displayed with its relevant information.

```
POST Request

Headers: {
  id: device_id,
  start_time: float,
  audio_segment_index: integer,
}

Body: {
  value: gps_reference_index
}
```
