const { src, dest, watch, series, parallel, task } = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const includeFile = require('gulp-file-include');
const browsersync = require('browser-sync').create();
const ghPages = require('gulp-gh-pages');

const HTML_PATH = ['./**/*.html', '!dist/index.html'];
const SCSS_PATH = './styles/**/*.scss';
const IMAGES_PATH = './images/**/*.{gif,jpg,png,svg}';


function htmlTask() {
  return src('index.html')
    .pipe(includeFile({ prefix: '@' }))
    .pipe(dest('dist'));
}

function scssTask() {
  return src(SCSS_PATH, { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(concat('styles.css'))
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(dest('dist'));
}

function imagesTask() {
  return src(IMAGES_PATH)
    .pipe(dest('dist/images'));
}

function serveTask(cb) {
  browsersync.init({
    server: {
      baseDir: 'dist'
    }
  });
  cb();
}

function reloadTask(cb) {
  browsersync.reload();
  cb();
}

function deployTask() {
  return src('./dist/**/*')
    .pipe(ghPages());
}

function watchTask(){
  watch(HTML_PATH, series(htmlTask, reloadTask));
  watch(SCSS_PATH, series(scssTask, reloadTask));
  watch(IMAGES_PATH, series(imagesTask, reloadTask));
}

task('default', series(parallel(scssTask, imagesTask, htmlTask), serveTask, watchTask));
task('deploy', deployTask)