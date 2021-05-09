import type { AWS } from '@serverless/typescript';

import hello from '@functions/http/hello';
import auth from '@functions/auth';
import getNoteReq from '@functions/http/getNoteReq';
import postNoteReq from '@functions/http/postNoteReq';
import updateNoteReq from '@functions/http/updateNoteReq';
import shareNoteReq from '@functions/http/shareNoteReq';
import deleteNoteReq from '@functions/http/deleteNoteReq';
import attachmentNoteReq from '@functions/http/attachmentNoteReq';
import attachmentEvent from '@functions/s3';
import notificationEvent from '@functions/sqs';
import DynamoDBNoteLiteTable from '@dataLayer/dynamodb/keepLiteTable'
import S3BucketAttachment from '@dataLayer/S3/S3BucketAttachment'
import SQSNotification from '@dataLayer/sqs/SQSNotification'

const serverlessConfiguration: AWS = {
  service: 'keep-lite',
  frameworkVersion: '2',
  //--------------------------------------------------------
  plugins: [
    'serverless-webpack',
    'serverless-iam-roles-per-function',
    'serverless-s3-local',
    "serverless-dynamodb-local",
    "serverless-offline-ssm",
    "serverless-offline-sqs", 
    'serverless-offline',
   
  ],
  //--------------------------------------------------------
  provider: {
    name: 'aws',
    region: 'eu-central-1',
    stage:  "${opt:stage, 'dev'}",
    runtime: 'nodejs14.x',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NOTE_LITE_TABLE: "NOTE_LITE_TABLE-${self:provider.stage}",
      NOTE_LITE_SGI1: "NOTE_LITE_SGI1-${self:provider.stage}",
      S3_BUCKET_ATTACH: "note.lite.s3.bucket.attachment-${self:provider.stage}",
      S3_BUCKET_ATTACH_SIG_URL_EXPIRATION: "3600",
      AUTH0_DOMAIN: "${ssm:auth0-domain~true}",
      AUTH0_SLS_APP_M2M_CLIENT_ID: "${ssm:auth0-serverless-app-M2M-ClientID~true}",
      AUT0_SLS_APP_M2M_CLIENT_SECRET: "${ssm:auth0-serverless-app-M2M-ClientSecret~true}",
      SQS_NOTIFICATION: "SQS_NOTIFICATION-${self:provider.stage}",
      APP_EMAIL: "note.lite.app@gmail.com ",
    },
    tracing:{
      lambda: true,
      apiGateway: true,
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    lambdaHashingVersion: '20201221',
  },
  //--------------------------------------------------------
  functions: { 
    hello, 
    auth,
    getNoteReq,
    postNoteReq,
    updateNoteReq,
    shareNoteReq, 
    attachmentNoteReq,
    attachmentEvent,
    deleteNoteReq,
    notificationEvent
  },
  //--------------------------------------------------------
  resources:{
    Resources:{
      DynamoDBNoteLiteTable,
      S3BucketAttachment,
      SQSNotification
    }
  },
  //--------------------------------------------------------
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    "serverless-offline": {
     port: 3030 
    },
    dynamodb: {
      stages: "dev",
      start:{
        port: 8000,
        inMemory: true,
        migrate: true
      }
    },
    "serverless-offline-ssm":{
      stages:['dev']
    },
    s3:{
      host: "localhost",
      port: 8080,
      directory: "./tmp"
    },
    "serverless-offline-sqs": {
      autoCreate: true,
      endpoint: 'http://0.0.0.0:9324',
      region: "${self:provider.region}",
      accessKeyId: "root",
      secretAccessKey: "root",
      skipCacheInvalidation: false
    }
  }
};

module.exports = serverlessConfiguration;
