'use strict';

let gulp = require('gulp');
let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let cssmin = require('gulp-cssmin');

gulp.task('compile', function() {
  return gulp.src('./src/*.scss')
    .pipe(sass.sync())
    .pipe(autoprefixer({
      browsers: ['ie > 9', 'last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(gulp.dest('./dist'));
});

// gulp.task('copyfont', function() {
//   return gulp.src('./src/fonts/**')
//     .pipe(cssmin())
//     .pipe(gulp.dest('./lib/fonts'));
// });

gulp.task('build', ['compile']);
