const gulp = require('gulp');

gulp.task('merhaba', function(){
    // console.log("çalıştı")
    return gulp.src('./scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('./'))
});