const Iconv = require('iconv-lite');
const fs = require('fs');
const path = require('path');
const { argv } = require('yargs');
const chardet = require('chardet');

Iconv.skipDecodeWarning = true;

const kDefaultExt = ['.SMI', '.ASS', '.SRT', '.VTT'];
const availableEncodings = ['UTF-16LE', 'UTF-16BE', 'ANSI'];

let exts = [];

if (!argv.path) {
    throw Error('No Path args!');
}

if (!argv.ext) {
    exts = kDefaultExt;
}

fs.readdirSync(argv.path).forEach((filename) => {
    const fullpath = path.join(argv.path, filename);
    if (!fs.statSync(fullpath).isDirectory()) {
        const extname = path.extname(fullpath).toUpperCase();
        if (extname !== '' && exts.includes(extname)) {
            const encodingType = chardet.detectFileSync(fullpath).toUpperCase();
            if (availableEncodings.includes(encodingType)) {
                console.log(filename);
                const content = fs.readFileSync(fullpath, 'binary');
                const encoded = Iconv.decode(content, encodingType);
                fs.writeFileSync(fullpath, encoded, 'utf-8');
            }
        }
    }
});