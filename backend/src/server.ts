import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import { BE_PORT } from './config';
import debug from 'debug';
import app from './app';

debug('my-application');

app.set('port', BE_PORT ?? 3001);

const server = app.listen(app.get('port'), function () {
  const address = server.address();
  if (address && typeof address !== 'string') {
    debug('Express server listening on port ' + address.port);
    console.log('Express server is running in http://localhost:' + address.port);
  } else {
    console.error('Unable to determine server address or port.');
  }
});
