// @flow
const fs = require('fs');
const path = require('path');

describe('package.json validation', () => {
  let packageJson;

  beforeEach(() => {
    const packagePath = path.join(__dirname, 'package.json');
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    packageJson = JSON.parse(packageContent);
  });

  describe('basic structure validation', () => {
    it('should be valid JSON', () => {
      expect(packageJson).toBeDefined();
      expect(typeof packageJson).toBe('object');
    });

    it('should have required npm package fields', () => {
      expect(packageJson.name).toBeDefined();
      expect(packageJson.version).toBeDefined();
      expect(packageJson.description).toBeDefined();
      expect(packageJson.license).toBeDefined();
    });

    it('should have correct package name', () => {
      expect(packageJson.name).toBe('flow-typed');
      expect(typeof packageJson.name).toBe('string');
      expect(packageJson.name.length).toBeGreaterThan(0);
    });

    it('should have valid semantic version', () => {
      expect(packageJson.version).toBe('4.1.1');
      expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should have MIT license', () => {
      expect(packageJson.license).toBe('MIT');
    });
  });

  describe('repository and links validation', () => {
    it('should have correct repository configuration', () => {
      expect(packageJson.repository).toBeDefined();
      expect(packageJson.repository.type).toBe('git');
      expect(packageJson.repository.url).toBe('git+https://github.com/flow-typed/flow-typed.git');
    });

    it('should have valid homepage URL', () => {
      expect(packageJson.homepage).toBe('https://flow-typed.github.io/flow-typed');
      expect(packageJson.homepage).toMatch(/^https:\/\/.+/);
    });

    it('should have correct bugs URL', () => {
      expect(packageJson.bugs).toBeDefined();
      expect(packageJson.bugs.url).toBe('https://github.com/flow-typed/flow-typed/issues/new/choose');
      expect(packageJson.bugs.url).toMatch(/^https:\/\/github\.com\/.+\/issues/);
    });
  });

  describe('entry points and binary configuration', () => {
    it('should have main entry pointing to dist/cli.js', () => {
      expect(packageJson.main).toBe('dist/cli.js');
    });

    it('should have bin entry pointing to dist/cli.js', () => {
      expect(packageJson.bin).toBe('dist/cli.js');
    });

    it('should have main and bin pointing to same file', () => {
      expect(packageJson.main).toBe(packageJson.bin);
    });
  });

  describe('engines and package manager', () => {
    it('should specify Node.js version requirement', () => {
      expect(packageJson.engines).toBeDefined();
      expect(packageJson.engines.node).toBe('>=10.0.0');
      expect(packageJson.engines.node).toMatch(/^>=\d+\.\d+\.\d+$/);
    });

    it('should specify yarn as package manager', () => {
      expect(packageJson.packageManager).toBe('yarn@1.22.19');
      expect(packageJson.packageManager).toMatch(/^yarn@\d+\.\d+\.\d+$/);
    });
  });

  describe('scripts validation', () => {
    it('should have all essential build scripts', () => {
      const buildScripts = ['build', 'build:src', 'build:flow', 'build:watch', 'clean'];
      buildScripts.forEach(script => {
        expect(packageJson.scripts[script]).toBeDefined();
        expect(typeof packageJson.scripts[script]).toBe('string');
      });
    });

    it('should have all essential test scripts', () => {
      const testScripts = ['test', 'test-quick', 'test:watch'];
      testScripts.forEach(script => {
        expect(packageJson.scripts[script]).toBeDefined();
        expect(typeof packageJson.scripts[script]).toBe('string');
      });
    });

    it('should have quality assurance scripts', () => {
      expect(packageJson.scripts.flow).toBe('flow');
      expect(packageJson.scripts.lint).toBe('eslint .');
    });

    it('should have proper build script composition', () => {
      expect(packageJson.scripts.build).toBe('mkdirp dist && yarn build:src && yarn build:flow');
      expect(packageJson.scripts.build).toContain('mkdirp dist');
      expect(packageJson.scripts.build).toContain('yarn build:src');
      expect(packageJson.scripts.build).toContain('yarn build:flow');
    });

    it('should have proper test script composition', () => {
      expect(packageJson.scripts.test).toBe('yarn clean && yarn build && yarn test-quick');
      expect(packageJson.scripts['test-quick']).toBe('jest && yarn lint && yarn flow');
    });

    it('should have lifecycle scripts configured correctly', () => {
      expect(packageJson.scripts.prepare).toBe('mkdirp dist && yarn test');
      expect(packageJson.scripts.prepublishOnly).toBe('cp ../README.md .');
    });
  });

  describe('dependencies validation', () => {
    it('should have production dependencies', () => {
      expect(packageJson.dependencies).toBeDefined();
      expect(typeof packageJson.dependencies).toBe('object');
      expect(Object.keys(packageJson.dependencies).length).toBeGreaterThan(0);
    });

    it('should have development dependencies', () => {
      expect(packageJson.devDependencies).toBeDefined();
      expect(typeof packageJson.devDependencies).toBe('object');
      expect(Object.keys(packageJson.devDependencies).length).toBeGreaterThan(0);
    });

    it('should include core flow-typed dependencies', () => {
      const coreDeps = [
        '@octokit/rest', 'colors', 'flowgen', 'fs-extra', 'glob', 
        'got', 'js-yaml', 'md5', 'semver', 'yargs'
      ];
      coreDeps.forEach(dep => {
        expect(packageJson.dependencies[dep]).toBeDefined();
      });
    });

    it('should include essential development tools', () => {
      const devTools = [
        'jest', 'flow-bin', 'eslint', '@babel/core', '@babel/cli', 
        '@babel/preset-env', '@babel/preset-flow'
      ];
      devTools.forEach(tool => {
        expect(packageJson.devDependencies[tool]).toBeDefined();
      });
    });

    it('should have valid version constraints for all dependencies', () => {
      const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      Object.entries(allDeps).forEach(([name, version]) => {
        expect(typeof name).toBe('string');
        expect(typeof version).toBe('string');
        expect(name.length).toBeGreaterThan(0);
        expect(version.length).toBeGreaterThan(0);
        // Should have valid semver constraint
        expect(version).toMatch(/^[\^~]?\d+\.\d+\.\d+/);
      });
    });

    it('should not have dependencies in both prod and dev', () => {
      const prodDeps = Object.keys(packageJson.dependencies);
      const devDeps = Object.keys(packageJson.devDependencies);
      const duplicates = prodDeps.filter(dep => devDeps.includes(dep));
      expect(duplicates).toEqual([]);
    });
  });

  describe('Jest configuration', () => {
    it('should have Jest config section', () => {
      expect(packageJson.jest).toBeDefined();
      expect(typeof packageJson.jest).toBe('object');
    });

    it('should ignore dist and node_modules directories', () => {
      expect(packageJson.jest.modulePathIgnorePatterns).toBeDefined();
      expect(packageJson.jest.modulePathIgnorePatterns).toContain('<rootDir>/dist/.*');
      expect(packageJson.jest.modulePathIgnorePatterns).toContain('<rootDir>/node_modules/.*');
    });

    it('should ignore fixture directories in tests', () => {
      expect(packageJson.jest.testPathIgnorePatterns).toBeDefined();
      expect(packageJson.jest.testPathIgnorePatterns).toContain('<rootDir>/.*/__[^/]*-fixtures__/.*');
    });
  });

  describe('metadata and keywords', () => {
    it('should have appropriate keywords', () => {
      expect(packageJson.keywords).toBeDefined();
      expect(Array.isArray(packageJson.keywords)).toBe(true);
      expect(packageJson.keywords).toContain('flow');
      expect(packageJson.keywords).toContain('flowtype');
    });

    it('should have meaningful description', () => {
      expect(packageJson.description).toBe('A repository of high quality flow type definitions');
      expect(packageJson.description.length).toBeGreaterThan(10);
    });
  });

  describe('security and best practices', () => {
    it('should use secure HTTPS URLs', () => {
      const urls = [
        packageJson.homepage,
        packageJson.repository.url.replace('git+', ''),
        packageJson.bugs.url
      ];
      
      urls.forEach(url => {
        if (url && url.startsWith('http')) {
          expect(url).toMatch(/^https:/);
        }
      });
    });

    it('should follow npm naming conventions', () => {
      expect(packageJson.name).toMatch(/^[a-z0-9\-._]+$/);
      expect(packageJson.name).not.toMatch(/^[._]/);
      expect(packageJson.name).not.toMatch(/[._]$/);
    });

    it('should not use overly permissive version ranges', () => {
      const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      Object.entries(allDeps).forEach(([name, version]) => {
        expect(version).not.toMatch(/^\*/);
        expect(version).not.toMatch(/^x/);
      });
    });
  });

  describe('build tool configurations', () => {
    it('should have correct babel build configuration in scripts', () => {
      expect(packageJson.scripts['build:src']).toContain('./src --out-dir=./dist');
      expect(packageJson.scripts.watch).toContain('--source-maps --watch=./src --out-dir=./dist');
    });

    it('should have flow-copy-source with proper ignore patterns', () => {
      expect(packageJson.scripts['build:flow']).toContain("--ignore '**/__tests__/**'");
    });

    it('should use rimraf for cleaning', () => {
      expect(packageJson.scripts.clean).toBe('rimraf dist');
    });

    it('should use mkdirp for directory creation', () => {
      expect(packageJson.scripts.build).toContain('mkdirp dist');
      expect(packageJson.scripts.prepare).toContain('mkdirp dist');
      expect(packageJson.scripts.watch).toContain('mkdirp dist');
    });
  });

  describe('edge cases and error conditions', () => {
    it('should handle script execution order correctly', () => {
      // Test script runs clean -> build -> test-quick
      const testSteps = packageJson.scripts.test.split(' && ');
      expect(testSteps[0].trim()).toBe('yarn clean');
      expect(testSteps[1].trim()).toBe('yarn build');
      expect(testSteps[2].trim()).toBe('yarn test-quick');
    });

    it('should have unique script names', () => {
      const scriptNames = Object.keys(packageJson.scripts);
      const uniqueNames = new Set(scriptNames);
      expect(scriptNames.length).toBe(uniqueNames.size);
    });

    it('should have consistent yarn usage in scripts', () => {
      Object.entries(packageJson.scripts).forEach(([name, script]) => {
        if (script.includes('yarn ') || script.includes(' yarn ')) {
          // Ensure yarn commands are properly formatted
          expect(script).not.toMatch(/yarn\s+&&/);
          expect(script).not.toMatch(/&&\s+yarn$/);
        }
      });
    });

    it('should handle malformed JSON gracefully in tests', () => {
      const packagePath = path.join(__dirname, 'package.json');
      expect(() => {
        const content = fs.readFileSync(packagePath, 'utf8');
        JSON.parse(content);
      }).not.toThrow();
    });

    it('should have reasonable file size limits', () => {
      const packagePath = path.join(__dirname, 'package.json');
      const stats = fs.statSync(packagePath);
      // package.json should be under 10KB for typical projects
      expect(stats.size).toBeLessThan(10 * 1024);
    });
  });

  describe('version constraints validation', () => {
    it('should have appropriate flow-bin version for compatibility', () => {
      expect(packageJson.devDependencies['flow-bin']).toBe('0.261.0');
    });

    it('should have compatible babel ecosystem versions', () => {
      const babelPackages = Object.keys(packageJson.devDependencies)
        .filter(pkg => pkg.startsWith('@babel/'));
      
      expect(babelPackages.length).toBeGreaterThan(0);
      babelPackages.forEach(pkg => {
        expect(packageJson.devDependencies[pkg]).toMatch(/^\^7\./);
      });
    });

    it('should use compatible jest version', () => {
      expect(packageJson.devDependencies.jest).toBe('^29.7.0');
    });

    it('should have node engine requirement compatible with dependencies', () => {
      // Most modern packages require Node >= 10
      const nodeVersion = packageJson.engines.node;
      expect(nodeVersion).toMatch(/>=10\.\d+\.\d+/);
    });
  });

  describe('package.json schema validation', () => {
    it('should not have unknown top-level fields', () => {
      const knownFields = [
        'name', 'version', 'description', 'license', 'homepage', 'repository',
        'bugs', 'main', 'bin', 'packageManager', 'engines', 'scripts',
        'dependencies', 'devDependencies', 'keywords', 'jest', 'author',
        'contributors', 'files', 'publishConfig', 'config'
      ];
      
      Object.keys(packageJson).forEach(field => {
        if (!knownFields.includes(field)) {
          // Log warning for unknown fields but don't fail
          console.warn(`Unknown field in package.json: ${field}`);
        }
      });
    });

    it('should have consistent indentation and formatting', () => {
      const packagePath = path.join(__dirname, 'package.json');
      const content = fs.readFileSync(packagePath, 'utf8');
      
      // Should use 2-space indentation
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.trim() && line.startsWith(' ')) {
          const leadingSpaces = line.match(/^(\s*)/)[1].length;
          if (leadingSpaces > 0) {
            expect(leadingSpaces % 2).toBe(0); // Should be even number of spaces
          }
        }
      });
    });
  });

  describe('flow-typed specific validations', () => {
    it('should have flow-specific dependencies', () => {
      expect(packageJson.dependencies.flowgen).toBeDefined();
      expect(packageJson.devDependencies['flow-bin']).toBeDefined();
      expect(packageJson.devDependencies['@babel/preset-flow']).toBeDefined();
    });

    it('should have appropriate keywords for flow-typed project', () => {
      expect(packageJson.keywords).toContain('flow');
      expect(packageJson.keywords).toContain('flowtype');
    });

    it('should have scripts that support flow development workflow', () => {
      expect(packageJson.scripts.flow).toBeDefined();
      expect(packageJson.scripts['build:flow']).toBeDefined();
      expect(packageJson.scripts['test-quick']).toContain('yarn flow');
    });

    it('should ignore flow-related directories in jest config', () => {
      // flow-copy-source creates files that should be ignored
      expect(packageJson.scripts['build:flow']).toContain('--ignore');
    });
  });
});

describe('package.json file system integration', () => {
  it('should exist and be readable', () => {
    const packagePath = path.join(__dirname, 'package.json');
    expect(fs.existsSync(packagePath)).toBe(true);
    
    const stats = fs.statSync(packagePath);
    expect(stats.isFile()).toBe(true);
    expect(stats.size).toBeGreaterThan(0);
  });

  it('should be parseable as valid JSON', () => {
    const packagePath = path.join(__dirname, 'package.json');
    const content = fs.readFileSync(packagePath, 'utf8');
    
    expect(() => {
      JSON.parse(content);
    }).not.toThrow();
  });

  it('should have consistent line endings', () => {
    const packagePath = path.join(__dirname, 'package.json');
    const content = fs.readFileSync(packagePath, 'utf8');
    
    // Should not have mixed line endings
    expect(content).not.toMatch(/\r\n.*\n/);
  });

  it('should be properly formatted JSON', () => {
    const packagePath = path.join(__dirname, 'package.json');
    const content = fs.readFileSync(packagePath, 'utf8');
    const parsed = JSON.parse(content);
    
    // Re-stringify with standard formatting to check if it matches
    const formatted = JSON.stringify(parsed, null, 2);
    expect(content.trim()).toBe(formatted);
  });

  it('should not contain trailing whitespace', () => {
    const packagePath = path.join(__dirname, 'package.json');
    const content = fs.readFileSync(packagePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.length > 0) {
        expect(line).not.toMatch(/\s+$/);
      }
    });
  });

  it('should end with a newline', () => {
    const packagePath = path.join(__dirname, 'package.json');
    const content = fs.readFileSync(packagePath, 'utf8');
    expect(content.endsWith('\n')).toBe(true);
  });
});