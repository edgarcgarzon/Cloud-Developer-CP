import type { AWS } from '@serverless/typescript';

import hello from '@functions/http/hello';
import auth from '@functions/auth';
import getNoteReq from '@functions/http/getNoteReq';
import postNoteReq from '@functions/http/postNoteReq';

const serverlessConfiguration: AWS = {
  service: 'keep-lite',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    region: 'eu-central-1',
    stage: 'dev',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { 
    hello, 
    auth,
    getNoteReq,
    postNoteReq
  },
};

module.exports = serverlessConfiguration;
