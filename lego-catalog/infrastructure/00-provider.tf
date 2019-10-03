provider "aws" {
  version = "~> 2.26.0"
  region  = var.aws_region
  profile = "jmcore"
}

terraform {
  required_version = ">=0.12"

  backend "s3" {
    bucket         = "jmcore-tf-state"
    key            = "serverless_workshop/terraform.tfstate"
    region         = "eu-west-1"
    profile        = "jmcore"
    dynamodb_table = "terraform-state-lock-dynamo"
  }
}