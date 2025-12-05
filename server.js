const http = require('http');
const fs = require('fs');
const path = require('path');
// 移除url模块引入，使用WHATWG URL API替代

const hostname = '127.0.0.1';
const port = 8080;

// MIME类型映射
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.svg': 'application/image/svg+xml'
};

const server = http.createServer((req, res) => {
  // 使用WHATWG URL API替代url.parse()
  const url = new URL(req.url, `http://${req.headers.host}`);
  // 解码URI组件以正确处理中文路径
  let pathname = `.${decodeURIComponent(url.pathname)}`;
  
  // 如果请求的是根路径，则默认返回 galgame.html
  if (pathname === './') {
    pathname = './galgame.html';
  }
  
  const ext = path.parse(pathname).ext;
  
  // 检查文件是否存在
  fs.exists(pathname, function(exist) {
    if (!exist) {
      // 文件不存在，返回404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }

    // 如果是目录，显示目录列表
    if (fs.statSync(pathname).isDirectory()) {
      // 读取目录内容
      fs.readdir(pathname, function(err, files) {
        if (err) {
          res.statusCode = 500;
          res.end(`Error reading directory: ${err}.`);
          return;
        }
        
        // 生成目录列表HTML
        let html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Directory Listing</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              ul { list-style-type: none; padding: 0; }
              li { margin: 5px 0; }
              a { text-decoration: none; color: #0066cc; }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <h1>Directory Listing for ${pathname}</h1>
            <ul>
        `;
        
        // 添加父目录链接（如果不是根目录）
        if (pathname !== './') {
          html += `<li><a href="../">[..]</a></li>`;
        }
        
        // 添加文件和子目录链接
        files.forEach(file => {
          const filePath = path.join(pathname, file);
          const isDirectory = fs.statSync(filePath).isDirectory();
          const displayName = isDirectory ? `[${file}]` : file;
          // 对URL进行编码以正确处理特殊字符和中文
          const encodedFile = encodeURIComponent(file);
          html += `<li><a href="${encodedFile}${isDirectory ? '/' : ''}">${displayName}</a></li>`;
        });
        
        html += `
            </ul>
          </body>
          </html>
        `;
        
        res.setHeader('Content-type', 'text/html');
        res.end(html);
      });
      return;
    }

    // 读取文件
    fs.readFile(pathname, function(err, data) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // 设置Content-Type
        const mimeType = mimeTypes[ext] || 'text/plain';
        res.setHeader('Content-type', mimeType);
        res.end(data);
      }
    });
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log(`Your galgame page is accessible at http://${hostname}:${port}/`);
});