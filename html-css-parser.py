from html.parser import HTMLParser
import html
import os

class ResilientHtmlStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.fed = []

    def handle_starttag(self, tag, attrs):
        if tag in ('p', 'div', 'tr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'header', 'footer', 'article', 'section'):
            self.fed.append('\n')
        elif tag in ('td', 'th', 'li'):
            self.fed.append(' ')

    def handle_endtag(self, tag):
        if tag in ('p', 'div', 'tr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'footer', 'article', 'section'):
            self.fed.append('\n')

    def handle_data(self, d):
        css_indicators = ('{font-family:', '@keyframes', 'stroke-dasharray:', 'text-anchor:', 'stroke-width:')
        if any(indicator in d for indicator in css_indicators):
            return
        self.fed.append(d)

    def error(self, message):
        pass

def clean_and_repair_html(raw_html):
    if not raw_html:
        return ""
    try:
        if isinstance(raw_html, bytes):
            raw_html = raw_html.decode('utf-8', errors='ignore')

        raw_html = html.unescape(raw_html)

        fixed_html = ""
        for i, char in enumerate(raw_html):
            if char == '<' and i + 1 < len(raw_html) and not raw_html[i+1].isalpha() and raw_html[i+1] not in ('/', '!'):
                fixed_html += "&lt; "
            else:
                fixed_html += char

        parser = ResilientHtmlStripper()
        parser.feed(fixed_html)
        raw_text = "".join(parser.fed)

        clean_lines = []
        for line in raw_text.splitlines():
            line_str = line.strip()
            if line_str.endswith('{') or line_str.endswith('}') or ' !important' in line_str:
                continue
            if line_str:
                clean_lines.append(line_str)

        return "\n".join(clean_lines)
    except Exception as e:
        return f"[Parsing Error Fallback Due To Bad Formatting: {e}]"

# --- 1. RESOLVE INPUT FILE PATH ---
print("Enter the name of your source HTML file (Press ENTER to default to 'clean_input.html'):")
input_filename = input().strip()

# Set default path if input is blank
if not input_filename:
    input_filename = "clean_input.html"

# Smart fallback check if the file doesn't exist exactly as written
if not os.path.exists(input_filename):
    # Try common extensions automatically if file is missing
    for extension in (".html", ".txt"):
        if os.path.exists(input_filename + extension):
            input_filename += extension
            break

# Absolute final check
if not os.path.exists(input_filename):
    print(f"\n❌ Error: Could not find any file named '{input_filename}' in this folder.")
    print("Please make sure the file is placed directly next to this Python script.")
    exit()

# --- 2. READ SOURCE FILE ---
try:
    print(f"Reading file: {input_filename}...")
    with open(input_filename, "r", encoding="utf-8", errors="ignore") as f:
        user_html = f.read()
except Exception as e:
    print(f"❌ Error reading the source file: {e}")
    exit()

# --- 3. CLEAN DATA ---
print("Stripping tags and filtering out raw CSS structures...")
clean_text = clean_and_repair_html(user_html)

# --- 4. SAVE OUTPUT TO FILE ---
print("\nEnter the name for the cleaned output text file (Press ENTER to default to 'clean_output.txt'):")
output_filename = input().strip()
if not output_filename:
    output_filename = "clean_output.txt"

try:
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(clean_text)

    print(f"\n🎉 Success! The final output has been written successfully.")
    print(f"Saved file destination:\n👉 {os.path.abspath(output_filename)}")

except Exception as e:
    print(f"\n❌ Error saving output file: {e}")
