import test = require('blue-tape');

import vandium = require('vandium');

test('simpe validation configuration test', function (t) {
  const schemaObj = {
    name: vandium.types.string().required()
  };
  const vandInst = vandium.createInstance();
  vandInst.validation.configure({
    schema: schemaObj
  });
  t.deepEqual(vandInst.validation.getConfiguration().schema, schemaObj, '(instance) schema should be equal');
  t.end();
});


test('simple validation test', function (t) {
  vandium.validation({
    name: vandium.types.string().required()
  });

  let handler: any = vandium(function (event, context, callback) {
    console.log('hello: ' + event.name);
    callback(null, 'ok');
  });

  handler({ name: 'Test' }, {}, function (err, data) {
    t.equal(err, undefined, 'no error with correct input');
    t.equal(data, 'ok', 'data should be "ok"');
  });

  handler({ name: 123123 }, {}, function (err, data) {
    t.notEqual(err, undefined, 'there should be an error with incorrect input');
    t.equal(data, undefined, 'there should be no data');
    t.end();
  });
});

test('simpe jwt configuration test', function (t) {
  const JWTConfig: vandium.VandiumJWTPluginConfig = {
    algorithm: 'HS256',
    secret: 'super-secret',
    enable: true
  };
  vandium.jwt.configure(JWTConfig);
  t.equal(vandium.jwt().state.algorithm, 'HS256', 'HS256 algorithm expected');
  t.equal(vandium.jwt().state.key, 'super-secret', 'secret shoud match');

  const vandInst = vandium.createInstance();
  vandInst.jwt.configure(JWTConfig);
  t.deepEqual(vandInst.jwt.getConfiguration(), JWTConfig, '(instance) config should be equal');
  t.end();
});

test('simple protect configuration test', function (t) {
  const protectConfig: vandium.VandiumProtectPluginConfig = {
    mode: 'fail'
  };
  vandium.protect.configure(protectConfig);
  t.equal(vandium.protect.getConfiguration().mode, protectConfig.mode, 'mode option should be equal');

  const vandInst = vandium.createInstance();
  vandInst.protect.configure(protectConfig);
  t.equal(vandInst.protect.getConfiguration().mode, protectConfig.mode, '(instance) mode option should be equal');
  t.end();
});
