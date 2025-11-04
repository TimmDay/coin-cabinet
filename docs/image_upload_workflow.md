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

   # Find all image files using find command to handle extensions properly
   image_dir="~/Desktop/somnus_collection_images/named_for_upload"

   # Use find to locate all image files with various extensions
   while IFS= read -r -d '' file; do
       if [[ -f "$file" ]]; then

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
               -o quality "auto" \
               -o flags "preserve_transparency"; then
               echo "✅ Success: $filename"
           else
               echo "⚠️  Background removal failed for $filename, trying backup method..."
               echo "📤 Uploading raw image without background removal: $filename"
               # Fallback: upload raw image in original format without any processing
               if cld uploader upload "$file" \
                   -o public_id "$filename_no_ext" \
                   -o use_filename false \
                   -o unique_filename false \
                   -o quality "auto"; then
                   echo "✅ Success with backup method: $filename (no background removal applied)"
               else
                   echo "❌ Failed completely: $filename - may need manual processing"
               fi
           fi
       fi
   done < <(find ~/Desktop/somnus_collection_images/named_for_upload -type f \( -iname "*.heic" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -print0)

   # Reset shell options
   shopt -u nullglob 2>/dev/null || unsetopt null_glob 2>/dev/null
   ```

4. You can now use the image ids in the CloudinaryImage component and they will pull from the image store, auto optimise, etc.

5. If this ever costs significant money, we will code up something of our own and host images from Cloudflare or something. But this is great for low/no users.

6. If the Cloudinary background removal fails this is a great tool to try manually doing it: [Numis.pics Background Removal](https://numis.pics/app/?lang=en)
