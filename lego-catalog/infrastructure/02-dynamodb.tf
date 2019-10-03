resource "aws_dynamodb_table" "serverless_workshop" {
  name           = "serverless_workshop"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "userID"

  attribute {
    name = "userID"
    type = "S"
  }

  tags = {
    Name        = "serverless_workshop"
  }
}