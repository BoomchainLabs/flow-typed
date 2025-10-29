// @flow

const packageJson = require('../../package.json');
const fs = require('fs');
const path = require('path');

describe('package.json', () => {
  it('should have required metadata fields', () => {
    expect(packageJson.name).toBe('flow-typed');
    expect(packageJson.version).toBeDefined();
    expect(packageJson.description).toBeDefined();
    expect(packageJson.license).toBe('MIT');
    expect(packageJson.repository).toBeDefined();
    expect(packageJson.repository.type).toBe('git');
  });

  it('should have valid main and bin entries', () => {
    expect(packageJson.main).toBe('dist/cli.js');
    expect(packageJson.bin).toBe('dist/cli.js');
  });

  it('should have required scripts', () => {
    expect(packageJson.scripts).toBeDefined();
    expect(packageJson.scripts.build).toBeDefined();
    expect(packageJson.scripts.test).toBeDefined();
    expect(packageJson.scripts.lint).toBeDefined();
    expect(packageJson.scripts.flow).toBeDefined();
  });

  describe('dependencies', () => {
    it('should have all required runtime dependencies', () => {
      const requiredDeps = [
        '@octokit/rest',
        'colors',
        'flowgen',
        'fs-extra',
        'glob',
        'got',
        'js-yaml',
        'md5',
        'mkdirp',
        'node-stream-zip',
        'prettier',
        'rimraf',
        'semver',
        'simple-git',
        'table',
        'which',
        'yargs'
      ];

      requiredDeps.forEach(dep => {
        expect(packageJson.dependencies[dep]).toBeDefined();
      });
    });

    it('should have updated flowgen to ^1.21.0', () => {
      expect(packageJson.dependencies.flowgen).toBe('^1.21.0');
    });

    it('should have updated glob to ^7.2.3', () => {
      expect(packageJson.dependencies.glob).toBe('^7.2.3');
    });

    it('should have updated md5 to ^2.3.0', () => {
      expect(packageJson.dependencies.md5).toBe('^2.3.0');
    });

    it('should have updated simple-git to ^3.28.0', () => {
      expect(packageJson.dependencies['simple-git']).toBe('^3.28.0');
    });

    it('should have updated yargs to ^15.4.1', () => {
      expect(packageJson.dependencies.yargs).toBe('^15.4.1');
    });

    it('should use semantic versioning for all dependencies', () => {
      const semverPattern = /^[\^~]?\d+\.\d+\.\d+/;
      Object.entries(packageJson.dependencies).forEach(([name, version]) => {
        expect(version).toMatch(semverPattern);
      });
    });
  });

  describe('devDependencies', () => {
    it('should have all required development dependencies', () => {
      const requiredDevDeps = [
        '@babel/cli',
        '@babel/core',
        '@babel/preset-env',
        '@babel/preset-flow',
        'eslint',
        'flow-bin',
        'jest'
      ];

      requiredDevDeps.forEach(dep => {
        expect(packageJson.devDependencies[dep]).toBeDefined();
      });
    });

    it('should have jest ^29.7.0', () => {
      expect(packageJson.devDependencies.jest).toBe('^29.7.0');
    });

    it('should have flow-bin 0.261.0', () => {
      expect(packageJson.devDependencies['flow-bin']).toBe('0.261.0');
    });
  });

  describe('engines', () => {
    it('should specify node version requirement', () => {
      expect(packageJson.engines).toBeDefined();
      expect(packageJson.engines.node).toBe('>=10.0.0');
    });
  });

  describe('package manager', () => {
    it('should specify yarn package manager', () => {
      expect(packageJson.packageManager).toBeDefined();
      expect(packageJson.packageManager).toMatch(/^yarn@/);
    });
  });

  describe('jest configuration', () => {
    it('should have jest configuration', () => {
      expect(packageJson.jest).toBeDefined();
    });

    it('should ignore dist and node_modules in module paths', () => {
      expect(packageJson.jest.modulePathIgnorePatterns).toContain(
        '<rootDir>/dist/.*'
      );
      expect(packageJson.jest.modulePathIgnorePatterns).toContain(
        '<rootDir>/node_modules/.*'
      );
    });

    it('should ignore fixture files in test paths', () => {
      expect(packageJson.jest.testPathIgnorePatterns).toContain(
        '<rootDir>/.*/__[^/]*-fixtures__/.*'
      );
    });
  });

  describe('dependency versions compatibility', () => {
    it('should not have conflicting peer dependencies', () => {
      // Ensure we don't have both exact and range versions of the same package
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // Check for common conflicts
      if (deps['@babel/core']) {
        const babelVersion = deps['@babel/core'].replace(/[\^~]/, '').split('.')[0];
        Object.keys(deps).forEach(dep => {
          if (dep.startsWith('@babel/')) {
            const version = deps[dep].replace(/[\^~]/, '').split('.')[0];
            // All babel packages should have compatible major versions
            expect(version).toBe(babelVersion);
          }
        });
      }
    });

    it('should use caret ranges for most dependencies', () => {
      const depsWithoutCaret = Object.entries(packageJson.dependencies)
        .filter(([name, version]) => !version.startsWith('^') && !version.startsWith('~'))
        .map(([name]) => name);
      
      // Only specific packages should have exact versions
      const allowedExact = ['colors', 'flow-bin'];
      depsWithoutCaret.forEach(dep => {
        if (!allowedExact.includes(dep)) {
          console.warn(`Warning: ${dep} does not use caret range`);
        }
      });
    });
  });

  describe('file structure validation', () => {
    it('should have package.json in correct location', () => {
      const packagePath = path.join(__dirname, '../../package.json');
      expect(fs.existsSync(packagePath)).toBe(true);
    });

    it('should have valid JSON structure', () => {
      const packagePath = path.join(__dirname, '../../package.json');
      const content = fs.readFileSync(packagePath, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });

  describe('security considerations', () => {
    it('should not have pre-install or post-install scripts', () => {
      // These can be security risks
      expect(packageJson.scripts.preinstall).toBeUndefined();
      expect(packageJson.scripts.postinstall).toBeUndefined();
    });

    it('should have prepare script for build', () => {
      expect(packageJson.scripts.prepare).toBeDefined();
    });
  });

  describe('published package configuration', () => {
    it('should have prepublishOnly script', () => {
      expect(packageJson.scripts.prepublishOnly).toBeDefined();
      expect(packageJson.scripts.prepublishOnly).toContain('README.md');
    });

    it('should have repository URL', () => {
      expect(packageJson.repository.url).toMatch(/github\.com/);
      expect(packageJson.repository.url).toContain('flow-typed');
    });

    it('should have bugs URL', () => {
      expect(packageJson.bugs).toBeDefined();
      expect(packageJson.bugs.url).toMatch(/github\.com/);
    });

    it('should have homepage', () => {
      expect(packageJson.homepage).toBeDefined();
      expect(packageJson.homepage).toMatch(/flow-typed/);
    });
  });
});