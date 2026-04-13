const express = require('express');
const https = require('https');
const path = require('path');
const app = express();

app.use(express.json({limit: '10mb'}));
app.use(express.static('public'));

app.options('/api/analyze', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.send();
});

app.post('/api/analyze', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const body = JSON.stringify(req.body);
  const opt = {
    hostname: 'api.anthropic.com',
    port: 443,
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Length': Buffer.byteLength(body)
    }
  };
  const r = https.request(opt, apiRes => {
    let data = '';
    apiRes.on('data', c => data += c);
    apiRes.on('end', () => res.json(JSON.parse(data)));
  });
  r.on('error', e => res.status(500).json({error: e.message}));
  r.write(body);
  r.end();
});

app.listen(process.env.PORT || 3000);
