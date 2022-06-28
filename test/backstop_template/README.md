Sources:
  - https://www.metaltoad.com/blog/backstopjs-part-deux-javascript-config-and-makefile
  - https://www.metaltoad.com/blog/visual-regression-testing-backstopjs
  - https://github.com/angelariggs/visual-regression


BackstopJS Setup

1. npm install -g backstopjs (Global installation (recommended))

2. npm install

3. npm install minimist -> so that we can use BackstopJS with javascript config

4. npm install dotenv -> used for authentication, if we want to test login

5. Update testing paths in ./tests/backstop_<project_name>/paths.js

6. Update environment path vars in ./tests/backstop_<project_name>/backstop.js (line 16-19)


Running references and tests against the same environment

1. Navigate to ./tests/backstop_<project_name>

2. Run -> make <env>-reference or make <env>-test

Running references and tests against different environments

1. Navigate to ./tests/backstop_<project_name>

2. Run ->
  - backstop reference --configPath=backstop.js --pathFile=paths --env=<env> --refHost=<url_to_test_1>
  - backstop test --configPath=backstop.js --pathFile=paths --env=<env> --testHost=<url_to_test_2>

Approve and view report

1. Navigate to ./tests/backstop_<project_name>

2. Run -> make <env>-approve or make <env>-report

Test Local against Clone-live

1. make clone-live-reference
2. backstop test --configPath=backstop.js --pathFile=paths --env=clone-live --testHost=<LOCAL_URL>

Test QA against Clone-live

1. make clone-live-reference
2. backstop test --configPath=backstop.js --pathFile=paths --env=clone-live --testHost=<QA_URL>

Test Live against Clone-live

1. make clone-live-reference
2. backstop test --configPath=backstop.js --pathFile=paths --env=clone-live --testHost=<LIVE_URL>

Test Local against Live
1. make prod-reference
2. backstop test --configPath=backstop.js --pathFile=paths --env=prod --testHost=<LIVE_URL>
