#!/usr/bin/env node

/**
 * Module dependencies
 */

var repl = require('repl')
  , dom = require('jsdom')
  , Batch = require('batch')
  , es6 = require('es6-transpiler')
  , argv = require('minimist')(process.argv.slice(2))

var exit = process.exit;
var put = console.log.bind(console);
var tasks = new Batch().concurrency(1);
var runtime = null;
var window = null;

// catch signal
process.on('SIGINT', exit);

function help () {
  console.log("usage: w625 [-hV] [src] [--script=script]")
}

tasks.push(function (next) {
  var src = argv._[0] || '';

  if (argv.h || argv.help) {
    help();
    exit(0);
  } else if (argv.V || argv.version) {
    console.log("w625-repl v%s", require('./package').version);
    exit(0);
  }

  runtime = dom.env(src, [].concat(argv.script || []), ready);

  function ready (err, win) {
    if (err) {
      return next(err);
    }

    window = win;
    next();
  }
});

tasks.push(function (next) {
  var r = repl.start({
    prompt: 'dom> ',
    input: process.stdin,
    output: process.stdout,
    useGlobal: false,
    eval: oneval
  });

  r.context = window;
  window.console = console;

  r.on('exit', function () {
    put();
    exit(0);
  });

  function oneval (src, context, filename, done) {
    var hasReferenceError = false;
    var result = null;
    var code = null;
    var es5err = null;
    var es6err = null;

    // extract source
    if (src.match(/\n\)$/)) {
      src = src.slice(1, -2);
    }

    try { result = context.eval(src); }
    catch (err) {
      es5err = err;
    }

    if (null != es5err) try {
      code = es6.run({
        src: src,
        filename: 'repl',
        disallowUnknownReferences: false,
        globals: (
          Object.keys(context)
          .map(function (k) { return k; })
          .reduce(function (o, k) { return (o[k] = true), o; }, {})
        )
      });

      result = context.eval(code.src);
    } catch (err) {
      if (es5err) {
        return done(es5err);
      } else {
        return done(err);
      }
    }

    done(null, result);
  }
});

// run
tasks.end(function (err) {
  if (err) {
    console.error(err.message);
    exit(1);
  }
});
