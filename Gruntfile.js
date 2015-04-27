module.exports = function (grunt) {

    var pkg = grunt.file.readJSON('package.json');
    var url = require("url");
    var sh = require("sync-exec");
    var moment = require("moment");
    var version = sh("git describe --always").stdout;
    version = version.slice(0, version.length-1);
    var shortVersion = version.replace(/.*(\d+\.\d+\.\d+).*/, "$1");

    grunt.config.init({

        appMain: grunt.option("app-main") || "index.html",
        mobileMain: grunt.option("mobile-main") || "mobile.html",
        cordovaPath: "./build/cordova",
        cordovacli: {
            options: {
                path: '<%= cordovaPath %>',
                id: 'com.mycordova.client',
                name: 'myCordova',
                platforms: ['ios', 'android'],
                plugins: [
                    'org.apache.cordova.statusbar'
                ]
            },
            init: {
                options: {
                    command: ['create','platform','plugin']
                }
            },
            platform: {
                options: {
                    command: 'platform'
                }
            },
            plugins: {
                options: {
                    command: 'plugin'
                }
            },
            build: {
                options: {
                    command: 'build',
                    platforms: (grunt.option("android") &&
                                grunt.option("ios")) ?
                        ["ios", "android"] :
                        grunt.option("no-android") ?
                        ["ios"] :
                        grunt.option("no-ios") ?
                        ["android"] :
                        undefined,
                    args: ["--release"]
                }
            },
            android: {
                options: {
                    command: grunt.option("force-emulator") ? 'emulate': 'run',
                    platforms: ['android'],
                    args: grunt.option("target") ? ["--target", grunt.option("target")] : []
                }
            },
            ios: {
                options: {
                    command: 'emulate',
                    platforms: ['ios']
                }
            }
        },
        "steal-build": {
            default: {
                options: {
                    system: {
                        config: __dirname + "/www/stealconfig.js",
                        main: "app/app",
                        bundlesPath: "./build/release/"
                    },
                    buildOptions: {
                        minify: !grunt.option("no-minify"),
                        bundleSteal: true
                    }
                }
            }
        },
        copy: {
            apk: {
                src: '<%= cordovaPath %>/platforms/android/ant-build/CordovaApp-release-unsigned.apk',
                dest: "./dist/myCordova-android-unsigned.apk"
            },
            app: {
                expand: true,
                cwd: '<%= cordovaPath %>/platforms/ios/build/emulator/myCordova.app/',
                src: '**',
                dest: "./dist/myCordova-ios-unsigned.app"
            },
            cordovaConfig: {
                src: ["./cordova-config.xml"],
                dest: '<%= cordovaPath %>/config.xml',
                options: {
                    process: function(content) {
                        return content.replace("{{mobileMain}}",
                                               grunt.config("mobileMain"))
                            .replace("{{version}}", shortVersion);
                    }
                }
            },
            dev: {
                files: [{
                    expand: true,
                    src: ['./www/js/**', './www/stealconfig.js'],
                    dest: '<%= cordovaPath %>',
                    filter: function(file) { return !/.*~/.test(file); }
                }]
            },
            cordova: {
                expand: true,
                src: "**",
                dest: "<%= cordovaPath %>/www/",
                cwd: "./build/release"
            },
            index: {
                options: {
                    process: function(content) {
                        return content.replace(/version=x/,
                                               'version="'+version+'"')
                            .replace(/date=y/,
                                    'date="'+moment().format("ll")+'"');
                    }
                },
                files: [{
                    src: "./www/<%= appMain %>",
                    dest: "./build/release/index.html"
                }, {
                    expand: true,
                    src: ['./<%= appMain %>', './<%= mobileMain %>'],
                    dest: "./build/release",
                    cwd: "./www"
                }]
            },
            static: {
                files:[{
                    expand: true,
                    src: [
                        '!./js/bower_components/**/*.stache',
                        './js/bower_components/bootstrap/dist/fonts/**',
                        './js/**/*.stache',
                        './img/**',
                        './styles/**'
                    ],
                    dest: './build/release',
                    cwd: "./www",
                    filter: function(file) { return !/.*~/.test(file); }
                }]
            }
        },
        clean: {
            www: ["<%= cordovaPath %>/www/**", "build/release"],
            dist: ["dist/*"],
            cordova: ["<%= cordovaPath %>"]
        },
        compress: {
            release: {
                options: {
                    mode: "tgz",
                    archive: "dist/myCordova.tgz"
                },
                expand: true,
                cwd: "build/release",
                src: "**/*",
                dest: "."
            }
        },
        watch: {
            less: {
                files: ['www/styles/styles.less', 'www/js/bower_components/bootstrap/less/**/*.less', 'www/styles/less-custom/**/*.less', 'www/js/app/**/*.less', 'www/js/ui/**/*.less'],
                tasks: ['less_imports', 'less:dev']
            },
            design: {
                files: ['www/styles/styles.less', 'www/js/bower_components/bootstrap/less/**/*.less', 'www/styles/less-custom/**/*.less', 'www/js/app/**/*.less', 'www/js/ui/**/*.less'],
                tasks: ['less_imports', 'less:dev']
            }
        },
        notify: {
            less: {
                options: {
                    message: 'LESS built'
                }
            }
        },
        less: {
            dev: {
                files: {
                    'www/styles/dev.css': ['www/styles/imports.less']
                },
                options: {
                    sourceMap: true,
                    outputSourceFiles: true
                }
            },
            dist: {
                files: {
                    'www/styles/app.css': ['www/styles/imports.less']
                },
                options: {
                    compress: true,
                    cleancss: true
                }
            }
        },
        less_imports: {
            buildimport: {
                files: {
                    'www/styles/imports.less': ['www/styles/styles.less', 'www/js/app/**/*.less', 'www/js/ui/**/*.less']
                }
            }
        },

        pkg: pkg,
        connect: {
            server: {
                options: {
                    port: grunt.option("port") || 8125,
                    debug: true,
                    base: 'www',
                    hostname: '0.0.0.0'
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-connect-proxy");
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-less-imports');
    grunt.loadNpmTasks('grunt-cordovacli');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('steal-tools');

    grunt.registerTask("noop", function() {});
    grunt.registerTask('init', ['clean:cordova', 'cordovacli:init']);
    grunt.registerTask('base-build', [
        'clean:www',
        'less_imports',
        'less:dist',
        'steal-build',
        'copy:index',
        'copy:static'
    ]);
    grunt.registerTask('build', [
        'clean:dist',
        'base-build',
        grunt.option("no-web") ? 'noop' : 'compress:release',
        'copy:cordovaConfig',
        'copy:cordova',
        (grunt.option("no-android") && grunt.option("no-ios") ?
         "noop" : 'cordovacli:build'),
        'copy:app',
        'copy:apk']);
    grunt.registerTask('android', ['base-build',
                                   'copy:cordovaConfig',
                                   'copy:cordova',
                                   /*'copy:dev',*/
                                   'cordovacli:android']);
    grunt.registerTask('ios', ['base-build',
                               'copy:cordovaConfig',
                               'copy:cordova',
                               /*'copy:dev',*/
                               'cordovacli:ios']);
    grunt.registerTask('design', ['less_imports', 'less:dev', 'watch:design']);
    grunt.registerTask('serve', ['connect:server', 'design']);
    grunt.registerTask('test', ['build']);
};
