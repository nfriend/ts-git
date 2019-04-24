import * as jasmineReporters from 'jasmine-reporters';

const junitReporter = new jasmineReporters.JUnitXmlReporter({
  savePath: 'test-results',
  consolidateAll: true,
});

jasmine.getEnv().addReporter(junitReporter);
