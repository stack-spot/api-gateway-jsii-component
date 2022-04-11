import * as index from '../lib/index';

describe('Index', () => {
  test('export ApiGateway class', () => {
    const classes = Object.keys(index);
    expect(classes).toContain('ApiGateway');
  });
});
