require('dotenv').config();

const { v4: uuidv4 } = require('uuid');

// Generate unique ID and append to file name to prevent duplicate 
const uniqId = uuidv4();

// Import GCS Bucket object uploader module
const uploadFile = require('./gcloud-bucket-storage/file-uploader');

// Import GCS Bucket object mover module 
const moveFile = require('./gcloud-bucket-storage/file-mover');

// Import GCS Bucket object copier module
const copyFile = require('./gcloud-bucket-storage/file-copier');

// The ID Of your GCS bucket
const bucketName = process.env.BUCKET_NAME;

// The ID of your GCC destination bucket for copy operations
const destBucketName = process.env.DEST_BUCKET_NAME;

// The path to your file upload
const filePath = '../video/newyears.mov';

// The new ID for your GCS file
const destFileName = `newyears${uniqId}.mov`

// Upload file to GCS bucket 
uploadFile(bucketName, filePath, destFileName).catch(console.error);

/** Begin setting variables for transcoding job **/ 

const projectId = process.env.PROJECT_ID;

const location = process.env.PROJECT_LOCATION;

const inputUri = process.env.INPUT_URI_BASE + destFileName;

const outputUri = process.env.OUTPUT_URI;

const preset = process.env.VIDEO_PRESET;

// Imports the Transcoder library 
const {TranscoderServiceClient} = require('@google-cloud/video-transcoder').v1;

// Instantiate a client 
const transcoderServiceClient = new TranscoderServiceClient();

async function createJobFromPreset() {
  // Construct request
  const request = {
    parent: transcoderServiceClient.locationPath(projectId, location),
    job: {
      inputUri: inputUri,
      outputUri: outputUri,
      templateId: preset
    }
  };

  // Run request
  const [response] = await transcoderServiceClient.createJob(request);
  console.log(`Job: ${response.name}`);
  let jobId = response.name.split('/');
  jobId = jobId[jobId.length - 1];
  console.log(`Job ID: ${jobId}`);
  getJob(jobId);
  //console.log(`Job object: ${JSON.stringify(response)}`);
}
createJobFromPreset();

/** Get Job Status **/

async function getJob(jobId) {
  // Construct request
  const request = {
    name: transcoderServiceClient.jobPath(projectId, location, jobId)
  };
  const [response] = await transcoderServiceClient.getJob(request);
  switch (response.state) {
    case 'PENDING':
      console.log(`Job state: ${response.state}`);
      getJob(jobId);
      break;
    case 'RUNNING':
      console.log(`Job state: ${response.state}`);
      getJob(jobId);
      break;
    case 'SUCCEEDED':
      // Download or move file once job status is SUCCEEDED
      console.log(`Job state: ${response.state}`);
      let srcFileName = 'output/hd.mp4';
      let newDestFileName = `${destFileName.split('.')[0]}`;
       // TODO: Initiate copy operation
       copyFile(bucketName, srcFileName, destBucketName, newDestFileName).catch(console.error);
      // Save reference of public transcoded media URL 
      const transcodedMediaUrl = `https://storage.googleapis.com/${destBucketName}/${newDestFileName}`; 
      break;
    case 'FAILED':
      console.error(`Job state: ${response.state}`);
      break;
    case 'PROCESSING_STATE_UNSPECIFIED':
      console.log(`Job state: ${response.state}`);
      break;
    default:
      console.error('An unknown error has occured.');
  }
}