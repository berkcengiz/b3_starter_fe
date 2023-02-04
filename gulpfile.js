const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const nunjucksRender = require("gulp-nunjucks-render");
const browserSync = require("browser-sync").create();
const { src, series, parallel, dest, watch } = require("gulp");

// file paths
const files = {
    htmlPath: "./views/pages/**/*.+(html|nunjucks)",
    scssPath: "./src/scss/**/*.scss",
    jsPath: "./src/javascript/**/*.js",
    mediaPath: "./src/media/**/**",
    fontPath: "./src/fonts/*",
};

// html
function html() {
    return gulp
        .src(files.htmlPath)
        .pipe(
            nunjucksRender({
                path: ["views"],
            })
        )
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("./dist"))
        .pipe(browserSync.stream());
}

// scss
function scss() {
    return gulp
        .src(files.scssPath)
        .pipe(sass().on("error", sass.logError))
        .pipe(cleanCSS())
        .pipe(
            rename({
                basename: "style",
                suffix: ".min",
            })
        )
        .pipe(sourcemaps.init())
        .pipe(gulp.dest("./dist/src/css"))
        .pipe(browserSync.stream());
}

// js
function js() {
    return gulp
        .src(files.jsPath)
        .pipe(concat("core.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/src/js"))
        .pipe(browserSync.stream());
}

// media
function media() {
    return gulp
        .src(files.mediaPath)
        .pipe(gulp.dest("./dist/src/media"))
        .pipe(browserSync.stream());
}

// font
function font() {
    return gulp
        .src(files.fontPath)
        .pipe(gulp.dest("./dist/src/fonts"))
        .pipe(browserSync.stream());
}

function watchTask() {
    browserSync.init({
        server: {
            baseDir: "./dist/",
        },
    });
    gulp.watch(files.htmlPath, html).on("change", browserSync.reload);
    gulp.watch(files.scssPath, scss).on("change", browserSync.reload);
    gulp.watch(files.jsPath, js).on("change", browserSync.reload);
    gulp.watch(files.fontPath, font).on("change", browserSync.reload);
    gulp.watch(files.mediaPath, media).on("change", browserSync.reload);
}

exports.html = html;
exports.scss = scss;
exports.js = js;
exports.media = media;
exports.font = font;
exports.watchTask = watchTask;
exports.default = series(parallel(html, scss, js, media, font), watchTask);
