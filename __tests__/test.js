const app = require('../src/Zversion');
test('app test', () => {
  expect(app.update()).toBeUndefined();
  expect(app.update('minor')).toBeUndefined();
  expect(app.update('major')).toBeUndefined();
});

