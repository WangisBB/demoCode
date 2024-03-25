const express = require('express');
const path = require('path');
const multiparty = require('multiparty');
const fse = require('fs-extra'); // 使用fs-extra来处理文件和目录操作，它提供了更友好的API  
const app = express();
const uploadDir = './uploads'; // 临时保存分片的目录  
const mergedDir = './merged';  // 保存合并后文件的目录  
// const upload = multer({ dest: 'uploads/' });
const PORT = 3000;
const cors = require('cors');
// 创建上传和合并目录（如果不存在）  
fse.ensureDirSync(uploadDir);
fse.ensureDirSync(mergedDir);

app.use(cors());
// 中间件来解析multipart/form-data  
// app.use(express.json());  
// app.use(express.urlencoded({ extended: true }));  

app.post('/api/upload', (req, res) => {
    const form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).send('Error parsing form: ' + err.message);
        }

        const { index, totalPieces, name } = fields;

        const file = files.file[0]; // 获取上传的文件对象  

        const filePath = path.join(uploadDir, `${name}-${index}`);

        // 将文件流写入到指定的分片文件中  
        const writeStream = fse.createWriteStream(filePath);
        // 获取文件流  
        const fileStream = fse.createReadStream(file.path);
        fileStream.pipe(writeStream);

        writeStream.on('finish', () => {
            res.sendStatus(200);
            // 检查所有分片是否都已上传，如果是则合并文件  
            checkAndMergeChunks(name, totalPieces, (err) => {
                if (err) {
                    console.error('Error merging totalPieces:', err);
                } else {
                    console.log('File merged successfully!');
                }
            });
        });

        writeStream.on('error', (err) => {
            res.status(500).send('Error writing index to disk: ' + err.message);
        });
    });
});

let timer
// 检查并合并分片  
function checkAndMergeChunks(fileName, totalChunks, callback) {
    let missingChunks = 0;
    for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join(uploadDir, `${fileName}-${i}`);
        if (!fse.existsSync(chunkPath)) {
            missingChunks++;
        }
    }


    if (missingChunks === 0) {
        // 所有分片都存在，开始合并  
        if(timer){
             clearTimeout(timer)
        }
        mergeChunks(fileName, totalChunks, callback);

    } else {
        // 还有分片未上传，稍后再试  
        console.log(`Waiting for ${missingChunks} missing totalPieces before merging...`);
        timer && clearTimeout(timer)
        timer = setTimeout(() => {
            checkAndMergeChunks(fileName, totalChunks, callback);
        }, 5000); // 30秒后重试检查  
    }
}

// 合并分片到一个完整的文件  
function mergeChunks(fileName, totalChunks, callback) {
    console.log('mergedDir, fileName :>> ', mergedDir, fileName[0]);
    const outputPath = path.join(mergedDir, fileName[0]);
    const outputStream = fse.createWriteStream(outputPath);

    let currentChunk = 0;

    // 递归函数，用于读取下一个分片  
    function readNextChunk() {
        if (currentChunk >= totalChunks) {
            // 所有分片已读取完毕，关闭输出流并回调  
            outputStream.end();
            callback(null);
            return;
        }

        const chunkPath = path.join(uploadDir, `${fileName}-${currentChunk}`);
        const inputStream = fse.createReadStream(chunkPath);

        inputStream.on('error', (err) => {
            // 读取分片时发生错误，关闭输出流并回调错误  
            outputStream.destroy();
            callback(err);
        });

        inputStream.pipe(outputStream, { end: false }); // 不在每个分片后结束输出流  

        inputStream.on('end', () => {
            // 当前分片读取完毕，继续读取下一个分片  
            currentChunk++;
            readNextChunk();
        });
    }

    // 开始读取第一个分片  
    readNextChunk();

    outputStream.on('finish', () => {
        // 合并完成，清理分片文件  
        for (let i = 0; i < totalChunks; i++) {
            const chunkPath = path.join(uploadDir, `${fileName}-${i}`);
            fse.unlink(chunkPath, (err) => {
                if (err) {
                    console.error(`Error deleting index ${i}:`, err);
                }
            });
        }
    });

    outputStream.on('error', (err) => {
        // 输出流发生错误，回调错误  
        callback(err);
    });
}
// 启动服务器  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});