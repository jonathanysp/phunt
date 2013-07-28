var AvatarUploader, app, express, imageId, papercut, path;

papercut = require('papercut');

path = require('path');

//console.log(process.env);

/*
papercut.configure(function() {
  papercut.set('storage', 'file');
  papercut.set('directory', path.join(__dirname, '/../images/output'));
  papercut.set('url', '/output');
  return papercut.set('process', 'crop');
});
*/

papercut.configure(function() {
  papercut.set('storage', 's3');
  papercut.set('bucket', 'phunt');
  papercut.set('S3_KEY', 'AKIAINUQFCDZCUU3I7IQ');
  return papercut.set('S3_SECRET', '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');
});

AvatarUploader = papercut.Schema(function(schema) {
  this.version({
    name: 'thumbnail',
    size: '45x45'
  });
  return this.version({
    name: 'avatar',
    size: '200x200'
  });
});

express = require('express');

app = express();

app.use(express["static"](path.join(__dirname, '/../images/')));

app.use(express.bodyParser());

app.get('/', function(req, res) {
  return res.send(200, "<html>\n  <head>\n    <title>Papercut Example</title>\n  </head>\n  <body>\n    <h1> Papercut! </h1>\n    <form action='/avatar' method='post' enctype=\"multipart/form-data\">\n      <input type='file' name='avatar'/>\n      <button>Upload</button>\n    </form>\n  </body>\n</html>");
});

imageId = 0;

app.post('/avatar', function(req, res) {
  var uploader;
  uploader = new AvatarUploader();
  return uploader.process("" + (imageId++), req.files.avatar.path, function(err, images) {
    console.log(err);
    console.log(images);
    return res.send(200, "<html>\n  <head>\n    <title>Papercut Example: Result</title>\n    <body>\n      <h1> Papercut! </h1>\n      <img src='" + images.thumbnail + "'/>\n      <img src='" + images.avatar + "'/>\n    </body>\n  </head>\n</html>");
  });
});

console.log('express listening port 3000...');

app.listen(3000);
