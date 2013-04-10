tea-spawn
=========
Take a sip of everything you need from your OS mug

[![build status](https://secure.travis-ci.org/WebReflection/tea-spawn.png)](http://travis-ci.org/WebReflection/tea-spawn)

### What

The easiest way to spawn a process and read its outcome.

### How

The classic `npm install tea-spawn` will do the magic, an optional `-g` is suggested to reuse anytime the library.

```javascript
var TeaSpawn = require('tea-spawn.js');

// python as runtime interpreter
var python = new TeaSpawn('python');
python
  .send('print("Hello World")', function (error, output) {
    console.log(output); // Hello World
   })
  .send('print(123)', function (error, output) {
    console.log(output); // 123
  })
;

// python file
var python = new TeaSpawn('python', 'test/test.py');
python.send([1, 2, 3], function (error, output) {
  console.log(output); // 1\n2\n3
});
```
In latter example the second argument is used as partial application.
This means that every `python.send([arg0, arg1, argN])` will be concatenated to the list of arguments producing this call `python test/test.py arg0 arg1 argN` with proper shell arguments escape provided by `spawn` module.

### API

  * `TeaSpawn(executable:string[, argument:string|arguments:Array[, env:Object]])`
    The second argument can be either a string or an array with 0, one, or more entries and will be used as partial arguments per each call to the send method.
  
  * `TeaSpawn#send(null|content:string|arguments:Array[, callback:Function]):object`
    every call to this method will create *a new spawned process* with the same initial configuration.
    If the first argument is `null` the process will be executed as it is.
    If the first argument is `string` it will be written in the spawned process stdin.
    If the first argument is a `Array` it will be used as extra arguments and no content will be written to the stdin.
    The second optional argument, if present, will receive `error` and `output` parameters. Error is either a buffered error or the process exit number. If `0` means everything was fine. `output` is the content produced by that call or `null` if none.
    The method returns the instance object itself.
  
  * `TeaSpawn#kill(void):object`
    It kills every process previously started with `.send()` and returns the instance object.
  
  * `TeaSpawn#log(error:Number|StringBuffer, output:null|StringBuffer):object`
    This is simply an utility method handy for runtime operations such `p.send(someArg, p.log)`.
    It will log the error or the output as they come, that's pretty much it.

### More Examples

```javascript
// curl (grab a page output)
var curl = new TeaSpawn(
  'curl',
  ['-L', '-s'] // arguments used per each .send() call
);

// call send with extra arguments
curl.send(['http://www.google.com'], curl.log);
curl.send(['http://www.3site.eu'], curl.log);


// detailed list of files
var ls = new TeaSpawn('ls', ['-la']);
ls.send('./', function (error, out) {
  var result = [];
  out.split(/\r\n|\r|\n/).slice(1, -1).forEach(rowToObject, result);
  console.log(result);
});
function rowToObject(row) {
  var cols = row.split(/ +/);
  this.push(    {
    permissions: cols.shift(),
    links: cols.shift(),
    owner: cols.shift(),
    group: cols.shift(),
    size: cols.shift(),
    name: cols.pop(),
    mdate: cols.join(' ')
  });
}

```

### Why
Sometimes there's no module to do what you need to ... spawn could become really handy as utility/tool for any task you might need.

It is also possible to make interoperation easy between programming languages such Python or Java, having stateless programs that can do something per each call without needing a full duplex channel, just the standard output.

As summary, if performance is not such big concern keep it simple and go for it!