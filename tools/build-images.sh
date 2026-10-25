#!/usr/bin/env bash
#
# build-images.sh
# ----------------
# Prepares the images for the website. Run it from anywhere, as many times as you like:
#
#     bash tools/build-images.sh
#
# 1. Every PNG in originals/ becomes
#       images/thumbs/<name>.webp   small thumbnail used in the mosaic
#       images/full/<name>.webp     compressed full-size image used in the lightbox
# 2. Every line in tools/books.conf becomes a book spread (two facing pages of
#    the book PDF placed side by side) in images/spreads/<name>.webp
#
# Files that are already up to date are skipped, so re-running is fast.
# Needs ImageMagick. Spreads also need either pdftoppm (poppler) or Ghostscript.

set -euo pipefail
cd "$(dirname "$0")/.."   # always work from the project root

# ---------------------------------------------------------------- Settings
THUMB_WIDTH=600        # thumbnail width in px (height follows the proportions)
THUMB_QUALITY=80       # 1-100
FULL_MAX_SIZE=2000     # longest side of the full-size image in px
FULL_QUALITY=85        # 1-100
SPREAD_DPI=150         # resolution used to render the book pages
SPREAD_QUALITY=85      # 1-100
FORMAT=webp            # webp, or jpg if your ImageMagick has no WebP support
# -----------------------------------------------------------------------

# ImageMagick 7 uses "magick", ImageMagick 6 uses "convert" and "identify"
if command -v magick >/dev/null 2>&1; then
  IM="magick"; IDENTIFY="magick identify"
elif command -v convert >/dev/null 2>&1; then
  IM="convert"; IDENTIFY="identify"
else
  echo "ImageMagick not found. Install it first (https://imagemagick.org)." >&2
  exit 1
fi

# Fall back to JPG if this ImageMagick cannot write WebP
if [ "$FORMAT" = "webp" ] && ! $IM -list format 2>/dev/null | grep -qi '^ *WEBP'; then
  echo "This ImageMagick has no WebP support, using JPG instead."
  FORMAT=jpg
fi

mkdir -p images/thumbs images/full images/spreads

# Size of an image as WIDTHxHEIGHT (handy for the width/height attributes in the HTML)
size_of() { $IDENTIFY -format "%wx%h" "$1"; }

# --------------------------------------------------- Thumbnails and full size
shopt -s nullglob
count=0
for src in originals/*.png; do
  name="$(basename "${src%.png}")"
  thumb="images/thumbs/$name.$FORMAT"
  full="images/full/$name.$FORMAT"

  if [ ! "$thumb" -nt "$src" ]; then
    # ">" means "only shrink, never enlarge"
    $IM "$src" -auto-orient -strip -resize "${THUMB_WIDTH}x>" -quality "$THUMB_QUALITY" "$thumb"
    echo "thumb  $thumb ($(size_of "$thumb"))"
    count=$((count + 1))
  fi
  if [ ! "$full" -nt "$src" ]; then
    $IM "$src" -auto-orient -strip -resize "${FULL_MAX_SIZE}x${FULL_MAX_SIZE}>" -quality "$FULL_QUALITY" "$full"
    echo "full   $full ($(size_of "$full"))"
    count=$((count + 1))
  fi
done

# --------------------------------------------------------------- Book spreads
# Renders one page (1 = first page) of a PDF to a PNG file.
render_page() {
  local pdf="$1" page="$2" out="$3"
  if command -v pdftoppm >/dev/null 2>&1; then
    pdftoppm -r "$SPREAD_DPI" -f "$page" -l "$page" -png -singlefile "$pdf" "${out%.png}"
  elif command -v gs >/dev/null 2>&1; then
    # ImageMagick hands PDFs to Ghostscript. If this fails, your ImageMagick policy.xml
    # may be blocking PDF files (see the README, "Troubleshooting").
    $IM -density "$SPREAD_DPI" "$pdf[$((page - 1))]" -background white -alpha remove -alpha off "$out"
  else
    echo "Cannot render PDF pages: install Ghostscript (gs) or poppler (pdftoppm)." >&2
    exit 1
  fi
}

if [ -f tools/books.conf ]; then
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' EXIT

  # Each line: <pdf file> <left page number> <output name>
  while read -r pdf left name; do
    # Skip empty lines and comments
    if [ -z "${pdf:-}" ] || [[ "$pdf" == \#* ]]; then continue; fi

    out="images/spreads/$name.$FORMAT"
    if [ -f "$out" ] && [ "$out" -nt "$pdf" ] && [ "$out" -nt tools/books.conf ]; then continue; fi
    if [ ! -f "$pdf" ]; then echo "PDF not found: $pdf (line: $pdf $left $name)" >&2; exit 1; fi

    render_page "$pdf" "$left" "$tmp/left.png"
    render_page "$pdf" "$((left + 1))" "$tmp/right.png"
    # +append joins the two pages side by side
    $IM "$tmp/left.png" "$tmp/right.png" +append -strip -quality "$SPREAD_QUALITY" "$out"
    echo "spread $out ($(size_of "$out")) from pages $left-$((left + 1))"
    count=$((count + 1))
  done < tools/books.conf
fi

echo "Done. $count file(s) created or updated."
