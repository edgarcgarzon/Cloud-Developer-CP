
export default {
    Type: "AWS::S3::Bucket",
    Properties: {
        BucketName: "${self:provider.environment.S3_BUCKET_ATTACH}",
        CorsConfiguration: {
            CorsRules: [
                {
                    AllowedOrigins: ["*"],
                    AllowedHeaders: ["*"],
                    AllowedMethods: ["GET", "PUT", "DELETE", "POST", "HEAD"],
                    MaxAge: 3000
                }
            ]
        }
    }
};