# Darkberry Fen for LS_COLORS. Soft dark. The background (#4c3342) is within a shade of the paint colour.
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
# Source it from your shell rc:  . ~/.config/darkberry/darkberry-fen.sh
#
# Plain POSIX sh, and safe to source from zsh: the assignments wrap the variable
# name in braces, because unbraced zsh reads `$LS_COLORS:st=` as the :s history
# modifier and refuses the whole file.

# --- What the entry is -----------------------------------------------------
# Directories carry the accent, because they are the thing the eye sorts a
# listing by first. Everything else is quieter than they are.
LS_COLORS="di=01;38;2;250;153;180"  # directory
LS_COLORS="${LS_COLORS}:fi=38;2;242;230;238"  # regular file
LS_COLORS="${LS_COLORS}:ln=38;2;131;212;219"  # symlink, cool and cold like the link column in the lsd theme
LS_COLORS="${LS_COLORS}:or=01;38;2;255;138;138"  # symlink with no target
LS_COLORS="${LS_COLORS}:mi=01;38;2;255;138;138"  # the missing target itself
LS_COLORS="${LS_COLORS}:ex=01;38;2;183;230;183"  # executable -- green because "you can run this" is older than any theme

# A world-writable or sticky directory is still a directory, so it keeps the
# accent's weight and shifts hue rather than shouting in an error colour.
LS_COLORS="${LS_COLORS}:tw=01;38;2;236;188;252"  # sticky and other-writable
LS_COLORS="${LS_COLORS}:ow=01;38;2;236;188;252"  # other-writable
LS_COLORS="${LS_COLORS}:st=01;38;2;236;188;252"  # sticky

# setuid and setgid do deserve to shout.
LS_COLORS="${LS_COLORS}:su=01;38;2;255;138;138"  # setuid
LS_COLORS="${LS_COLORS}:sg=01;38;2;255;138;138"  # setgid

# Pipes, sockets and devices: rare, and grouped so they read as one odd class.
LS_COLORS="${LS_COLORS}:pi=38;2;176;223;217"  # fifo
LS_COLORS="${LS_COLORS}:so=38;2;176;223;217"  # socket
LS_COLORS="${LS_COLORS}:bd=38;2;176;223;217"  # block device
LS_COLORS="${LS_COLORS}:cd=38;2;176;223;217"  # character device

# --- What the file holds ---------------------------------------------------
# Six groups, each a different hue, so a directory's shape is legible before
# you read a single name. Source is the loudest because it is what you came for.

# Source code
LS_COLORS="${LS_COLORS}:*.rs=38;2;236;188;252:*.py=38;2;236;188;252:*.pyi=38;2;236;188;252:\
*.js=38;2;236;188;252:*.mjs=38;2;236;188;252:*.cjs=38;2;236;188;252:*.jsx=38;2;236;188;252:\
*.ts=38;2;236;188;252:*.tsx=38;2;236;188;252:*.go=38;2;236;188;252:*.c=38;2;236;188;252:\
*.h=38;2;236;188;252:*.cc=38;2;236;188;252:*.cpp=38;2;236;188;252:*.hpp=38;2;236;188;252:\
*.cs=38;2;236;188;252"
LS_COLORS="${LS_COLORS}:*.rb=38;2;236;188;252:*.php=38;2;236;188;252:*.pl=38;2;236;188;252:\
*.lua=38;2;236;188;252:*.java=38;2;236;188;252:*.kt=38;2;236;188;252:*.swift=38;2;236;188;252:\
*.zig=38;2;236;188;252:*.hs=38;2;236;188;252:*.ml=38;2;236;188;252:*.scala=38;2;236;188;252:\
*.dart=38;2;236;188;252:*.ex=38;2;236;188;252:*.exs=38;2;236;188;252"
LS_COLORS="${LS_COLORS}:*.sh=38;2;236;188;252:*.bash=38;2;236;188;252:*.zsh=38;2;236;188;252:\
*.fish=38;2;236;188;252:*.ps1=38;2;236;188;252:*.psm1=38;2;236;188;252:*.nu=38;2;236;188;252:\
*.vim=38;2;236;188;252:*.el=38;2;236;188;252:*.scm=38;2;236;188;252:*.sql=38;2;236;188;252"

# Configuration and data
LS_COLORS="${LS_COLORS}:*.json=38;2;201;176;232:*.json5=38;2;201;176;232:*.toml=38;2;201;176;232:\
*.yaml=38;2;201;176;232:*.yml=38;2;201;176;232:*.ini=38;2;201;176;232:*.cfg=38;2;201;176;232:\
*.conf=38;2;201;176;232:*.config=38;2;201;176;232:*.env=38;2;201;176;232:\
*.properties=38;2;201;176;232"
LS_COLORS="${LS_COLORS}:*.xml=38;2;201;176;232:*.plist=38;2;201;176;232:*.csv=38;2;201;176;232:\
*.tsv=38;2;201;176;232:*.parquet=38;2;201;176;232:*.db=38;2;201;176;232:\
*.sqlite=38;2;201;176;232:*.sqlite3=38;2;201;176;232:*.lock=38;2;201;176;232"

# Prose and documents
LS_COLORS="${LS_COLORS}:*.md=38;2;240;214;160:*.markdown=38;2;240;214;160:*.rst=38;2;240;214;160:\
*.org=38;2;240;214;160:*.txt=38;2;240;214;160:*.text=38;2;240;214;160:*.adoc=38;2;240;214;160:\
*.tex=38;2;240;214;160:*.pdf=38;2;240;214;160:*.epub=38;2;240;214;160"
LS_COLORS="${LS_COLORS}:*.doc=38;2;240;214;160:*.docx=38;2;240;214;160:*.odt=38;2;240;214;160:\
*.rtf=38;2;240;214;160:*.ppt=38;2;240;214;160:*.pptx=38;2;240;214;160:*.xls=38;2;240;214;160:\
*.xlsx=38;2;240;214;160:*.ods=38;2;240;214;160"

# Pictures, video and sound
LS_COLORS="${LS_COLORS}:*.png=38;2;255;196;221:*.jpg=38;2;255;196;221:*.jpeg=38;2;255;196;221:\
*.gif=38;2;255;196;221:*.bmp=38;2;255;196;221:*.webp=38;2;255;196;221:*.svg=38;2;255;196;221:\
*.ico=38;2;255;196;221:*.tiff=38;2;255;196;221:*.tif=38;2;255;196;221:*.heic=38;2;255;196;221:\
*.avif=38;2;255;196;221"
LS_COLORS="${LS_COLORS}:*.psd=38;2;255;196;221:*.xcf=38;2;255;196;221:*.raw=38;2;255;196;221:\
*.cr2=38;2;255;196;221:*.nef=38;2;255;196;221:*.dng=38;2;255;196;221"
LS_COLORS="${LS_COLORS}:*.mp4=38;2;255;196;221:*.mkv=38;2;255;196;221:*.webm=38;2;255;196;221:\
*.mov=38;2;255;196;221:*.avi=38;2;255;196;221:*.m4v=38;2;255;196;221:*.wmv=38;2;255;196;221:\
*.flv=38;2;255;196;221"
LS_COLORS="${LS_COLORS}:*.mp3=38;2;255;196;221:*.flac=38;2;255;196;221:*.wav=38;2;255;196;221:\
*.ogg=38;2;255;196;221:*.opus=38;2;255;196;221:*.m4a=38;2;255;196;221:*.aac=38;2;255;196;221"

# Archives and images of whole systems
LS_COLORS="${LS_COLORS}:*.tar=38;2;247;191;158:*.tgz=38;2;247;191;158:*.gz=38;2;247;191;158:\
*.bz2=38;2;247;191;158:*.xz=38;2;247;191;158:*.zst=38;2;247;191;158:*.lz4=38;2;247;191;158:\
*.zip=38;2;247;191;158:*.7z=38;2;247;191;158:*.rar=38;2;247;191;158:*.jar=38;2;247;191;158:\
*.war=38;2;247;191;158"
LS_COLORS="${LS_COLORS}:*.deb=38;2;247;191;158:*.rpm=38;2;247;191;158:*.apk=38;2;247;191;158:\
*.dmg=38;2;247;191;158:*.iso=38;2;247;191;158:*.img=38;2;247;191;158:*.whl=38;2;247;191;158:\
*.pkg=38;2;247;191;158:*.cab=38;2;247;191;158:*.msi=38;2;247;191;158"

# Output you did not write and would not miss: build leavings, logs, backups.
# These are the one group deliberately pushed under the reading colour.
LS_COLORS="${LS_COLORS}:*.log=38;2;162;130;151:*.bak=38;2;162;130;151:*.tmp=38;2;162;130;151:\
*.temp=38;2;162;130;151:*.swp=38;2;162;130;151:*.swo=38;2;162;130;151:*.orig=38;2;162;130;151:\
*.rej=38;2;162;130;151:*.pid=38;2;162;130;151:*.part=38;2;162;130;151:\
*.crdownload=38;2;162;130;151"
LS_COLORS="${LS_COLORS}:*.pyc=38;2;162;130;151:*.pyo=38;2;162;130;151:*.o=38;2;162;130;151:\
*.obj=38;2;162;130;151:*.class=38;2;162;130;151:*.cache=38;2;162;130;151:*~=38;2;162;130;151"

export LS_COLORS
