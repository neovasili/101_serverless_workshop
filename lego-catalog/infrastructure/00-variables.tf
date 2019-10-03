variable "aws_region" {
  default = "eu-west-1"
}

data "aws_caller_identity" "aws_jmcore" {}

data "aws_availability_zones" "azs" {}