const Readable = require('stream').Readable;
const Koa = require('koa');
const Router = require('koa-router');
const sleep = require('mz-modules/sleep');
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

// Work find with promise callback
router.get('/work_fine_with_promise_callback',(ctx)=>{
  var stream = ctx.body = new Readable();
  stream._read = function () {};
  ctx.type = 'text/undefined-content';

  stream.push('begin Date() printing via timmer:\n\n');
  repeat(stream).then(() => {
    stream.push('\nall done!');
    stream.push('\nEverything is fine.');
    stream.push(null);
  });
});

// Not work with await
router.get('/wtf_with_await',async (ctx)=>{
  var stream = ctx.body = new Readable();
  stream._read = function () {};
  ctx.type = 'text/undefined-content';

  stream.push('begin Date() printing via timmer:\n\n');
  await repeat(stream);
  stream.push('\nall done!\n');
  stream.push('\nWTF?~ There is only a one-time output!\n');
  stream.push(null);
});

// fix it with pipe when using await
router.get('/fix_it_with_pipe_when_use_await',async (ctx)=>{
  var stream = ctx.body = new Readable();
  stream._read = function () {};
  stream.pipe(ctx.res); // add a pipe() to fix it
  ctx.type = 'text/undefined-content';

  stream.push('begin Date() printing via timmer:\n\n');
  await repeat(stream);
  stream.push('\nall done!\n');
  stream.push('\nEvery thing is fine again!!\n');
  stream.push(null);
});

// streaming https://github.com/maxogden/mississippi
router.get('/fix_it_in_another_way_by_respond_false', async (ctx) => {
  ctx.respond = false;
  ctx.type = 'text/undefined-content';
  const res = ctx.res;
  
  res.write('begin Date() printing via timmer:\n\n');
  await repeat({
    push: res.write.bind(res)
  });
  res.write('\nall done!\n');
  res.write('\nEvery thing is fine again!!\n');
  res.end(null);
});


app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);

console.log(`
See results:
>  case 1: http://localhost:3000/work_fine_with_promise_callback
>  case 2: http://localhost:3000/wtf_with_await
>  case 3: http://localhost:3000/fix_it_with_pipe_when_use_await
>  case 4: http://localhost:3000/fix_it_another_way_async_await_sleep
`);

// vim:ts=2:sw=2:sts=2
