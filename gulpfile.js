var gulp = require('gulp');

var concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    ngAnnotate = require('gulp-ng-annotate');

gulp.task('lint', function() {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('compile', function() {
  return gulp.src('src/**/*.js')
    .pipe(ngAnnotate())
    .pipe(concat('scroll-trigger.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename('scroll-trigger.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['compile'], function() {
  gulp.watch('src/**/*.js', ['lint', 'compile']);
});

gulp.task('default', ['lint', 'compile']);
