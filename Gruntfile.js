module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		mip: {
			main: {
				options: {
					run: false,
					urls: [
						'http://localhost:8088/test/'
					],
					timeout: 50000,
					reporter: 'Spec'
				}
			},
			min: {
				options: {
					run: false,
					urls: [
						'http://localhost:8088/test/min.html'
					],
					timeout: 50000,
					reporter: 'Dot'
				}
			}
		},
		connect: {
			ci: {
				options: {
					port: 8088,
					base: '.',
				}
			},
			local: {
				options: {
					port: 80,
					base: '.'
				}
			}
		},
		coveralls: {
		    all: {
		      // LCOV coverage file relevant to every target
		      src: 'coverage/lcov.info',

		      // When true, grunt-coveralls will only print a warning rather than
		      // an error, to prevent CI builds from failing unnecessarily (e.g. if
		      // coveralls.io is down). Optional, defaults to false.
		      force: true
		    }
		},
		jshint : {
			all : {
				options : {
					"curly" : true,
					"eqnull" : true,
					"eqeqeq" : true,
					"undef" : true,
					"mocha" : true,
					"jquery" : true,
					"globals" : {
						"grecaptcha" : true
					},
					"browser" : true,
					"bitwise" : true,
					"immed" : true,
					"newcap" : true,
					"noarg" : true,
					"undef" : true,
					"quotmark" : true,
					"strict" : true,
					"unused" : "strict",
					reporter : require('jshint-stylish')
				},
				src : ['honey.js']
			}
		}

	});

	// Load plugin
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mip');
	grunt.loadNpmTasks('grunt-coveralls');

	// Task to run tests
	grunt.registerTask('local', ['connect:local:keepalive']);

	grunt.registerTask('test-main', ['connect:ci', 'jshint', 'mip:main']);
	grunt.registerTask('test-min', ['connect:ci', 'mip:min']);

	grunt.registerTask('test', ['connect:ci', 'jshint', 'mip:main', 'mip:min']);
	grunt.registerTask('send-cov', ['coveralls']);
};