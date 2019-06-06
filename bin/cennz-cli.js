#!/usr/bin/env node --experimental-repl-await

require('@oclif/command').run()
.then(require('@oclif/command/flush'))
.catch(require('@oclif/errors/handle'))
