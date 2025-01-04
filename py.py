import os
import sys
import argparse

def get_image_files(directory, extensions=['.jpg', '.jpeg']):
    """
    Retrieves a sorted list of image files from the specified directory
    with the given extensions.
    """
    files = [
        f for f in os.listdir(directory)
        if os.path.isfile(os.path.join(directory, f)) and
        os.path.splitext(f.lower())[1] in extensions
    ]
    files.sort()  # Sort files alphabetically; modify if needed
    return files

def rename_images(directory, prefix, start_num, digits, dry_run=False):
    """
    Renames image files in the specified directory with the given prefix and numbering.
    
    :param directory: Path to the directory containing images
    :param prefix: Prefix for the new filenames
    :param start_num: Starting number for the sequence
    :param digits: Number of digits for numbering (for leading zeros)
    :param dry_run: If True, prints the renaming actions without performing them
    """
    image_files = get_image_files(directory)
    
    if not image_files:
        print("No image files found in the specified directory.")
        return
    
    print(f"Found {len(image_files)} image(s) to rename.")
    
    # Check for potential filename conflicts
    existing_files = set(os.listdir(directory))
    new_filenames = []
    current_num = start_num
    
    for original_name in image_files:
        extension = os.path.splitext(original_name)[1]
        new_name = f"{prefix}{str(current_num).zfill(digits)}{extension}"
        if new_name in existing_files and new_name != original_name:
            print(f"Conflict detected: {new_name} already exists. Aborting to prevent overwriting.")
            return
        new_filenames.append(new_name)
        current_num += 1
    
    # Perform renaming
    for original_name, new_name in zip(image_files, new_filenames):
        original_path = os.path.join(directory, original_name)
        new_path = os.path.join(directory, new_name)
        if dry_run:
            print(f"Would rename: {original_name} --> {new_name}")
        else:
            os.rename(original_path, new_path)
            print(f"Renamed: {original_name} --> {new_name}")
    
    if dry_run:
        print("\nDry run complete. No files were actually renamed.")
    else:
        print("\nRenaming process completed successfully.")

def parse_arguments():
    """
    Parses command-line arguments.
    """
    parser = argparse.ArgumentParser(description="Batch rename .jpg/.jpeg images in a folder sequentially.")
    
    parser.add_argument(
        'directory',
        type=str,
        help='Path to the directory containing images to rename.'
    )
    
    parser.add_argument(
        '--prefix',
        type=str,
        default='photo',
        help='Prefix for the new filenames (default: "photo").'
    )
    
    parser.add_argument(
        '--start',
        type=int,
        default=1,
        help='Starting number for the sequence (default: 1).'
    )
    
    parser.add_argument(
        '--digits',
        type=int,
        default=3,
        help='Number of digits for numbering (for leading zeros, default: 3).'
    )
    
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Perform a dry run without renaming any files.'
    )
    
    return parser.parse_args()

def main():
    args = parse_arguments()
    
    directory = args.directory
    prefix = args.prefix
    start_num = args.start
    digits = args.digits
    dry_run = args.dry_run
    
    # Validate directory
    if not os.path.isdir(directory):
        print(f"Error: The directory '{directory}' does not exist or is not accessible.")
        sys.exit(1)
    
    rename_images(directory, prefix, start_num, digits, dry_run)

if __name__ == "__main__":
    main()
