import express from 'express';
import playlists from './playlists';
import videos from './videos';
import chats from './chats';
import authentication from './authentication';

const app = express();
const router = express.Router();

app.use('/playlists', playlists);
app.use('/videos', videos);
app.use('/authentication', authentication);
app.use('/chat', chats);

module.exports = app;
