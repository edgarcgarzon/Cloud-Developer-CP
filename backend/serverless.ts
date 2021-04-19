import type { AWS } from '@serverless/typescript';

import hello from '@functions/http/hello';
import auth from '@functions/auth';
import getNoteReq from '@functions/http/getNoteReq';
import postNoteReq from '@functions/http/postNoteReq';
import updateNoteReq from '@functions/http/updateNoteReq';
import NoteLiteTable from '@dataLayer/keepLiteTable'

const serverlessConfiguration: AWS = {
  service: 'keep-lite',
  frameworkVersion: '2',
  //--------------------------------------------------------
  plugins: [
    'serverless-webpack',
    "serverless-dynamodb-local",
    'serverless-offline'
  ],
  //--------------------------------------------------------
  provider: {
    name: 'aws',
    region: 'eu-central-1',
    stage: 'dev',
    runtime: 'nodejs14.x',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NOTE_LITE_TABLE: "NOTE_LITE_TABLE-${self:provider.stage}",
      NOTE_LITE_SGI1: "NOTE_LITE_SGI1-${self:provider.stage}"
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
    updateNoteReq
  },
  //--------------------------------------------------------
  resources:{
    Resources:{
      NoteLiteTable
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
    }
  }
};

module.exports = serverlessConfiguration;
