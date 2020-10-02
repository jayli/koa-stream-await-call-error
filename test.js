const http = require('http');
const Readable = require('stream').Readable;

function repeat(stream) {
  return new Promise(function(resolve, reject){
    let count = 0;
    setTimeout(function f(){
      if ( ++count <= 4){
        stream.push(count.toString() + ': ' + Date() + '\n');
        setTimeout(f, 1000);
      } else {
        resolve();
      }
    },1000);
  });
}

http.createServer(async function (request, response) {
  if (request.url == "/favicon.ico") {
    console.log(request.url);
    response.end();
    return;
  }

  let stream = new Readable();
  stream._read = function () {};
  stream.pipe(response);

  response.writeHead(200, {
    'Content-Type': 'text/plan',
    'Transfer-Encoding': 'chunked'
  }).flushHeaders();

  stream.on('data',function(chunk){
    console.log('------');
    console.log(chunk.toString());
  });

  stream.push("begin\n");

  await repeat(stream);
  stream.push('done\n');
  stream.push(null);

  /*
  repeat(stream).then(() => {
    stream.push('done\n');
    stream.push(null);
  });
  */

}).listen(8888);



// vim:ts=2:sw=2:sts=2
