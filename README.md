# vercel-upload-service
Vercel Upload Service that will take the github url of the public repo and will read the data from there and put that in our S3 bucket in AWS and then create a random 6 digit id for tasking tasks and push it to a message queue for our next service(lets say build service) to read and perform further actions.
