#!/bin/bash

# Specify the path to your ImageMagick command-line tool (e.g., convert or magick)
IMAGEMAGICK_COMMAND="convert"

# Specify the input image file
INPUT_IMAGE="$HOME/__programs/snippet/biz/snippet-mac-icon.png"

# Specify the output directory where the converted images will be saved
OUTPUT_DIRECTORY="$HOME/__programs/snippet/biz/icons"

# Create the output directory if it doesn't exist
mkdir -p "$OUTPUT_DIRECTORY"

# Specify the desired sizes
sizes=(16 24 32 48 64 96 128 256 512 1024)

# Loop through the sizes and convert the image to PNG format
for size in "${sizes[@]}"
do
    output_file="${OUTPUT_DIRECTORY}/${size}x${size}.png"
    $IMAGEMAGICK_COMMAND "$INPUT_IMAGE" -resize "${size}x${size}" "$output_file"
    echo "Converted image to ${size}px: $output_file"
done
