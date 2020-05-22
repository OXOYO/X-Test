/**
 * Created by OXOYO on 2017/10/25.
 */

const gulp = require('gulp')
const gulpEslint = require('gulp-eslint')
const gulpNodemon = require('gulp-nodemon')
// const gulpSequence = require('gulp-sequence')
const eslintFriendlyFormatter = require('eslint-friendly-formatter')

const config = {
  server: {
    script: './src/server.js'
  }
}

const lintFiles = (files) => {
  return gulp.src(
    files
  ).pipe(
    gulpEslint({
      configFile: './.eslintrc.js'
    })
  ).pipe(
    gulpEslint.format(eslintFriendlyFormatter)
  ).pipe(
    gulpEslint.result(result => {
      // Called for each ESLint result.
      if (result.messages.length || result.warningCount || result.errorCount) {
        console.log(`ESLint Check: ${result.filePath}`)
      }
      if (result.warningCount) {
        console.log(`# Warnings: ${result.warningCount}`)
      }
      if (result.errorCount) {
        console.log(`# Errors: ${result.errorCount}`)
      }
      if (result.messages.length) {
        console.log(`# Messages: ${JSON.stringify(result.messages)}`)
      }
    })
  )
}

// eslint
gulp.task('ESlint', async () => {
  await lintFiles([
    'src/**',
    '!node_modules/**'
  ])
})

// nodemon
gulp.task('nodemon', async (done) => {
  let stream = await gulpNodemon({
    script: config.server.script,
    ext: 'js',
    env: {
      'NODE_ENV': 'development'
    },
    tasks: (changedFiles) => {
      lintFiles(changedFiles)
      return []
    }
  })
  await stream.on('restart', () => {
    console.log('Service restarted!')
  }).on('crash', () => {
    console.error('Service has crashed!\n')
    // restart the server in 10 seconds
    // stream.emit('restart', 10)
    done()
  })
})

// default
gulp.task('default', async () => {
  // await gulpSequence('ESlint', 'nodemon')(() => {
  //   console.log('Service started!')
  // })
  gulp.series('ESlint', 'nodemon')()
})
