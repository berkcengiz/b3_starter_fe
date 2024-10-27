const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const nunjucksRender = require("gulp-nunjucks-render");
const browserSync = require("browser-sync").create();
const { series, parallel } = require("gulp");

// File paths
const files = {
    htmlPath: "./views/pages/**/*.+(html|nunjucks)",
    htmlWatchPath: "./views/**/**/*.+(html|nunjucks)",
    scssPath: "./src/scss/**/*.scss",
    jsCorePath: "./src/javascript/**/*.js",
    mediaPath: "./src/media/**/**",
    fontPath: "./src/fonts/*",

    // Library file paths
    jsLibPath: [
        "node_modules/jquery/dist/jquery.min.js",
        "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
        "node_modules/vanilla-lazyload/dist/lazyload.min.js",
        "node_modules/swiper/swiper-bundle.min.js",
        "node_modules/@barba/core/dist/barba.umd.js",
    ],
};

// HTML Task
function html() {
    return gulp
        .src(files.htmlPath)
        .pipe(nunjucksRender({ path: ["views"] }))
        .pipe(gulp.dest("./dist"))
        .pipe(browserSync.stream());
}

// SCSS Task
function scss() {
    return gulp
        .src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(cleanCSS())
        .pipe(rename({ basename: "style", suffix: ".min" }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/src/css"))
        .pipe(browserSync.stream());
}

// JS Core Task
function jsCore() {
    return gulp
        .src(files.jsCorePath)
        .pipe(sourcemaps.init())
        .pipe(concat("core.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/src/js"))
        .pipe(browserSync.stream());
}

// JS Library Task
function jsLib() {
    return gulp
        .src(files.jsLibPath)
        .pipe(sourcemaps.init())
        .pipe(concat("lib.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/src/js"))
        .pipe(browserSync.stream());
}

// Media Task
function media() {
    return gulp
        .src(files.mediaPath, { encoding: false })
        .pipe(gulp.dest("./dist/src/media"))
        .pipe(browserSync.stream());
}

// Font Task
function font() {
    return gulp
        .src(files.fontPath)
        .pipe(gulp.dest("./dist/src/fonts"))
        .pipe(browserSync.stream());
}

// Watch Task
function watchTask() {
    browserSync.init({ server: { baseDir: "./dist/" } });
    gulp.watch(files.htmlWatchPath, html).on("change", browserSync.reload);
    gulp.watch(files.scssPath, scss);
    gulp.watch(files.jsCorePath, jsCore);
    gulp.watch(files.jsLibPath, jsLib);
    gulp.watch(files.fontPath, font);
    gulp.watch(files.mediaPath, media);
}

// Default Task
exports.html = html;
exports.scss = scss;
exports.jsCore = jsCore;
exports.jsLib = jsLib;
exports.media = media;
exports.font = font;
exports.watchTask = watchTask;
exports.default = series(
    parallel(html, scss, jsCore, jsLib, media, font),
    watchTask
);
