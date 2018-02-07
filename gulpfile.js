const path = require('path');

const config = require('config');
const gulp = require('gulp');
const git = require('gulp-git');
const del = require('del');
const spawn = require('cross-spawn');

gulp.task('installServices', async () => {
    const services = config.services;

    if (process.argv.indexOf('--remove') !== -1) {
        await del('services/*');
    }

    for (const serviceName in services) {
        if (serviceName !== path.basename(__dirname)) {
            await git.clone('https://github.com/vzat/mongo-stratus-data-retriever', {args: './services/' + serviceName});
        }
    }
});

gulp.task('runServices', ['installServices'], async () => {
    const services = config.services;

    for (const serviceName in services) {
        if (serviceName !== path.basename(__dirname)) {
            spawn.sync('npm', ['i'], {cwd: 'services/' + serviceName});
            const child = await spawn('npm', ['start'], {cwd: 'services/' + serviceName});
            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stdout);
        }
    }
});

gulp.task('start', ['runServices'], async () => {
    const child = spawn('npm', ['start']);
    child.stdout.pipe(process.stdout);
});
