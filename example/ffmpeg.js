const path   = require('path');
const fs     = require('fs');
const ytdl   = require('..');
const ffmpeg = require('fluent-ffmpeg');

var url = 'https://www.youtube.com/watch?v=TGbwL8kSpEk';
var audioOutput = path.resolve(__dirname, 'sound.mp4');
ytdl(url, { filter: function(f) {
  return f.container === 'mp4' && !f.encoding; } })
  // Write audio to file since ffmpeg supports only one input stream.
  .pipe(fs.createWriteStream(audioOutput))
  .on('finish', () => {
    ffmpeg()
    .input(ytdl(url, { filter: (f) => {
      return f.container === 'mp4' && !f.audioEncoding; } }))
      .videoCodec('copy')
      .input(audioOutput)
      .audioCodec('copy')
      .save(path.resolve(__dirname, 'output.mp4'))
      .on('error', console.error)
      .on('progress', function(progress) {
        process.stdout.cursorTo(0);
        process.stdout.clearLine(1);
        process.stdout.write(progress.timemark);
      }).on('end', () => {
        console.log();
      });
  });
