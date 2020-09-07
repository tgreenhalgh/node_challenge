/** @format */
const tape = require('tape')
const bent = require('bent')
const getPort = require('get-port')

const server = require('../')

const getJSON = bent('json')
const getBuffer = bent('buffer')

// Use `nock` to prevent live calls to remote services

const context = {}

tape('setup', async function (t) {
  const port = await getPort()
  context.server = server.listen(port)
  context.origin = `http://localhost:${port}`

  t.end()
})

tape('should get dependencies', async function (t) {
  const html = (await getBuffer(`${context.origin}/dependencies`)).toString()
  t.true(html.includes('bent'), 'should contain bent')
  t.true(html.includes('express'), 'should contain express')
  t.true(html.includes('hbs'), 'should contain hbs')
  t.end()
})

tape('should get minimum secure versions', async function (t) {
  const json = await getJSON(`${context.origin}/minimum-secure`)
  t.true(json.v0.version === 'v0.12.17', 'v0 version shold match')
  t.true(json.v4.version === 'v4.9.0', 'v4 version shold match')
  t.end()
})

tape('should get latest-releases', async function (t) {
  const json = await getJSON(`${context.origin}/latest-releases`)
  t.true(json.v14.version === 'v14.9.0', 'v14 version shold match')
  t.true(json.v13.version === 'v13.14.0', 'v13 version shold match')
  t.end()
})

tape('teardown', function (t) {
  context.server.close()
  t.end()
})
