const path = require('path');
const execa = require('execa');
var tsconfig = require('./tsconfig.json');

module.exports = function (grunt) {
	var createProcessors = require('grunt-dojo2/tasks/util/postcss').createProcessors;

	var staticTestFiles = '*/tests/**/*.{html,css,json,xml,js,txt}';
	var staticExampleFiles = [ '*/example/**', '!*/example/**/*.js' ];

	require('grunt-dojo2').initConfig(grunt, {
		copy: {
			'staticDefinitionFiles-dev': {
				cwd: 'src',
				src: [ '<%= staticDefinitionFiles %>' ],
				dest: '<%= devDirectory %>'
			},
			staticTestFiles: {
				expand: true,
				cwd: 'src',
				src: [ staticTestFiles ],
				dest: '<%= devDirectory %>'
			},
			staticExampleFiles: {
				expand: true,
				cwd: 'src',
				src: staticExampleFiles,
				dest: '<%= devDirectory %>'
			},
			devStyles: {
				expand: true,
				cwd: 'src',
				src: 'common/styles/widgets.css',
				dest: '<%= devDirectory %>'
			},
			distStyles: {
				expand: true,
				cwd: 'src',
				src: 'common/styles/widgets.css',
				dest: '<%= distDirectory %>'
			}
		},
		postcss: {
			'modules-dev': {
				files: [{
					expand: true,
					src: ['**/*.m.css'],
					dest: '<%= devDirectory %>',
					cwd: 'src'
				}],
				options: {
					processors: createProcessors(tsconfig.compilerOptions.outDir, 'src')
				}
			}
		},
		intern: {
			options: {
				runType: 'runner',
				config: '<%= devDirectory %>/common/tests/intern',
				reporters: [ 'Runner' ]
			},
			browserstack: {},
			saucelabs: {
				options: {
					config: '<%= devDirectory %>/common/tests/intern-saucelabs'
				}
			},
			remote: {},
			local: {
				options: {
					config: '<%= devDirectory %>/common/tests/intern-local',
				}
			}
		},
		typedoc: {
			options: {
				ignoreCompilerErrors: true // Remove this once compile errors are resolved
			}
		}
	});

	grunt.registerTask('prepare-widget', function() {
		const config = grunt.config('prepare-widget');
		const dest = config.destPath;
		const build = config.buildPath;
		const widgetName = config.widgetName;

		// rewrite the package.json
		const currentPackage = grunt.file.readJSON(path.join('package.json'));
		currentPackage.name = '@dojo/widget-' + widgetName;
		currentPackage.description = 'Dojo 2 package of the ' + widgetName + ' widget. This package is a subset of the @dojo/widgets package.'

		grunt.file.write(path.join(dest, 'package.json'), JSON.stringify(currentPackage, undefined, 4));

		// create the main.ts file
		grunt.file.copy(path.join(build, widgetName + '.js'), path.join(dest, 'main.js'));
	});

	grunt.registerTask('publish-widget', function() {
		const done = this.async();

		const config = grunt.config('publish-widget');
		const dest = config.widgetPath;
		const dryRun = grunt.option('dry-run');
		const promises = [];

		const bin = 'npm publish .';

		grunt.log.ok(bin);

		if (!dryRun) {
			promises.push(execa.shell(bin, {
				cwd: dest
			}));
		}
		else {
			grunt.log.ok('npm pack');
			promises.push(execa.shell('npm pack', {cwd: dest}));
		}

		return Promise.all(promises).then(done);
	});

	grunt.registerTask('release-widget', function(widgetName) {
		const temp = 'temp/';
		const widgetTemp = 'widget-temp/';
		const dist = grunt.config('copy.staticDefinitionFiles-dist.dest');

		grunt.config.merge({
			copy: {
				temp: {expand: true, cwd: dist, src: '**', dest: temp},
				widget: {
					expand: true,
					cwd: temp,
					src: widgetName + '/**',
					dest: widgetTemp
				},
				common: {
					expand: true,
					cwd: temp,
					src: 'common/**',
					dest: widgetTemp
				}
			},
			clean: {temp: [temp], widget: [widgetTemp]},
			'prepare-widget': {
				widgetName: widgetName,
				destPath: widgetTemp,
				buildPath: temp
			},
			'publish-widget': {
				widgetName: widgetName,
				widgetPath: widgetTemp
			}
		});

		// build the root task
		grunt.task.run([
			'copy:widget',
			'copy:common',
			'prepare-widget',
			'publish-widget',
			'clean:widget'
		]);
	});

	grunt.task.renameTask('release-publish', 'release-publish-original');

	grunt.registerTask('release-publish', function() {
		// not only do we publish the initial package, but we want to package each widget as well.
		grunt.task.run(grunt.file.expand({
			filter: 'isDirectory',
			cwd: 'src/'
		}, ['*', '!common']).map(function(widgetName) {
			return 'release-widget:' + widgetName;
		}));
	});

	grunt.registerTask('dev', grunt.config.get('devTasks').concat([
		'copy:staticExampleFiles',
		'postcss:modules-dev',
		'copy:devStyles'
	]));

	grunt.registerTask('dist', grunt.config.get('distTasks').concat([
		'postcss:modules-dist',
		'postcss:variables',
		'copy:distStyles'
	]));
};
