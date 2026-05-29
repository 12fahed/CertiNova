import assert from 'assert';
import express from 'express';
import { validateValidFields, validateField, isValidObjectId } from '../src/utils/validation.js';
import { encryptData, decryptData, hashPassword } from '../src/utils/crypto.js';
import { createLimiter } from '../src/middleware/rateLimitMiddleware.js';

const results = [];

function pass(name) {
  console.log(`✓ ${name}`);
  results.push({ name, ok: true });
}

function fail(name, err) {
  console.error(`✗ ${name}`);
  console.error(err && err.stack ? err.stack : err);
  results.push({ name, ok: false, err: String(err) });
}

// Validation tests
try {
  const goodFields = {
    recipientName: { x: 10, y: 20, width: 100, height: 20, fontFamily: 'Inter', fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', color: '#abcdef' }
  };
  const res = validateValidFields(goodFields);
  assert.strictEqual(res.isValid, true, 'expected validFields to be valid');
  pass('validateValidFields - valid payload');
} catch (e) { fail('validateValidFields - valid payload', e); }

try {
  const badName = { foo: { x: 0, y: 0, width: 10, height: 10 } };
  const res = validateValidFields(badName);
  assert.strictEqual(res.isValid, false, 'expected invalid field name to fail');
  pass('validateValidFields - invalid field name detected');
} catch (e) { fail('validateValidFields - invalid field name detected', e); }

try {
  const missingProp = { recipientName: { x: 0, y: 0, width: '100' } };
  const res = validateValidFields(missingProp);
  assert.strictEqual(res.isValid, false, 'expected missing height / wrong type to fail');
  pass('validateValidFields - missing/wrong prop detected');
} catch (e) { fail('validateValidFields - missing/wrong prop detected', e); }

try {
  const badColor = { recipientName: { x: 0, y: 0, width: 10, height: 10, color: 'red' } };
  const res = validateValidFields(badColor);
  assert.strictEqual(res.isValid, false, 'expected invalid color to fail');
  pass('validateValidFields - invalid color detected');
} catch (e) { fail('validateValidFields - invalid color detected', e); }

try {
  assert.strictEqual(isValidObjectId('507f191e810c19729de860ea'), true);
  assert.strictEqual(isValidObjectId('not-an-id'), false);
  pass('isValidObjectId - basic checks');
} catch (e) { fail('isValidObjectId - basic checks', e); }

// Crypto tests
try {
  const payload = [{ name: 'Alice', email: 'alice@example.com' }, { name: 'Bob' }];
  const password = 'secret123';
  const encrypted = encryptData(payload, password);
  if (!encrypted || !encrypted.encryptedData || !encrypted.salt || !encrypted.iv) throw new Error('encryptData returned unexpected shape');
  const decrypted = decryptData(encrypted, password);
  assert.deepStrictEqual(decrypted, payload);
  pass('encryptData/decryptData - roundtrip with correct password');
} catch (e) { fail('encryptData/decryptData - roundtrip with correct password', e); }

try {
  const payload = [{ name: 'Alice' }];
  const password = 'secret123';
  const encrypted = encryptData(payload, password);
  let threw = false;
  try {
    decryptData(encrypted, 'wrongpass');
  } catch (err) {
    threw = true;
  }
  assert.strictEqual(threw, true, 'expected decrypt with wrong password to throw');
  pass('decryptData - throws on wrong password');
} catch (e) { fail('decryptData - throws on wrong password', e); }

try {
  const h = hashPassword('mypassword');
  assert.strictEqual(typeof h, 'string');
  assert.strictEqual(h.length, 64, 'sha256 hex length should be 64');
  pass('hashPassword - output shape');
} catch (e) { fail('hashPassword - output shape', e); }

async function testRateLimitMiddleware() {
  const app = express();
  app.use(createLimiter(1, 'Rate limit test message'));
  app.get('/limited', (req, res) => res.json({ success: true }));

  const server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });

  try {
    const { port } = server.address();
    const url = `http://127.0.0.1:${port}/limited`;
    const firstResponse = await fetch(url);
    assert.strictEqual(firstResponse.status, 200);

    const secondResponse = await fetch(url);
    assert.strictEqual(secondResponse.status, 429);
    assert.deepStrictEqual(await secondResponse.json(), {
      success: false,
      message: 'Rate limit test message',
    });
    pass('rateLimitMiddleware - returns JSON 429 after limit is exceeded');
  } finally {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

try {
  await testRateLimitMiddleware();
} catch (e) { fail('rateLimitMiddleware - returns JSON 429 after limit is exceeded', e); }

// Summary
const failed = results.filter(r => !r.ok);
console.log('\nTest summary:');
console.log(`Total: ${results.length}, Passed: ${results.length - failed.length}, Failed: ${failed.length}`);
if (failed.length > 0) {
  console.error('\nFailures:');
  failed.forEach(f => console.error(`- ${f.name}: ${f.err}`));
  process.exitCode = 1;
} else {
  console.log('All tests passed');
}
