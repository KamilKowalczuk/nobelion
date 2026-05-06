import os
import re

directory = '/home/kamil-laptop/Dreams/Projekty/Nobelion/Nobelion strona/nobelion-onyx/src'

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replacements for text-steel, text-silver, text-white
    replacements = [
        (r'(text-(steel|silver|white))/20\b', r'\1/50'),
        (r'(text-(steel|silver|white))/30\b', r'\1/50'),
        (r'(text-(steel|silver|white))/40\b', r'\1/70'),
        (r'(text-(steel|silver|white))/50\b', r'\1/80'),
        (r'(text-(steel|silver|white))/60\b', r'\1/90'),
        (r'(text-(steel|silver|white))/70\b', r'\1/90'),
        (r'opacity-30\b', r'opacity-50'),
        (r'opacity-40\b', r'opacity-60'),
        (r'opacity-50\b', r'opacity-70'),
        (r'opacity-60\b', r'opacity-80'),
    ]

    new_content = content
    for pattern, replacement in replacements:
        new_content = re.sub(pattern, replacement, new_content)

    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.astro') or file.endswith('.svelte'):
            process_file(os.path.join(root, file))

print("Contrast fix completed.")
