sam package --output-template-file packaged.yaml --s3-bucket "$STAGE_BUCKET"
sam deploy --template-file ./packaged.yaml --stack-name "$STACK_NAME" --s3-bucket "$STAGE_BUCKET" --capabilities CAPABILITY_IAM --region "$AWS_REGION" --parameter-overrides Environment=$STAGE