/* Quick guide to BackstopJS commands

  backstop reference --configPath=backstop.js --pathFile=paths --env=local --refHost=http://site.dev
  backstop test --configPath=backstop.js --pathFile=paths --env=local --testHost=http://site.dev

*/

var args = require('minimist')(process.argv.slice(2)); // grabs the process arguments
var dotenv = require('dotenv').config(); // handles basic auth
var defaultPaths = ['/']; // default path just checks the homepage as a quick smoke test
var scenarios = []; // The array that'll have the URL paths to check

// env argument will capture the environment URL
// if you use one of the options below to pass in, e.g. --env=dev
var environments = {
  'local': '',
  'qa': '',
  'clone-live': '',
  'prod': ''
};
var default_environment = 'prod';

var viewports = [
  {
    "name": "mobile",
    "width": 400,
    "height": 4000
  },
  {
    "name": "tablet",
    "width": 768,
    "height": 4000
  },
  {
    "name": "desktop-sml",
    "width": 1024,
    "height": 4000
  },
  {
    "name": "desktop-med",
    "width": 1200,
    "height": 4000
  },
  {
    "name": "desktop-lrg",
    "width": 1600,
    "height": 4000
  }
];


// Environments that are being compared
if (!args.env) {
  args.env = default_environment;
}
// if you pass in a bogus environment, it’ll still use the default environment
else if (!environments.hasOwnProperty(args.env)) {
  args.env = default_environment;
}

// Site for reference screenshots
if (!args.refHost) {
  args.refHost = environments[args.env];
}

// Site for test screenshots
if (!args.testHost) {
  args.testHost = environments[args.env];
}

// Directories to save screenshots
var saveDirectories = {
  "bitmaps_reference": "./backstop_data/reference_" + args.env + "",
  "bitmaps_test": "./backstop_data/test_" + args.env + "",
  "html_report": "./backstop_data/html_report_" + args.env + "",
  "ci_report": "./backstop_data/ci_report_" + args.env + ""
};

// Work out which paths to use: an array from a file, a supplied array, or defaults
// We'll be using the array from paths.js
if (args.pathFile) {
  var pathConfig = require('./' + args.pathFile + '.js'); // use paths.js file
  var paths = pathConfig.array;
} else if (args.paths) {
  pathString = args.paths; // pass in a comma-separated list of paths in terminal
  var paths = pathString.split(',');
} else {
  var paths = defaultPaths; // keep with the default of just the homepage
}

// Scenarios are a default part of config for BackstopJS
// Explanations for the sections below are at https://www.npmjs.com/package/backstopjs
for (var k = 0; k < paths.length; k++) {
  scenarios.push(
    {
      "label": paths[k],
      "referenceUrl": args.refHost + paths[k],
      "url": args.testHost + paths[k],
      "hideSelectors": [],
      "removeSelectors": [],
      "hoverSelectors": [],
      "clickSelectors": [],
      "postInteractionWait": 1000,
      "selectors": ["document"], // "document" will snapshot the entire page
      "onReadyScript": "", // If found will run instead of onReadyScript set at the root (.js suffix is optional)
      "delay": 1500,
      "misMatchThreshold": 1
    }
  );
}

////////////////////////////////////////////
//////////// FUNCTIONAL TESTS//////////////
////////////////////////////////////////////

/*
  Create .js files for each functional test you wish to perform.
  Files should be included in backstop_local/functional_tests folder.

  Enable the following code to add functional tests
*/

// scenarios.push(
//   require('./functional_tests/01-test1.js')(args),
//   require('./functional_tests/01-test2.js')(args),
// );


// BackstopJS configuration
module.exports =
  {
    "id": "project_" + args.env + "_config",
    "viewports":
      viewports,
    "onBeforeScript": "puppet/onBefore.js",
    "onReadyScript": "puppet/onReady.js",
    "scenarios":
      scenarios,
    "paths":
      saveDirectories,
    "casperFlags": ["--ignore-ssl-errors=true", "--ssl-protocol=any"],
    "engine": "puppeteer", // alternate can be slimerjs
    "engineFlags": [],
    "engineOptions": {
      "args": ["--no-sandbox"]
    },
    "report": ["browser", "CI"],
    "asyncCaptureLimit": 5,
    "asyncCompareLimit": 50,
    "debug": false,
    "debugWindow": false
  };
