import fs from 'fs'

export function ensureDirectoryExists(directory) {
    return new Promise((resolve, reject) => {
        fs.stat(directory, (err, stats) => {
            if (err && err.code === 'ENOENT') {
                // Directory doesn't exist, create it
                fs.mkdir(`${directory}/images`, { recursive: true }, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else if (err) {
                // Some other error occurred
                reject(err);
            } else if (!stats.isDirectory()) {
                // Path exists but is not a directory
                reject(new Error(`${directory} is not a directory`));
            } else {
                // Directory already exists
                resolve();
            }
        });
    });
}

// // Example usage:
// const directoryPath = './myDirectory';
//
// ensureDirectoryExists(directoryPath)
//     .then(() => {
//         console.log(`${directoryPath} exists or has been created successfully.`);
//     })
//     .catch((err) => {
//         console.error(`Error: ${err.message}`);
//     });
