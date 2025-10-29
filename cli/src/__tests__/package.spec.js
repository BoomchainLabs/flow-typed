/* eslint-env jest */
// Configuration tests for cli/package.json to validate upgraded versions and key invariants
const path = require('path');
const pkg = require(path.join(__dirname, '..', '..', 'package.json'));

describe('cli/package.json invariants', () => {
  test('dependencies include expected upgraded versions', () => {
    const deps = pkg.dependencies || {};
    expect(deps.flowgen).toBe('^1.21.0');
    expect(deps.glob).toBe('^7.2.3');
    expect(deps.mkdirp).toBe('^1.0.4');
    expect(deps['simple-git']).toBe('^3.28.0');
    expect(deps.yargs).toBe('^15.4.1');
  });

  test('metadata and test configuration are present', () => {
    expect(pkg.engines && pkg.engines.node).toBe('>=10.0.0');
    expect(pkg.packageManager).toBe('yarn@1.22.19');
    expect(pkg.scripts && pkg.scripts['test-quick']).toMatch(/jest/);
    expect(pkg.jest).toBeDefined();
    expect(pkg.jest.modulePathIgnorePatterns).toContain('<rootDir>/dist/.*');
  });
});