var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    cache = require('gulp-cached'),
    less = require('gulp-less'),
    uglifycss = require('gulp-uglifycss');

var config = {
    client: {
        'dest':             "./public/js",
        'base':             './src/client',
        'es6':              ["./src/client/**/*.es6","!./src/client/angular/backup/**"],
        'js':               ["./src/client/**/*.js","!./src/client/**/*.es6","!./src/client/angular/backup/**"],
        'etc':              ["./src/client/**","!./src/client/css/**","!./src/client/css","!./src/client/**/*.js","!./src/client/**/*.es6","!./src/client/angular/backup/**"],
        'miscellaneous':    ["./src/client/**","!./src/client/css/**","!./src/client/css","!./src/client/**/*.es6","!./src/client/angular/backup/**"],
    },
    clientCss: {
        'dest':             "./public/css",
        'base':             './src/client/css',
        'less':             ["./src/client/css/*.less","!./src/client/css/common.less"],
        'lessDependency':   ["./src/client/css/common.less"]
    },
    server: {
        'dest':             "./",
        'base':             './src/server',
        'es6':              ["./src/server/**/*.es6"],
        'etc':              ["./src/server/**","!./src/server/**/*.es6"],
    }
}
gulp.task("clientES6", function(){
    gulp.src(config.client.es6,{base: config.client.base})
        .pipe(cache('clientES6'))
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest(config.client.dest));
});
gulp.task("clientCloneSource", function(){
    gulp.src(config.client.js,{base: config.client.base})
        .pipe(cache('clientCloneSource'))
        .pipe(uglify())
        .pipe(gulp.dest(config.client.dest));
    gulp.src(config.client.etc,{base: config.client.base})
        .pipe(cache('clientCloneSource'))
        .pipe(gulp.dest(config.client.dest));
});
gulp.task("clientWatcher", function(){
    gulp.watch(config.client.es6, ['clientES6']);
    gulp.watch(config.client.miscellaneous, ['clientCloneSource']);
});
gulp.task('clientLess', function() {
    gulp.src(config.clientCss.less,{base: config.clientCss.base})
        .pipe(cache('clientLess'))
        .pipe(less())
        .pipe(uglifycss())
        .pipe(gulp.dest(config.clientCss.dest));
});
gulp.task('clientLessAll', function() {
    gulp.src(config.clientCss.less,{base: config.clientCss.base})
        .pipe(less())
        .pipe(uglifycss())
        .pipe(gulp.dest(config.clientCss.dest));
});
gulp.task("clientLessWatcher", function() {
    gulp.watch(config.clientCss.less, ['clientLess']);
    gulp.watch(config.clientCss.lessDependency, ['clientLessAll'])
});

gulp.task("serverES6", function(){
    gulp.src(config.server.es6,{base: config.server.base})
        .pipe(cache('serverES6'))
        .pipe(babel({presets: ['es2015']}))
        .pipe(gulp.dest(config.server.dest));
});
/*gulp.task("serverCloneSource", function(){
    gulp.src(config.server.etc,{base: config.server.base})
        .pipe(cache('serverCloneSource'))
        .pipe(gulp.dest(config.server.dest));
});*/
gulp.task("serverWatcher", function(){
    gulp.watch(config.server.es6, ['serverES6']);
    //gulp.watch(config.server.etc, ['serverCloneSource']);
});


gulp.task("default",  ["clientES6", "clientCloneSource", "clientWatcher", "serverES6", "serverWatcher","clientLessAll","clientLessWatcher"]);