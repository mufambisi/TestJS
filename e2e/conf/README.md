# Description:

# This config file is meant to be used in the following way:

# - E2E CI Server job will read this file and prompt the defined variables to the user that is running the job

# - After capturing user's input, the CI Server job will pass it to E2E src/specs via command line arguments

# (e.g. ENVIRONMENT=staging yarn testcafe:local )

# File structure:

# The base section must be defined specifying the `default-environment` attribute.

# At least one environment should be defined

# and each environment can have the optional attributes `properties`.

# Base `properties` will be inherited by other environments

# and these can be overridden if set in the environment definition.

# Example of basic configuration:

# base:

# default-environment: staging

# properties:
