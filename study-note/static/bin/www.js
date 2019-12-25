#! /usr/bin/env node
const package = require('../package.json')
const commander = require('commander')
const parser = {
    port: 3000,
    host: 'localhost',
    dir: process.cwd()
}
const args = commander
    .version(package.version)
    .option('-p, --port <version>','server port')
    .option('-o, --host <version>','server hostname')
    .option('-d, --dir <version>','server directory')
    .parse(process.argv)
const Server = require('../server/index')
const server = new Server({...parser, ...args})
server.start()