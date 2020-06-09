
const gulp = require('gulp'); //引入gulp，生成一个gulp对象
const html = require('gulp-minify-html'); //引入html压缩插件  html函数方法
const css = require('gulp-clean-css'); //引入css压缩插件  css函数方法
const sass = require('gulp-sass'); //引入sass编译插件 

//sass
const sourcemaps = require('gulp-sourcemaps'); //引入生成.map文件模块
const plugins = require('gulp-load-plugins')(); //生成.map文件 返回的是一个函数体。需要再次执行。
const uglifyjs = require('gulp-uglify'); //压缩js的插件


// //es6转es5的三个模块
// //gulp-babel@7   babel-core       babel-preset-es2015
const babel = require('gulp-babel'); //主要
const babelcore = require('babel-core');
const es2015 = require('babel-preset-es2015');


const imagemin = require('gulp-imagemin'); //图片压缩
const watch = require('gulp-watch'); //gulp监听





//1.第三方插件
gulp.task('plugins', () => {
    return gulp.src('src/thirdplugins/*.js')
        .pipe(uglifyjs())
        .pipe(gulp.dest('dist/thirdplugins'));
});
//2. iconfont
gulp.task('font', () => {
    return gulp.src('src/font/*')
        .pipe(gulp.dest('dist/font'));
});

//3.压缩html文件 - 引入插件包
gulp.task('uglifyhtml', () => {
    return gulp.src('src/*.html')
        .pipe(html()) //执行html插件包
        .pipe(gulp.dest('dist/'));
});

//4.压缩公共css文件 - 
gulp.task('uglifycss', () => {
    return gulp.src('src/css/css/*.css')
        .pipe(css()) //执行css插件包
        .pipe(gulp.dest('dist/css/css'));
});

//5.sass编译成css - 引入插件包
// gulp.task('compilesass', () => {
//     return gulp.src('src/sass/*.scss')
//         .pipe(plugins.sourcemaps.init()) //初始化gulp-sourcemaps插件
//         .pipe(plugins.sass({
//             outputStyle: 'compressed' //压缩
//         }))
//         .pipe(plugins.sourcemaps.write('.')) //通过sourcemaps,生成.map文件
//         .pipe(gulp.dest('dist/css/css'));
// });


//6.压缩js文件 - 引入插件包
gulp.task('uglifyjs', () => {
    return gulp.src('src/script/*.js')
        .pipe(babel({ //先将es6转换成es5
            presets: ['es2015'] //es2015->es6  es2016->es7...
        }))
        .pipe(uglifyjs()) //执行js压缩
        .pipe(gulp.dest('dist/script'));
});

//7.图片压缩 - jpg/gif/bmp/webp/ [png] - imagemin
gulp.task('uglifyimg', () => {
    return gulp.src('src/img/*.{jpg,png,gif}')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
});
//8 拷贝公共JS
gulp.task('libs', () => {
    return gulp.src('src/libs/*js').pipe(uglifyjs())
        .pipe(gulp.dest('dist/libs'))
});
gulp.task('default', () => {
    watch(['src/thirdplugins/*.js','src/font/*', 'src/*.html','src/commoncss/*.css','src/sass/*.scss','src/script/*.js','src/img/*.{jpg,png,gif}','src/libs/*js'], 
    gulp.parallel('plugins', 'font', 'uglifyhtml','uglifycss','compilesass','uglifyjs','uglifyimg','libs'));
});