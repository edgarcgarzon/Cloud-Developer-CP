# Note App Lite

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:


```
├── src
│   ├── businessLogic               #Business logic
│   ├── dataLayer                   #AWS/Auth0 data layer
│   │   ├── auth0       
│   │   ├── dynamodb    
│   │   ├── S3
│   │   ├── ses
│   │   └── sqs                     
│   ├── functions
│   │   ├── auth                    #Authentication lambda functions
│   │   ├── http                    #End points lambda functions
│   │   │   ├── attachmentNoteReq
│   │   │   ├── deleteNoteReq
│   │   │   ├── getNoteReq
│   │   │   ├── postNoteReq
│   │   │   ├── shareNoteReq
│   │   │   └── updateNoteReq
│   │   ├── s3                      #Lambda functions related to S3 events
│   │   └── sqs                     #Lambda functions related to SQS events
│   ├── libs
│   │   └── auth                    # Authentication utility functions
│   └── models                      # Data models used by all app
```


