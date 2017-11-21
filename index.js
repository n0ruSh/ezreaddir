let fs = require('fs'),
    path = require('path');

function ezreaddir(dirPath, callback) {
    dirPath = path.resolve(dirPath);
    let result = {
        files: [],
        dirs: []
    };
    fs.readdir(dirPath, (err, files) => {
        if(err) {
            callback(err, null);
        }
        let pending = files.length;
        if(!pending) {
            callback(null, result);
        }
        for(let file of files) {
            let filePath = path.join(dirPath, file);
            fs.stat(filePath, (err, stats) => {
                if(stats.isDirectory()) {
                    result.dirs.push({
                        name: file,
                        path: filePath,
                        parent: dirPath,
                    });
                    ezreaddir(filePath, (err, res) => {
                        result.files.push(...(res.files || []));
                        result.dirs.push(...(res.dirs || []));
                        if(--pending === 0) {
                            callback(err, result);
                        }
                    });
                } else {
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if(err) {
                            return callback(err, null)
                        }
                        let fileObj = {
                            name: file,
                            content: data,
                            path: filePath,
                            parent: dirPath
                        };

                        result.files.push(fileObj);
                        if(--pending === 0) {
                            callback(err, result);
                        }
                    })
                }
            });
        }
    });
}

module.exports = ezreaddir;