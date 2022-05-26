# Performance scripts

The performance tests have been implemented using the Origin [gatling-common](https://bitbucket.origin.com.au/projects/OD/repos/gatling-micro-site/browse) library.

## Environment Properties

The properties for each environemnt are stored and maintained in the `conf/config.json` file in this project.

## Environment Variables

The following environment variables must be set:
- (List required ENV_VARS here)

## Running the Tests locally

1. Set above environment variables

2. Open terminal in this (`perf`) folder.

3. Run the following command using gradle (or a wrapper script):

    ```
    gradle gatlingTest \
           -Denvironment=dev|test|staging \
           -requests_per_second=<No of request per second> \
           -Dduration_seconds=<duration in seconds> \
           -Dtrace=true|false
    ```

    Example:

    ```
    gradle gatlingTest -Denvironment=staging -Drequests_per_second=1 -Dduration_seconds=1
    ```

    Or using gradle wrapper:
    ```
    ./gradlew gatlingTest -Denvironment=staging -Drequests_per_second=1 -Dduration_seconds=1
    ```

## Running the Tests locally using perf.zip artifact

1. Open a command prompt in the `perf` folder
2. Run the following commands to build and unpack perf.zip
   - `rm -rf build`
   - `mkdir build`
   - `make build OUTPUT=build`
   - `cd build`
   - `unzip perf.zip`
3. Run the following command to run tests in extracted folder
   - `make run environment=staging requests_per_second=1 duration_seconds=1`
4. See reports at:
   -  `build/reports/gatling/{testname-timestamp}/index.html`
