var gulp = require ('gulp');
var connect = require ('gulp-connect');

gulp.task('connect', function(){
	connect.server({
		root:'.',
		livereload: true
	});
});

//html task
//specify where our html files are
//and what to do when the html files do change

gulp.task ('html', function(){
 	gulp.src('./*.html').pipe(connect.reload());
});

//watch task
//specify where certain files are
//and the task to run when they change

gulp.task ('watch', function(){
 	gulp.watch(['./*.html'], ['html']);
<<<<<<< HEAD
<<<<<<< HEAD
=======
 	gulp.watch(['./js/*.js'], ['jshint']);
>>>>>>> old_a/master
=======
>>>>>>> c41fcdd157e90916361f592c8424ed4c573c97e0
});

gulp.task('default', ['connect', 'watch']);


