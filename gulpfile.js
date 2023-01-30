const gulp          = require('gulp');
const sass          = require('gulp-sass')(require('sass'));
const concat        = require('gulp-concat');
const uglify        = require('gulp-uglify');
const cleanCSS      = require('gulp-clean-css');
const rename        = require("gulp-rename");
const sourcemaps    = require('gulp-sourcemaps');
const { src, series, parallel, dest, watch } = require('gulp');


// file paths
const files = {
    htmlPath:   './views/pages/**/*.html',
    scssPath:   './src/scss/**/*.scss',
    jsPath:     './src/javascript/**/*.js',
    mediaPath:  './src/media/**/**',
    fontPath:   './src/fonts/*',
}


// html
function html() {
    return gulp.src(files.htmlPath)
    .pipe(gulp.dest('./dist'))
}


// scss
function scss() {
    return gulp.src(files.scssPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({
        basename: "style",
        suffix : ".min"
    }))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/src/css'))
}


// js
function js() {
    return gulp.src(files.jsPath)
    .pipe(concat('core.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/src/js'))
}


// media
function media() {
    return gulp.src(files.mediaPath)
    .pipe(gulp.dest('./dist/src/media'))
}


// font
function font() {
    return gulp.src(files.fontPath)
    .pipe(gulp.dest('./dist/src/fonts'))
}


exports.html    = html;
exports.scss    = scss;
exports.js      = js;
exports.media   = media;
exports.font    = font;
exports.default = parallel(html, scss, js, media, font);