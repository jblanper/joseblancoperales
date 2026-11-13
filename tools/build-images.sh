#!/usr/bin/env bash
#
# build-images.sh
# ----------------
# Converts the original PNG images into the compressed WebP files the website uses.
# Run it from anywhere, as many times as you like:
#
#     bash tools/build-images.sh
#
# 1. Every PNG in originals/ becomes a WebP file in img/, keeping its subfolder and name:
#
#       originals/fiction/01.png           ->  img/fiction/01.webp
#       originals/fiction/01-spread.png    ->  img/fiction/01-spread.webp
#       originals/portraits/03.png         ->  img/portraits/03.webp
#       originals/about/self-portrait.png  ->  img/about/self-portrait.webp
#
#    These are exactly the paths used in index.html and about.html.
#
# 2. Optional: a book spread (two facing pages placed side by side) can also be made
#    from the book's PDF instead of a PNG. Add one line per spread to tools/books.conf:
#
#       <pdf file> <number of the left page> <output name>
#       originals/book-one.pdf 12 fiction/01-spread
#
#    The output name is relative to img/, so that line creates img/fiction/01-spread.webp.
#    Lines starting with # and empty lines are ignored.
#
# Files that are already up to date are skipped, so running it again is fast.
# The size printed for each file (WIDTHxHEIGHT) is the one to write in the width and
# height attributes of its <img> in the HTML.
#
# Needs ImageMagick. Spreads made from a PDF also need pdftoppm (poppler) or Ghostscript.

set -euo pipefail
cd "$(dirname "$0")/.."   # always work from the project root

# ---------------------------------------------------------------- Settings
MAX_SIZE=1800       # longest side in px: illustrations end up 1800 tall, spreads 1800 wide
QUALITY=85          # 1-100
SPREAD_DPI=150      # resolution used to render the pages of a book PDF
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

formats="$($IM -list format 2>/dev/null || true)"
if ! grep -qi '^ *WEBP' <<<"$formats"; then
  echo "This ImageMagick cannot write WebP files. Install a version with WebP support." >&2
  exit 1
fi

if [ ! -d originals ]; then
  echo "Folder originals/ not found. Put the PNG files there (see the top of this script)." >&2
  exit 1
fi

count=0

# Size of an image as WIDTHxHEIGHT
size_of() { $IDENTIFY -format "%wx%h" "$1"; }

# Converts one image to WebP. It shrinks images bigger than MAX_SIZE, never enlarges them,
# and puts transparent areas on white paper.
convert_image() {
  local src="$1" out="$2"
  mkdir -p "$(dirname "$out")"
  $IM "$src" -auto-orient -background white -alpha remove -alpha off -strip \
    -resize "${MAX_SIZE}x${MAX_SIZE}>" -define webp:method=6 -quality "$QUALITY" "$out"
  echo "$out ($(size_of "$out"))"
  count=$((count + 1))
}

# ------------------------------------------------------------------ PNG files
while IFS= read -r -d '' src; do
  rel="${src#originals/}"
  out="img/${rel%.*}.webp"
  if [ ! "$out" -nt "$src" ]; then
    convert_image "$src" "$out"
  fi
done < <(find originals -type f -iname '*.png' -print0)

# --------------------------------------------------------- Spreads from a PDF
# Renders one page (1 = first page) of a PDF to a PNG file.
render_page() {
  local pdf="$1" page="$2" out="$3"
  if command -v pdftoppm >/dev/null 2>&1; then
    pdftoppm -r "$SPREAD_DPI" -f "$page" -l "$page" -png -singlefile "$pdf" "${out%.png}"
  elif command -v gs >/dev/null 2>&1; then
    # ImageMagick hands PDFs to Ghostscript. If this fails, your ImageMagick policy.xml
    # may be blocking PDF files.
    $IM -density "$SPREAD_DPI" "${pdf}[$((page - 1))]" -background white -alpha remove -alpha off "$out"
  else
    echo "Cannot render PDF pages: install Ghostscript (gs) or poppler (pdftoppm)." >&2
    exit 1
  fi
}

BOOKS_CONF="tools/books.conf"

if [ -f "$BOOKS_CONF" ]; then
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' EXIT

  # Each line: <pdf file> <left page number> <output name>
  # (the "|| [ -n ... ]" also reads a last line that has no newline at the end)
  while read -r pdf left name || [ -n "${pdf:-}" ]; do
    if [ -z "${pdf:-}" ] || [[ "$pdf" == \#* ]]; then continue; fi

    if ! [[ "$left" =~ ^[0-9]+$ ]] || [ -z "$name" ]; then
      echo "Wrong line in $BOOKS_CONF: $pdf $left $name" >&2
      echo "Expected: <pdf file> <left page number> <output name>" >&2
      exit 1
    fi

    out="img/$name.webp"
    if [ -f "$out" ] && [ "$out" -nt "$pdf" ] && [ "$out" -nt "$BOOKS_CONF" ]; then continue; fi
    if [ ! -f "$pdf" ]; then echo "PDF not found: $pdf (line: $pdf $left $name)" >&2; exit 1; fi

    render_page "$pdf" "$left" "$tmp/left.png"
    render_page "$pdf" "$((left + 1))" "$tmp/right.png"
    # +append joins the two pages side by side
    $IM "$tmp/left.png" "$tmp/right.png" +append "$tmp/spread.png"
    convert_image "$tmp/spread.png" "$out"
  done < "$BOOKS_CONF"
fi

echo "Done. $count file(s) created or updated."