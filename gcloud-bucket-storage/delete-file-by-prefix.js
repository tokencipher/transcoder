const deleteFile = require('./file-deleter');

// The ID of your GCS bucket
// const bucketName = 'your-unique-bucket-name';

// The directory prefix to search for
// const prefix = 'myDirectory/';

// The delimiter to use
// const delimiter = '/';

// Imports the Google Cloud client library 
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

async function deleteFileByPrefix(bucketName, prefix, delimiter = null) {
  const options = {
    prefix: prefix
  };

  if (delimiter) {
    options.delimiter = delimiter;
  }

  // List files in the bucket, filtered by a prefix
  const [files] = await storage.bucket(bucketName).getFiles(options);

  console.log('Files:');
  files.forEach(file => {
    if (file.name !== 'output/') {
      console.log(`Deleting -> ${file.name}`);
      deleteFile(bucketName, file.name);
    }
    
  });
}

module.exports = deleteFileByPrefix;