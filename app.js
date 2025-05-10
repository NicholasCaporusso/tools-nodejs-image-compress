// compress-images.js
//
// A Node.js CLI tool to compress JPEG and PNG images (lossless/nearly lossless) using Sharp.
//
// Usage:
//   node compress-images.js -i <input_folder> -o <output_folder> [-r] [--pngLevel <0-9>] [--jpegQuality <1-100>]

const fs = require('fs').promises;
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const sharp = require('sharp');

(async () => {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 -i <input> -o <output> [-r] [--pngLevel <0-9>] [--jpegQuality <1-100>]')
    .option('input', { alias: 'i', demandOption: true, describe: 'Input folder', type: 'string' })
    .option('output', { alias: 'o', demandOption: true, describe: 'Output folder', type: 'string' })
    .option('recursive', { alias: 'r', type: 'boolean', default: false, describe: 'Include subfolders' })
    .option('pngLevel', { describe: 'PNG compression level (0-9)', type: 'number', default: 9 })
    .option('jpegQuality', { describe: 'JPEG quality (1-100)', type: 'number', default: 100 })
    .help()
    .argv;

  const inputDir = path.resolve(argv.input);
  const outputDir = path.resolve(argv.output);

  async function compressFile(filePath) {
    const relativePath = path.relative(inputDir, filePath);
    const destPath = path.join(outputDir, relativePath);
	if(await fs.access(outputDir)) await fs.mkdir(outputDir)
    await fs.mkdir(path.dirname(destPath), { recursive: true });

    try {
      const ext = path.extname(filePath).toLowerCase();
      let pipeline = sharp(filePath, { failOnError: false });

      if (ext === '.jpg' || ext === '.jpeg') {
        pipeline = pipeline.jpeg({ mozjpeg: true, quality: argv.jpegQuality, progressive: true });
      } else if (ext === '.png') {
        pipeline = pipeline.png({ compressionLevel: argv.pngLevel, palette: true, progressive: true });
      } else {
        console.warn(`Skipping unsupported format: ${relativePath}`);
        return;
      }

      await pipeline.toFile(destPath);
      console.log(`Compressed: ${relativePath}`);
    } catch (err) {
      console.error(`Error compressing ${relativePath}:`, err.message);
    }
  }

  async function processDir(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (argv.recursive) await processDir(fullPath);
      } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
        await compressFile(fullPath);
      }
    }
  }

  try {
    await fs.mkdir(outputDir, { recursive: true });
    await processDir(inputDir);
    console.log('Done.');
  } catch (err) {
    console.error('Fatal error:', err.message);
    process.exit(1);
  }
})();

/**
 * Dependencies:
 *   npm install sharp yargs
 */
