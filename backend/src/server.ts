// @ts-nocheck
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import debug from 'debug';
import app from './app';

debug('my-application');

app.set('port', process.env.BE_PORT ?? 3001);

const server = app.listen(app.get('port'), function () {
  debug('Express server listening on port ' + server.address().port);
  console.log('Express server is running in http://localhost:' + server.address().port);
});
