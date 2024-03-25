const fs = require('fs');
const uglifyJs = require('uglify-js');
// 异步读取源文件内容
function readSourceFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// 异步写入压缩后的内容
function writeCompressedFile(compressedContent, targetFilePath) {
  return new Promise((resolve, reject) => {
    fs.writeFile(targetFilePath, compressedContent, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// 异步压缩文件
async function compressFile(sourceFilePath, targetFilePath) {
  try {
    // 异步读取源文件内容
    const sourceContent = await readSourceFile(sourceFilePath);

    //压缩js代码
    const compressedCode = uglifyJs.minify(sourceContent).code;
    
    // 异步写入压缩后的内容
    await writeCompressedFile(compressedCode, targetFilePath);
  } catch (err) {
    console.error(err);
  }
}


// 调用异步函数压缩文件
compressFile('./element-china-area-data.iife.js', './element-china-area-data.iife.min.js').catch((err) => {
  console.error(err);
});
