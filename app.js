const Readable = require('stream').Readable;
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

function repeat(stream) {
  return new Promise(function(resolve, reject){
    let count = 0;
    setTimeout(function f(){
      if ( ++count <= 10){
        stream.push(count.toString() + ': ' + Date());
        stream.push('\n');
        setTimeout(f, 500);
      } else {
        resolve();
      }
    },500);
  });
}

router.get('/work_well_with_callback',async (ctx)=>{
  var stream = ctx.body = new Readable();
  stream._read = function () {};

  ctx.set({
      'Content-Type': 'text/undefined-content',
      'Transfer-Encoding': 'chunked'
  });

  ctx.res.flushHeaders();
  stream.push('begin Date() printing via timmer:\n\n');
  repeat(stream).then(() => {
    stream.push('\nall done!');
    stream.push('\nEverything is fine.');
    stream.push(null);
  });
});

router.get('/wtf_with_await',async (ctx)=>{
  var stream = ctx.body = new Readable();
  stream._read = function () {};

  ctx.set({
      'Content-Type': 'text/undefined-content',
      'Transfer-Encoding': 'chunked'
  });

  ctx.res.flushHeaders();
  stream.push('begin Date() printing via timmer:\n\n');

  await repeat(stream);

  stream.push('\nall done!\n');
  stream.push('\nWTF?~ There is only a one-time output!\n');
  stream.push(null);
});

router.get('/fix_it_with_pipe_when_use_await',async (ctx)=>{
  var stream = ctx.body = new Readable();
  stream._read = function () {};
  stream.pipe(ctx.res); // add a pipe() to fix it

  ctx.set({
      'Content-Type': 'text/undefined-content',
      'Transfer-Encoding': 'chunked'
  });

  ctx.res.flushHeaders();
  stream.push('begin Date() printing via timmer:\n\n');

  await repeat(stream);

  stream.push('\nall done!\n');
  stream.push('\nEvery thing is fine again!!\n');
  stream.push(null);
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);

// vim:ts=2:sw=2:sts=2
