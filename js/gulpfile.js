const gulp = require('gulp');
const browserSync = require('browser-sync').create();
//compile scss into css
function watch() {
    browserSync.init({
        server: {
           baseDir: "./",
           index: "index.html"
        }
    });

    gulp.watch('./*.html').on('change',browserSync.reload);
    gulp.watch('./js/**/*.js').on('change', browserSync.reload);
    gulp.watch('./css/**/*.css').on('change', browserSync.reload);

}
exports.watch = watch;