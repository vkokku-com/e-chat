var path = require('path');
var gulp = require('gulp'); // task runner
var less = require('gulp-less'); // css preprocessor
var rename = require('gulp-rename');
var minifyCSS = require('gulp-cssnano'); // for css minification
var browserify = require('gulp-browserify'); // var concat = require('gulp-concat'); is replaced by browserify
var uglify = require('gulp-uglify'); // for js minification
var Ractive = require('ractive'); //used for generation of pre-compiled templates
var tap = require('gulp-tap'); // used for templates

//tasks for CSS 
gulp.task('css', function() {
    gulp.src('./frontend/less/styles.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./static/css'))
        .pipe(minifyCSS({
            keepBreaks: true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./static/css'));
});
// tasks for JS
gulp.task('js', function() {
    gulp.src('./frontend/js/app.js')
        .pipe(browserify())
        .pipe(gulp.dest('./static/js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./static/js'))
});

//for templates
gulp.task('templates', function() {
    gulp.src('./frontend/tpl/**/*.html')
        .pipe(tap(function(file, t) {
            var precompiled = Ractive.parse(file.contents.toString());
            precompiled = JSON.stringify(precompiled);
            file.contents = new Buffer('module.exports = ' + precompiled);
        }))
        .pipe(rename(function(path) {
            path.extname = '.js';
        }))
        .pipe(gulp.dest('./frontend/tpl'))
});
gulp.task('watchers', function() {
    gulp.watch('frontend/less/**/*.less', ['css']);
});
gulp.task('default', ['css', 'templates', 'js', 'watchers']);
