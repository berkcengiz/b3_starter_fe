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
    htmlWatchPath: "./views/**/**/*.+(html|nunjucks)",
    scssPath: "./src/scss/**/*.scss",
    jsCorePath: "./src/javascript/**/*.js",
    mediaPath: "./src/media/**/**",
    fontPath: "./src/fonts/*",

    // library file paths
    jsLibPath: [
        "node_modules/jquery/dist/jquery.min.js",
        "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
        "node_modules/vanilla-lazyload/dist/lazyload.min.js",
        "node_modules/swiper/swiper-bundle.min.js",
        // "node_modules/select2/dist/js/select2.min.js",
    ],
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
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/src/css"))
        .pipe(browserSync.stream());
}

// jsCore
function jsCore() {
    return gulp
        .src(files.jsCorePath)
        .pipe(concat("core.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/src/js"))
        .pipe(browserSync.stream());
}

// jsLib
function jsLib() {
    return gulp
        .src(files.jsLibPath)
        .pipe(concat("lib.min.js"))
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
    gulp.watch(files.htmlWatchPath, html).on("change", browserSync.reload);
    gulp.watch(files.scssPath, scss).on("change", browserSync.reload);
    gulp.watch(files.jsCorePath, jsCore).on("change", browserSync.reload);
    gulp.watch(files.jsLibPath, jsLib).on("change", browserSync.reload);
    gulp.watch(files.fontPath, font).on("change", browserSync.reload);
    gulp.watch(files.mediaPath, media).on("change", browserSync.reload);
}

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
