const gulp = require("gulp");
const browsersync = require("browser-sync");
const concat = require("gulp-concat"); // объединяет файлы в один бандл
const cleanCSS = require("gulp-clean-css"); // сжимает, оптимизирует
const autoprefixer = require("autoprefixer"); // переименовывает
const postcss = require("gulp-postcss");
const pug = require("gulp-pug"); // Pug
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const include = require("gulp-include"); // Импорты
const plumber = require("gulp-plumber");
const gulpif = require("gulp-if");
const sourcemaps = require("gulp-sourcemaps");
const emitty = require("emitty").setup("src", "pug", { makeVinylFile: true });
const path = require("path");
const del = require("del");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");

gulp.task("pug", function (done) {
  gulp
    .src(["src/*.pug", "src/**/*.pug"])
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest("build"));
  done();
});

gulp.task(
  "pugRebuild",
  () =>
    new Promise((resolve, reject) => {
      emitty.scan(global.emittyChangedFile).then(() => {
        gulp
          .src(["src/*.pug"])
          .pipe(plumber())
          .pipe(gulpif(global.watchActive, emitty.filter(global.emittyChangedFile)))
          .pipe(pug({ pretty: true }))
          .pipe(gulp.dest("build"))
          .on("end", resolve)
          .on("error", reject);
      });
    }),
);

function compileSass() {
  return new Promise((resolve, reject) => {
    gulp
      .src("./src/assets/styles/styles.sass")
      .pipe(sourcemaps.init())
      .pipe(sass().on("error", sass.logError))
      .pipe(
        postcss([
          autoprefixer({
            browsers: ["last 2 versions"],
            grid: true
          }),
        ]),
      )
      .pipe(concat("styles.css"))
      .pipe(cleanCSS())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest("build/assets/styles"))
      .on("finish", resolve)
      .pipe(browsersync.stream());
    // .pipe(browsersync.stream({match: '**/*.css'}));
  });
}

gulp.task("sass", function (done) {
  compileSass();
  done();
});

function compileJs() {
  return new Promise((resolve, reject) => {
    gulp
      .src([
            // "./src/assets/scripts/libs/**/jquery.min.js",
            // "./src/assets/scripts/libs/**/slick.min.js",
            // "./src/assets/scripts/libs/**/bootstrap.js",
            
            "./src/assets/scripts/functions.js"])
      // .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(
        include({
          extensions: "js",
          includePaths: [__dirname + "/src/assets/blocks"],
        }),
      )
      .pipe(
        babel({
          presets: ["env"],
        }),
      )
      // .pipe(sourcemaps.write())
      .pipe(concat("functions.js"))
      .pipe(gulp.dest("build/assets/scripts").on("finish", resolve));
  });
}

gulp.task("babel", done => {
  compileJs().then(done);
});

gulp.task("clean", function (done) {
  return del(["build/assets/blocks", "build/assets/fonts", "build/assets/images"]);
});

gulp.task("images", function () {
  return gulp
    .src("./src/assets/images/**/**")
    // .pipe(newer("build/assets/images"))
    .pipe(gulp.dest("build/assets/images"));
});

gulp.task("fonts", function () {
  return gulp.src("./src/assets/fonts/**/**").pipe(gulp.dest("build/assets/fonts"));
});

gulp.task("loadfiles", function (done) {
  gulp.src([
    "./src/assets/scripts/libs/**/jquery.min.js", 
    "./src/assets/scripts/libs/OwlCarousel2-2.3.4/dist/owl.carousel.min.js",
    "./src/assets/scripts/libs/slick-carousel/slick/slick.min.js",
    "./src/assets/scripts/libs/fancybox/jquery.fancybox.min.js",
    "./src/assets/scripts/libs/splide/dist/js/splide.min.js",
    "./src/assets/scripts/libs/jquery.validate.min.js"
    
  ]).pipe(gulp.dest("build/assets/scripts"));
  done();
});

gulp.task("browser-sync", function () {
  browsersync({
    server: {
      baseDir: "./build",
    },
    open: true,
    notify: false,
  });
});

gulp.task("reload-browser", function (done) {
  browsersync.reload();
  done();
});

gulp.task("watch", done => {
  global.watchActive = true;
  gulp
    .watch(
      ["src/*.pug", "src/assets/blocks/**/*.pug"],
      gulp.series("pugRebuild", "reload-browser"),
    )
    .on("all", (event, filepath) => {
      global.emittyChangedFile = filepath;
    });

  // удаляет файлы из билда при удалении из source
  function removeFiles(filepath) {
    var filePathFromSrc = path.relative(path.resolve("src"), filepath);
    var destFilePath = path.resolve("build", filePathFromSrc);
    del.sync(destFilePath);
  }

  const imgWatcher = gulp.watch("./src/assets/images/**", gulp.series("images"));
  imgWatcher.on("unlink", removeFiles);
  imgWatcher.on("unlinkDir", removeFiles);

  const fontWatcher = gulp.watch("./src/assets/fonts/**", gulp.series("fonts"));
  fontWatcher.on("unlink", removeFiles);
  fontWatcher.on("unlinkDir", removeFiles);

  gulp.watch("./src/assets/**/*.js", gulp.series(["babel", "reload-browser"]));

  gulp.watch("./src/assets/**/*.{sass,css,scss,less}", gulp.series("sass"));
  done();
});

gulp.task(
  "default",
  gulp.series(
    ["pug", "sass", "babel", "images", "fonts", "loadfiles"],
    gulp.parallel(["browser-sync", "watch"]),
  ),
  done => {
    done();
  },
);
