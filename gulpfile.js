var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var maps = require('gulp-sourcemaps');
var browserify = require('gulp-browserify');
var browserSync = require('browser-sync').create();
var del = require('del');

var PATH = {
  'SRC': './src',
  'DIST': './dist'
}

var handleError = function (err) {
  gutil.log(err.toString());
  this.emit('end');
}

var environment = 'development';

gulp.task('set-production', function() {
  process.env.NODE_ENV = environment = 'production';
});

gulp.task('clean', function(){
  return del([PATH.DIST + '/**']);
});

gulp.task('html', function() {
  return gulp.src(PATH.SRC + '/index.html')
    .pipe(gulp.dest(PATH.DIST));
});

gulp.task('css', function() {
  return gulp.src(PATH.SRC + '/index.css')
    .pipe(gulp.dest(PATH.DIST))
    .pipe(browserSync.stream());
});

gulp.task('browserify', function() {
  stream = gulp.src(PATH.SRC + '/index.coffee', { read: false })
    .pipe(browserify({
      fullPaths: environment == 'development',
      debug: environment == 'development',
      transform: ['coffeeify', 'yamlify'],
      extensions: ['.coffee', '.yml']
    })).on('error', handleError)
    .pipe(concat('index.js'))
  if (environment == 'production') {
    stream.pipe(uglify());
  }
  stream.pipe(gulp.dest(PATH.DIST));
  return stream;
});

gulp.task('reload-html', ['html'], function() {
    browserSync.reload();
});

gulp.task('reload-js', ['browserify'],  function() {
    browserSync.reload();
});

gulp.task('watch', ['html', 'css', 'browserify'], function() {
  gulp.watch(PATH.SRC + '/*.html', ['reload-html']);
  gulp.watch(PATH.SRC + '/**/*.css', ['css']);
  gulp.watch([PATH.SRC + '/**/*.coffee', PATH.SRC + '/**/*.yml'], ['reload-js']);
});

gulp.task('server', ['watch'], function() {
  browserSync.init({
    server: {
      baseDir: PATH.DIST
    }
  });
});

gulp.task('default', ['html', 'browserify', 'css']);
gulp.task('production', ['set-production', 'default']);
