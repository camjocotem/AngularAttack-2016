var gulp = require('gulp'),
    sass = require('gulp-sass')
    minifyCss = require('gulp-minify-css'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

var sassSource = './sass/styles.scss';
var jsFiles = './app/**/*.js'

gulp.task('scss', function(){
    gulp.src(sassSource)
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(gulp.dest('./css'));
});

gulp.task('js', function(){
    gulp.src(jsFiles)
    .pipe(concat('pongScripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build'))
});

gulp.task('default', ['scss', 'js'], function(){
    gulp.watch(sassSource, ['scss']);
});
