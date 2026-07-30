const os = require('os');
const fs = require('fs');
const path = require('path');

module.exports = function(config) {
  "use strict";

  const networkInterfaces = os.networkInterfaces();
  const containerIp = Object.values(networkInterfaces)
    .flat()
    .find(i => i.family === 'IPv4' && !i.internal)?.address || 'localhost';

  config.set({
    frameworks: ['ui5', 'qunit', 'browserify', 'mocha'],

    ui5: {
      url: "https://sapui5.hana.ondemand.com",
      mode: "script",
      config: {
       async: true,
       resourceRoots: {
         "ns.html5module": "/base/webapp"      // lowercase — matches the app
      }
      },
    tests: [
      "ns/html5module/test/unit/AllTests",       // lowercase
      "ns/html5module/test/integration/AllJourneys"
    ] 
    },

    files: [
      { pattern: 'webapp/**', served: true, included: false, watched: true }
    ],

    preprocessors: {
      'webapp/!(test)/**/*.js': ['coverage']
    },

    reporters: ['progress', 'coverage', 'junit', 'sonarqubeUnit'],

    coverageReporter: {
      dir: 'reports',
      reporters: [
        // cobertura moved to its own subdir to avoid EEXIST collision
        { type: 'cobertura', subdir: 'coverage-cobertura', file: 'coverage.xml' },
        // lcov MUST stay in 'coverage' — pipeline reads reports/coverage/lcov.info
        { type: 'lcov',      subdir: 'coverage' },
        { type: 'text-summary' }
      ]
    },

    junitReporter: {
      outputDir: 'reports',
      outputFile: 'TESTS-karma.xml',
      useBrowserName: false,
      suite: 'KarmaTests'
    },

    sonarQubeUnitReporter: {
    sonarQubeVersion: "LATEST",
    outputFile: "reports/test-execution.xml",
    useBrowserName: false
    },

    port: 9876,
    hostname: containerIp,
    listenAddress: '0.0.0.0',
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,             // runs once & exits; correct for CI
    failOnEmptyTestSuite: false,

    browsers: ['SeleniumChrome'],
    customLaunchers: {
      SeleniumChrome: {
        base: 'WebDriver',
        config: {
          hostname: process.env.PIPER_SELENIUM_WEBDRIVER_HOSTNAME || 'selenium',
          port: parseInt(process.env.PIPER_SELENIUM_WEBDRIVER_PORT) || 4444
        },
        browserName: 'chrome',
        name: 'Karma',
        flags: ['--no-sandbox', '--disable-dev-shm-usage', '--headless'],
        pseudoActivityInterval: 30000
      }
    },

    captureTimeout: 210000,
    browserDisconnectTimeout: 210000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 210000,

    plugins: [
      'karma-ui5',
      'karma-qunit',
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-junit-reporter',
      'karma-browserify',
      'karma-coverage',
      'karma-webdriver-launcher',
      'karma-sonarqube-unit-reporter'
    ],

    concurrency: 1,
    forceJSONP: false
  });
};