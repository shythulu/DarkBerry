# Cloudberry Mire for LS_COLORS. Cloudberry tint of Mire: dark, neutrals leaned toward cloudberry (base #341e13).
#
# This is the companion to the lsd port, and the more important half of it.
# lsd 1.2.0 skips the `file-type` key in its theme struct, so colors.yaml can
# only reach the metadata columns -- permissions, owner, size, date, git. The
# names of the files and folders, which are nearly everything you look at in a
# listing, come from LS_COLORS instead, and without it lsd falls back to its
# built-in blue directories and green executables no matter what theme is set.
# GNU ls, eza, fd, dust, delta and zsh's completion menu read the same variable,
# so one file themes all of them.
#
# BSD ls (macOS without coreutils) reads LSCOLORS instead, which only addresses
# the eight ANSI colours and cannot carry these. Use lsd or GNU ls there.
#
# Source it from your shell rc:  . ~/.config/darkberry/cloudberry-mire.sh
#
# Plain POSIX sh, and safe to source from zsh: the assignments wrap the variable
# name in braces, because unbraced zsh reads `$LS_COLORS:st=` as the :s history
# modifier and refuses the whole file.

# --- What the entry is -----------------------------------------------------
# Directories carry the accent, because they are the thing the eye sorts a
# listing by first. Everything else is quieter than they are.
LS_COLORS="di=01;38;2;253;124;165"  # directory
LS_COLORS="${LS_COLORS}:fi=38;2;245;227;218"  # regular file
LS_COLORS="${LS_COLORS}:ln=38;2;134;192;204"  # symlink, cool and cold like the link column in the lsd theme
LS_COLORS="${LS_COLORS}:or=01;38;2;240;106;106"  # symlink with no target
LS_COLORS="${LS_COLORS}:mi=01;38;2;240;106;106"  # the missing target itself
LS_COLORS="${LS_COLORS}:ex=01;38;2;163;218;163"  # executable -- green because "you can run this" is older than any theme

# A world-writable or sticky directory is still a directory, so it keeps the
# accent's weight and shifts hue rather than shouting in an error colour.
LS_COLORS="${LS_COLORS}:tw=01;38;2;221;176;236"  # sticky and other-writable
LS_COLORS="${LS_COLORS}:ow=01;38;2;221;176;236"  # other-writable
LS_COLORS="${LS_COLORS}:st=01;38;2;221;176;236"  # sticky

# setuid and setgid do deserve to shout.
LS_COLORS="${LS_COLORS}:su=01;38;2;240;106;106"  # setuid
LS_COLORS="${LS_COLORS}:sg=01;38;2;240;106;106"  # setgid

# Pipes, sockets and devices: rare, and grouped so they read as one odd class.
LS_COLORS="${LS_COLORS}:pi=38;2;158;208;196"  # fifo
LS_COLORS="${LS_COLORS}:so=38;2;158;208;196"  # socket
LS_COLORS="${LS_COLORS}:bd=38;2;158;208;196"  # block device
LS_COLORS="${LS_COLORS}:cd=38;2;158;208;196"  # character device

# --- What the file holds ---------------------------------------------------
# Six groups, each a different hue, so a directory's shape is legible before
# you read a single name. Source is the loudest because it is what you came for.

# Source code
LS_COLORS="${LS_COLORS}:*.rs=38;2;221;176;236:*.py=38;2;221;176;236:*.pyi=38;2;221;176;236:\
*.js=38;2;221;176;236:*.mjs=38;2;221;176;236:*.cjs=38;2;221;176;236:*.jsx=38;2;221;176;236:\
*.ts=38;2;221;176;236:*.tsx=38;2;221;176;236:*.go=38;2;221;176;236:*.c=38;2;221;176;236:\
*.h=38;2;221;176;236:*.cc=38;2;221;176;236:*.cpp=38;2;221;176;236:*.hpp=38;2;221;176;236:\
*.cs=38;2;221;176;236"
LS_COLORS="${LS_COLORS}:*.rb=38;2;221;176;236:*.php=38;2;221;176;236:*.pl=38;2;221;176;236:\
*.lua=38;2;221;176;236:*.java=38;2;221;176;236:*.kt=38;2;221;176;236:*.swift=38;2;221;176;236:\
*.zig=38;2;221;176;236:*.hs=38;2;221;176;236:*.ml=38;2;221;176;236:*.scala=38;2;221;176;236:\
*.dart=38;2;221;176;236:*.ex=38;2;221;176;236:*.exs=38;2;221;176;236"
LS_COLORS="${LS_COLORS}:*.sh=38;2;221;176;236:*.bash=38;2;221;176;236:*.zsh=38;2;221;176;236:\
*.fish=38;2;221;176;236:*.ps1=38;2;221;176;236:*.psm1=38;2;221;176;236:*.nu=38;2;221;176;236:\
*.vim=38;2;221;176;236:*.el=38;2;221;176;236:*.scm=38;2;221;176;236:*.sql=38;2;221;176;236"

# Configuration and data
LS_COLORS="${LS_COLORS}:*.json=38;2;186;168;220:*.json5=38;2;186;168;220:*.toml=38;2;186;168;220:\
*.yaml=38;2;186;168;220:*.yml=38;2;186;168;220:*.ini=38;2;186;168;220:*.cfg=38;2;186;168;220:\
*.conf=38;2;186;168;220:*.config=38;2;186;168;220:*.env=38;2;186;168;220:\
*.properties=38;2;186;168;220"
LS_COLORS="${LS_COLORS}:*.xml=38;2;186;168;220:*.plist=38;2;186;168;220:*.csv=38;2;186;168;220:\
*.tsv=38;2;186;168;220:*.parquet=38;2;186;168;220:*.db=38;2;186;168;220:\
*.sqlite=38;2;186;168;220:*.sqlite3=38;2;186;168;220:*.lock=38;2;186;168;220"

# Prose and documents
LS_COLORS="${LS_COLORS}:*.md=38;2;232;201;138:*.markdown=38;2;232;201;138:*.rst=38;2;232;201;138:\
*.org=38;2;232;201;138:*.txt=38;2;232;201;138:*.text=38;2;232;201;138:*.adoc=38;2;232;201;138:\
*.tex=38;2;232;201;138:*.pdf=38;2;232;201;138:*.epub=38;2;232;201;138"
LS_COLORS="${LS_COLORS}:*.doc=38;2;232;201;138:*.docx=38;2;232;201;138:*.odt=38;2;232;201;138:\
*.rtf=38;2;232;201;138:*.ppt=38;2;232;201;138:*.pptx=38;2;232;201;138:*.xls=38;2;232;201;138:\
*.xlsx=38;2;232;201;138:*.ods=38;2;232;201;138"

# Pictures, video and sound
LS_COLORS="${LS_COLORS}:*.png=38;2;254;175;212:*.jpg=38;2;254;175;212:*.jpeg=38;2;254;175;212:\
*.gif=38;2;254;175;212:*.bmp=38;2;254;175;212:*.webp=38;2;254;175;212:*.svg=38;2;254;175;212:\
*.ico=38;2;254;175;212:*.tiff=38;2;254;175;212:*.tif=38;2;254;175;212:*.heic=38;2;254;175;212:\
*.avif=38;2;254;175;212"
LS_COLORS="${LS_COLORS}:*.psd=38;2;254;175;212:*.xcf=38;2;254;175;212:*.raw=38;2;254;175;212:\
*.cr2=38;2;254;175;212:*.nef=38;2;254;175;212:*.dng=38;2;254;175;212"
LS_COLORS="${LS_COLORS}:*.mp4=38;2;254;175;212:*.mkv=38;2;254;175;212:*.webm=38;2;254;175;212:\
*.mov=38;2;254;175;212:*.avi=38;2;254;175;212:*.m4v=38;2;254;175;212:*.wmv=38;2;254;175;212:\
*.flv=38;2;254;175;212"
LS_COLORS="${LS_COLORS}:*.mp3=38;2;254;175;212:*.flac=38;2;254;175;212:*.wav=38;2;254;175;212:\
*.ogg=38;2;254;175;212:*.opus=38;2;254;175;212:*.m4a=38;2;254;175;212:*.aac=38;2;254;175;212"

# Archives and images of whole systems
LS_COLORS="${LS_COLORS}:*.tar=38;2;247;171;132:*.tgz=38;2;247;171;132:*.gz=38;2;247;171;132:\
*.bz2=38;2;247;171;132:*.xz=38;2;247;171;132:*.zst=38;2;247;171;132:*.lz4=38;2;247;171;132:\
*.zip=38;2;247;171;132:*.7z=38;2;247;171;132:*.rar=38;2;247;171;132:*.jar=38;2;247;171;132:\
*.war=38;2;247;171;132"
LS_COLORS="${LS_COLORS}:*.deb=38;2;247;171;132:*.rpm=38;2;247;171;132:*.apk=38;2;247;171;132:\
*.dmg=38;2;247;171;132:*.iso=38;2;247;171;132:*.img=38;2;247;171;132:*.whl=38;2;247;171;132:\
*.pkg=38;2;247;171;132:*.cab=38;2;247;171;132:*.msi=38;2;247;171;132"

# Output you did not write and would not miss: build leavings, logs, backups.
# These are the one group deliberately pushed under the reading colour.
LS_COLORS="${LS_COLORS}:*.log=38;2;152;130;118:*.bak=38;2;152;130;118:*.tmp=38;2;152;130;118:\
*.temp=38;2;152;130;118:*.swp=38;2;152;130;118:*.swo=38;2;152;130;118:*.orig=38;2;152;130;118:\
*.rej=38;2;152;130;118:*.pid=38;2;152;130;118:*.part=38;2;152;130;118:\
*.crdownload=38;2;152;130;118"
LS_COLORS="${LS_COLORS}:*.pyc=38;2;152;130;118:*.pyo=38;2;152;130;118:*.o=38;2;152;130;118:\
*.obj=38;2;152;130;118:*.class=38;2;152;130;118:*.cache=38;2;152;130;118:*~=38;2;152;130;118"

export LS_COLORS
