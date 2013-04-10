
// class and methods definition
var TeaSpawn = oO.Class({

  /**
   * create a new instanceof TeaSpawn
   * @param string bin the name of the program (curl, python)
   * @param Array [args=[]] optional arguments to recicle per each .send() call
   * @param Object [runAs={
   *   cwd: __dirname,
   *   env: process.env,
   *   detached: true,
   *   stdio: [
   *     'pipe', 'pipe', 'pipe'
   *   ]
   * }] optional configuration for the spawn call
   */
  constructor: function TeaSpawn(bin, args, runAs) {
    var config = {
      _programs: [],
      _bin: bin
    };
    if (args) config._args = this._args.concat(args);
    if (runAs) config._runAs = runAs;
    oO(this, config);
  },

  /**
   * kill all processes started via .send()
   * if, and only if, these have not finished yet #youdontsay
   * @return the same instanceof TeaSpawn
   */
  kill: function kill() {
    this._programs.splice(
      0, this._programs.length
    ).forEach(killProgram);
    return this;
  },

  /**
   * is really a simple utility integrated with the library
   * just in case you want to see something after a .send()
   * so you can instance.send('whatever', instance.log);
   * @return the same instanceof TeaSpawn
   */
  log: function log(error, code) {
    if (error) console.error('[error]\n' + error);
    else console.log('[code]\n' + code);
    return this;
  },

  /**
   * @param string|Array data the text to write in the spawned stream
   *                          or an array of arguments to append to those
   *                          optionally passed during initialization
   * @param Function [callback(err, out)=Object] an optional callback that
   *                                             will receive error, if any, and output
   *                                             once the spawn has finished.
   * @return the same instanceof TeaSpawn
   * @example
   *   var python = new TeaSpawn('python');
   *   python.send('print("Hello World!")', python.log);
   *
   *   var python = new TeaSpawn('python', ['filename.py']);
   *   python.send([1, 2, 3], python.log);
   *   [code]
   *   1
   *   2
   *   3
   *   # filename.py content
   *   import sys
   *   for i in range(0, len(sys.argv)):
   *     print sys.argv[i]
   */
  send: function send(data, callback) {
    var dataIsArguments = isArray(data),
        out = [],
        err = [],
        program;
    this._programs.push(
      program = spawn(
        this._bin,
        dataIsArguments ?
          this._args.concat(data) : this._args,
        this._runAs
      ).on('close', callback ? function close(code) {
        callback(err.length ? err.join('') : code, out.join(''));
      } : Object)
    );
    program.stderr.on('data', err.push.bind(err));
    program.stdout.on('data', out.push.bind(out));
    program.unref();
    if (!dataIsArguments && data) {
      program.stdin.write(
        data, null, program.stdin.end.bind(program.stdin)
      );
    }
    return this;
  }
}, {
  // immutable
  writable: false,
  enumerable: false,
  configurable: false
});

// class properties (writable by default)
oO(TeaSpawn.prototype, {
  // used as arguments placeholder, shared as empty Array
  _args: [],
  // the binary to spawn
  // @type string
  _bin: null,
  // a list of programs spawn with the same binary
  // and the same list of arguments plus optionals
  // @type Array
  _programs: null,
  // used as spawn env common defaults
  _runAs: {
    cwd: process.cwd(),
    env: process.env,
    detached: true,
    stdio: [
      'pipe', 'pipe', 'pipe'
    ]
  }
});
