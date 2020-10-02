There are some subtleties to using stream with koa2 that can trip you if you are not careful.

For example. When I want to print some messages one by one with a timmer. The following code does not work correctly as your wish.

    router.get('/wtf_with_await',async (ctx)=>{
      var stream = ctx.body = new Readable();
      stream._read = function () {};

      ctx.set({
          'Content-Type': 'text/plan',
          'Transfer-Encoding': 'chunked'
      });

      ctx.res.flushHeaders();
      stream.push('begin Date() printing via timmer:\n\n');

      await repeat(stream);

      stream.push('\nall done!\n');
      stream.push('\nWTF?~ There is only a one-time output!\n');
      stream.push(null);
    });

The above code only gives us a one-time output. You should add 'stream.pipe(ctx.res)' before 'stream.push' by yourself to make it work. Or you can use the callback form without await to avoid this problem.

Running [app.js](app.js):

    npm run start

To see results:

- <http://localhost:3000/wtf_with_await>
- <http://localhost:3000/fix_it_with_pipe_when_use_awai>
- <http://localhost:3000/work_well_with_callback>
