const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const rename = require("gulp-rename");
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');


gulp.task('styles', function(){
    return gulp.src('./src/scss/**/**.scss')
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(rename({
        basename: "style",
        suffix : ".min"
    }))
    .pipe(gulp.dest('./dist/src/css/'))
});

gulp.task('javascript', function(){
    return gulp.src([
        './src/javascript/**/**.js',
        '!./src/javascript/library/*'
    ])
    .pipe(concat('core.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/src/js/'))
});

gulp.task('page', function(){
    return gulp.src('./views/pages/**/**.html')
    .pipe(gulp.dest('./dist/'))
});

gulp.task('media', function(){
    return gulp.src('./src/media/**/**')
    .pipe(gulp.dest('./dist/media'))
});

gulp.task('font', function(){
    return gulp.src('./src/fonts/**/**')
    .pipe(gulp.dest('./dist/fonts'))
});

gulp.task(['styles', 'javascript', 'page', 'media', 'font'])
