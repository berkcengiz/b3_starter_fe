const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

gulp.task('sass', function(){
    // console.log("çalıştı")
    return gulp.src('./scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('./'))
});

gulp.task(['sass'])
