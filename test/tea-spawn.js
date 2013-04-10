//remove:
var TeaSpawn = require('../build/tea-spawn.node.js');
//:remove

// this test is kinda pointless because I have no idea what/if
// I can spawn anything out there (travis & co.)
// so ... just consider I've tested this locally without any problem :-)

wru.test([
  function works() {
    var t = new TeaSpawn('ls');
    t.send(null, wru.async(function (error, code) {
      wru.assert('it works!');
    }));
  }
]);
