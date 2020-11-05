There are some abnormal behavior when using stream with koa2 if you are not careful.

For example. When I want to print some messages one by one with a timmer. The following code does not work exactly as your wish.

    router.get('/wtf_with_await',async (ctx)=>{
        var stream = ctx.body = new Readable();
        stream._read = function () {};
        ctx.type = 'text/undefined-content';

        stream.push('begin Date() printing via timmer:\n\n');
        await repeat(stream); // print sth with timmer one by one
        stream.push('\nall done!\n');
        stream.push('\nWTF?~ There is only a one-time output!\n');
        stream.push(null);
    });

The above code only gives us a one-time output. You should add 'stream.pipe(ctx.res)' before 'stream.push' to make it work. Or you can use the callback form without await to avoid this problem.

Be careful. When you use promise callback form, please delete 'stream.pipe(ctx.res)' call. Because koa2 has done it for you. (See [koajs/koa/lib/application.js](https://github.com/koajs/koa/blob/master/lib/application.js#L267)). So pipe(ctx.res) call and promise callback form shouldn't exist at the same time. For example. If you want to implement some kind of stream proxy server. You should avoid using async/await function call.

Another way to fix it is not using "stream" at all. By setting `ctx.respond = false` you can simulate stream instead.

Take a look at the example by running [app.js](app.js):

    npm run start

See results:

- <http://localhost:3000/work_fine_with_promise_callback>
- <http://localhost:3000/wtf_with_await>
- <http://localhost:3000/fix_it_with_pipe_when_use_await>
