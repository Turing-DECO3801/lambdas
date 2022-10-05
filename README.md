# GPS Logging and Audio Recording Upload

## Functionality

The prototype contains a hardware device that is capable of recording and storing audio and GPS information and we wanted a way of uploading the data in an easy way for users. The most sought after method of data upload was wireless through the internet. These Lambda Functions allow for this to take place with different Serverless functions uploading and storing data.

## AWS Lambdas

The Serverless Function being used for the upload of data has been with Lambda functions as they have their own endpoints for HTTPS requests. The hardware device used to record audio and GPS logs are able to communicate with the Lambda function where the lambda function will store uploaded data into databases and file storage.

So clearly seperate the different functions that are required for the data upload, multiple Lambda functions are running simultaneously for a single data upload so keep the HTTPS request minimal and specific to their function. The lambda functions that are being used are shown below.

### GPS Upload



### Audio Buffer Upload

### Audio Upload
