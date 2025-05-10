# Compress Images Utility

A simple Node.js CLI tool to aggressively compress JPEG and PNG images with near-lossless quality.

## Prerequisites

- Node.js (>=12.x)
- npm

## Installation

1. Clone or download the project files into a folder.
2. In that folder, install dependencies:

   ```bash
   npm install imagemin imagemin-mozjpeg imagemin-pngquant imagemin-optipng imagemin-zopfli yargs
   ```

## Usage via CLI

```bash
node compress-images.js -i <input_folder> -o <output_folder> [-r] [--quality <0.0-1.0>]
```

### Options

- `-i, --input`: Path to the folder containing images (required).
- `-o, --output`: Path where optimized images will be saved (required).
- `-r, --recursive`: Traverse subfolders and preserve structure.
- `--quality <float>`: PNG quantization quality range center (e.g., 0.8 for near-lossless).

## Usage via Batch File (Windows)

1. Double-click `compress-images.bat`.
2. When prompted, paste or type the paths and choose recursion.
3. The script will run and display progress.

## Examples

Non-recursive, default PNG quality:

```bash
node compress-images.js -i ./photos -o ./compressed
```

Recursive, higher PNG quality range:

```bash
node compress-images.js -i ./photos -o ./compressed -r --quality 0.9
```

## Notes

- JPEGs are processed with MozJPEG (`quality:100, progressive`).
- PNGs go through pngquant, OptiPNG, and Zopfli for maximal lossless compression.
- Adjust `--quality` to trade off file size vs. fidelity on PNGs.
