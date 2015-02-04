var gulp = require('gulp');
var gutil = require('gulp-util');
// var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');
// var sh = require('shelljs');

var paths = {
    sass: ['./source/css/styles.scss', './scss/**/*.scss', 'www/lib/ionic/scss/**/*.scss', './source/css/**/*.scss'],
    scripts: ['source/js/*.js', 'www/lib/**/*.js']
};

gulp.task('default', ['sass', 'scripts']);

gulp.task('sass', function(done) {
    gulp.src(['./source/css/styles.scss'])
        .pipe(sass())
        .on('error', swallowError)
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);

    console.log("*** SASS done.");

});

gulp.task('scripts', function() {

    gulp.src([
            './www/lib/ionic/js/ionic.bundle.min.js', './www/lib/angular-touch/angular-touch.min.js'
        ])
        .pipe(concat('ionic.bundle.min.js'))
        .pipe(gulp.dest('./www/js/'))
    console.log("*** ionc SCRIPTS done.");

    gulp.src([
            './www/lib/lodash/dist/lodash.js',
            './www/lib/angular-google-maps/dist/angular-google-maps.js',
            './www/lib/x2js/xml2json.js',
//              './source/js/douglaspeucker.js',
            './www/lib/angular-google-chart/ng-google-chart.js',
        ])
        .pipe(concat('ext_utils.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./www/js/'));

    console.log("*** custom SCRIPTS done.");
});


gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);

    // Watch .js files
    gulp.watch(paths.scripts, ['scripts']);

});

function swallowError(error) {

    //If you want details of the error in the console
    console.log(error.toString());

    this.emit('end');
}
