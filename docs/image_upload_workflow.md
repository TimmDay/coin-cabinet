# Image Upload Workflow

1. Prepare your image files locally.
   We use single side images per coin (one image for obverse, one for reverse).

   If your image(s) are double coin images, you can split them locally using the shell script [split_double_images.md](split_double_images.md).
   note: you will need imagemagick installed for this to work.
   - Mac: `brew install imagemagick`
   - Linux: `sudo apt-get install imagemagick`
   - Windows: https://imagemagick.org/script/download.php#windows

2. Your image files should be named according to the [Image file naming guide](../README.md#image-file-naming-guide).
   There is a tool in the add-coins route (auth users only) that will auto format it for you.

3. Upload images to Cloudinary using the CLI tool:

   Upload all images with transparent background and quality preservation.
   note: Cloudinary CLI doesn't support batch uploads, so loop is required.
   note: Trim (crop to up the coin edge) can perhaps be applied on image fetch later.

   ```bash
   # Set shell options to handle missing files gracefully
   shopt -s nullglob 2>/dev/null || setopt null_glob 2>/dev/null

   # Process each file type separately to avoid glob expansion issues
   for ext in jpg jpeg png; do
       for file in ~/Desktop/somnus_collection_images/named_for_upload/*.$ext; do
           # Skip if no files of this extension exist
           [ ! -f "$file" ] && continue

           filename=$(basename "$file")
           echo "Uploading $filename..."
           # Extract just the filename without extension for clean public_id
           filename_no_ext="${filename%.*}"

           # Try background removal with error handling
           if cld uploader upload "$file" \
               -o public_id "$filename_no_ext" \
               -o use_filename false \
               -o unique_filename false \
               -o effect "background_removal" \
               -o format "png" \
               -o quality "lossless" \
               -o flags "preserve_transparency" 2>/dev/null; then
               echo "✅ Success: $filename"
           else
               echo "⚠️  Background removal failed for $filename, trying alternative method..."
               # Fallback: try with improved edge detection
               if cld uploader upload "$file" \
                   -o public_id "$filename_no_ext" \
                   -o use_filename false \
                   -o unique_filename false \
                   -o effect "improve" \
                   -o effect "background_removal:fine_edges" \
                   -o format "png" \
                   -o quality "lossless" \
                   -o flags "preserve_transparency"; then
                   echo "✅ Success with alternative method: $filename"
               else
                   echo "❌ Failed completely: $filename - may need manual processing"
               fi
           fi
       done
   done

   # Reset shell options
   shopt -u nullglob 2>/dev/null || unsetopt null_glob 2>/dev/null
   ```

4. You can now use the image ids in the CloudinaryImage component and they will pull from the image store, auto optimise, etc.

5. If this ever costs significant money, we will code up something of our own and host images from Cloudflare or something. But this is great for low/no users.
