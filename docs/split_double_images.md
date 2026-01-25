# Script to Split Coin Images Vertically

1. install imagemagick
   - `brew install imagemagick` (mac)
   - `sudo apt-get install imagemagick` (linux)
   - windows: https://imagemagick.org/script/download.php#windows

2. save this script as an executable and use it locally.

```bash
#!/bin/bash

# split-coin-images - Split coin images vertically at 50% mark (left and right halves)
# Usage: split-coin-images <input_dir> <output_dir>

set -e  # Exit on any error

# Check if correct number of arguments provided
if [ $# -ne 2 ]; then
    echo "Usage: split-coin-images <input_dir> <output_dir>"
    echo "Example: split-coin-images ./coin_photos ./split_coins"
    exit 1
fi

INPUT_DIR="$1"
OUTPUT_DIR="$2"

# Check if input directory exists
if [ ! -d "$INPUT_DIR" ]; then
    echo "Error: Input directory '$INPUT_DIR' does not exist"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is not installed or not in PATH"
    exit 1
fi

# Use 'magick' if available (ImageMagick 7+), otherwise fall back to 'convert' (ImageMagick 6)
if command -v magick &> /dev/null; then
    MAGICK_CMD="magick"
else
    MAGICK_CMD="convert"
fi

echo "Splitting images vertically (left/right) from '$INPUT_DIR' to '$OUTPUT_DIR'..."

# Counter for processed files
count=0

# Process all image files in the input directory
# Set nullglob to handle case where no files match the pattern
shopt -s nullglob
for file in "$INPUT_DIR"/*.{jpg,jpeg,png,tiff,tif,bmp,gif,webp,JPG,JPEG,PNG,TIFF,TIF,BMP,GIF,WEBP}; do
    # Skip if no files match (though nullglob should handle this)
    [ -e "$file" ] || continue

    # Get filename without path and extension
    filename=$(basename "$file")
    name="${filename%.*}"
    ext="${filename##*.}"

    echo "Processing: $filename"

    # Split the image vertically at 50% (left and right halves)
    # Using -crop 2x1@ which splits into 2 horizontal tiles (left and right)
    # This automatically calculates the correct dimensions and offsets

    # Split into left and right halves using tile method
    $MAGICK_CMD "$file" -crop 2x1@ +repage "$OUTPUT_DIR/${name}_split_%d.$ext"

    # Rename the generated files to more descriptive names
    mv "$OUTPUT_DIR/${name}_split_0.$ext" "$OUTPUT_DIR/${name}_left.$ext" 2>/dev/null || true
    mv "$OUTPUT_DIR/${name}_split_1.$ext" "$OUTPUT_DIR/${name}_right.$ext" 2>/dev/null || true

    ((count++))
done

if [ $count -eq 0 ]; then
    echo "No image files found in '$INPUT_DIR'"
    echo "Supported formats: jpg, jpeg, png, tiff, tif, bmp, gif, webp"
else
    echo "Successfully processed $count image(s)"
    echo "Output files are in '$OUTPUT_DIR'"
fi
```
