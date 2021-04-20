import type { AWS } from '@serverless/typescript';

import hello from '@functions/http/hello';
import auth from '@functions/auth';
import getNoteReq from '@functions/http/getNoteReq';
import postNoteReq from '@functions/http/postNoteReq';
import updateNoteReq from '@functions/http/updateNoteReq';
import shareNoteReq from '@functions/http/shareNoteReq';
import attachmentNoteReq from '@functions/http/attachmentNoteReq';
import NoteLiteTable from '@dataLayer/dynamodb/keepLiteTable'
import NoteLiteS3BucketAttachment from '@dataLayer/s3/S3BucketAttachment'

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
    'serverless-offline'
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
      S3_BUCKET_ATTACH: "S3_BUCKET_ATTACHMENT-${self:provider.stage}",
      S3_BUCKET_ATTACH_SIG_URL_EXPIRATION: "3600",
      AUTH0_DOMAIN: "${ssm:auth0-domain~true}",
      AUTH0_SLS_APP_M2M_CLIENT_ID: "${ssm:auth0-serverless-app-M2M-ClientID~true}",
      AUT0_SLS_APP_M2M_CLIENT_SECRET: "${ssm:auth0-serverless-app-M2M-ClientSecret~true}",
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
    attachmentNoteReq
  },
  //--------------------------------------------------------
  resources:{
    Resources:{
      NoteLiteTable,
      NoteLiteS3BucketAttachment
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
    }
  }
};

module.exports = serverlessConfiguration;
