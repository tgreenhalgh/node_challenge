/** @format */
const express = require('express');
const bent = require('bent');
const getJSON = bent('json');
const semver = require('semver');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const API_URL = 'https://nodejs.org/dist/index.json'

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/**
 * Returns an object with latest versions grouped by major version.
 *
 * @param {string} url The API url.
 * @param {boolean} secure Whether we want secure versions.
 */
const getLatestVersion = async (url, secure) => {
  try {
    const resObj = {};
    const distObj = await getJSON(url);
    let dists = distObj;

    if (secure) dists = distObj.filter((d) => d.security === true);

    dists.forEach((v) => {
      const major = `v${semver.major(v.version)}`;
      // note that spec shows an empty files array
      v.files = [];
      if (resObj[major])
        resObj[major] = semver.gt(resObj[major].version, v.version)
          ? resObj[major]
          : v;
      else resObj[major] = v;
    });

    return resObj;
  } catch (err) {
    return err;
  }
};

app.get('/', (req, res) => {
  res.send('<br> Node.js Examples Initiative Challenge <br>');
});

app.get('/dependencies', (req, res) => {
  try {
    const rawdata = fs.readFileSync('package.json', 'utf8');
    const data = JSON.parse(rawdata);
    const dependencies = {};
    for (const key in data.dependencies) {
      dependencies[key] = { name: key, version: data.dependencies[key] };
    }
    res.render('dependencies', { dependency: dependencies });
  } catch (err) {
    console.error(`Error reading package.json: ${err}`);
    res.send(err);
  }
});

app.get('/minimum-secure', async (req, res) => {
  res.json(
    await getLatestVersion(API_URL, true),
  );
});

app.get('/latest-releases', async (req, res) => {
  res.json(
    await getLatestVersion(API_URL, false),
  );
});

// app.listen(PORT, () => {
//   console.log(`Examples Initiative challenge app listening at http://localhost:${PORT}`)
// })
app.listen(PORT)

// necessary for tape testing
exports = module.exports = app;
