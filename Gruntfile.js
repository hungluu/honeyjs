module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        qunit: {
            all: [
                'tests/*.html'
            ],
            options: {
                timeout: 10000
            }
        },
        jshint: {
            all: [
                'honey.js',
                'honey.jquery.js',
                'tests/test*.js'
            ],
            options: {
                reporter: require('jshint-stylish')
            }
        }
    });

    // Load plugin
    grunt.loadNpmTasks('grunt-contrib-qunit')
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Task to run tests
    grunt.registerTask('test', ['qunit', 'jshint']);
};