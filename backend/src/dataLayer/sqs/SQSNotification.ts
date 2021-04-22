export default {
    Type: "AWS::SQS::Queue",
    Properties: {
        QueueName: "${self:provider.environment.SQS_NOTIFICATION}"
    }
};