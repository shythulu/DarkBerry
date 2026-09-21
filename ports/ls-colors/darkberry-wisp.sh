# Darkberry Wisp for LS_COLORS. Light. Text is a violet-leaning cousin of the paint colour.
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
# Source it from your shell rc:  . ~/.config/darkberry/darkberry-wisp.sh
#
# Plain POSIX sh, and safe to source from zsh: the assignments wrap the variable
# name in braces, because unbraced zsh reads `$LS_COLORS:st=` as the :s history
# modifier and refuses the whole file.

# --- What the entry is -----------------------------------------------------
# Directories carry the accent, because they are the thing the eye sorts a
# listing by first. Everything else is quieter than they are.
LS_COLORS="di=01;38;2;210;21;112"  # directory
LS_COLORS="${LS_COLORS}:fi=38;2;79;49;67"  # regular file
LS_COLORS="${LS_COLORS}:ln=38;2;27;119;140"  # symlink, cool and cold like the link column in the lsd theme
LS_COLORS="${LS_COLORS}:or=01;38;2;204;56;56"  # symlink with no target
LS_COLORS="${LS_COLORS}:mi=01;38;2;204;56;56"  # the missing target itself
LS_COLORS="${LS_COLORS}:ex=01;38;2;55;122;55"  # executable -- green because "you can run this" is older than any theme

# A world-writable or sticky directory is still a directory, so it keeps the
# accent's weight and shifts hue rather than shouting in an error colour.
LS_COLORS="${LS_COLORS}:tw=01;38;2;154;76;192"  # sticky and other-writable
LS_COLORS="${LS_COLORS}:ow=01;38;2;154;76;192"  # other-writable
LS_COLORS="${LS_COLORS}:st=01;38;2;154;76;192"  # sticky

# setuid and setgid do deserve to shout.
LS_COLORS="${LS_COLORS}:su=01;38;2;204;56;56"  # setuid
LS_COLORS="${LS_COLORS}:sg=01;38;2;204;56;56"  # setgid

# Pipes, sockets and devices: rare, and grouped so they read as one odd class.
LS_COLORS="${LS_COLORS}:pi=38;2;29;125;108"  # fifo
LS_COLORS="${LS_COLORS}:so=38;2;29;125;108"  # socket
LS_COLORS="${LS_COLORS}:bd=38;2;29;125;108"  # block device
LS_COLORS="${LS_COLORS}:cd=38;2;29;125;108"  # character device

# --- What the file holds ---------------------------------------------------
# Six groups, each a different hue, so a directory's shape is legible before
# you read a single name. Source is the loudest because it is what you came for.

# Source code
LS_COLORS="${LS_COLORS}:*.rs=38;2;154;76;192:*.py=38;2;154;76;192:*.pyi=38;2;154;76;192:\
*.js=38;2;154;76;192:*.mjs=38;2;154;76;192:*.cjs=38;2;154;76;192:*.jsx=38;2;154;76;192:\
*.ts=38;2;154;76;192:*.tsx=38;2;154;76;192:*.go=38;2;154;76;192:*.c=38;2;154;76;192:\
*.h=38;2;154;76;192:*.cc=38;2;154;76;192:*.cpp=38;2;154;76;192:*.hpp=38;2;154;76;192:\
*.cs=38;2;154;76;192"
LS_COLORS="${LS_COLORS}:*.rb=38;2;154;76;192:*.php=38;2;154;76;192:*.pl=38;2;154;76;192:\
*.lua=38;2;154;76;192:*.java=38;2;154;76;192:*.kt=38;2;154;76;192:*.swift=38;2;154;76;192:\
*.zig=38;2;154;76;192:*.hs=38;2;154;76;192:*.ml=38;2;154;76;192:*.scala=38;2;154;76;192:\
*.dart=38;2;154;76;192:*.ex=38;2;154;76;192:*.exs=38;2;154;76;192"
LS_COLORS="${LS_COLORS}:*.sh=38;2;154;76;192:*.bash=38;2;154;76;192:*.zsh=38;2;154;76;192:\
*.fish=38;2;154;76;192:*.ps1=38;2;154;76;192:*.psm1=38;2;154;76;192:*.nu=38;2;154;76;192:\
*.vim=38;2;154;76;192:*.el=38;2;154;76;192:*.scm=38;2;154;76;192:*.sql=38;2;154;76;192"

# Configuration and data
LS_COLORS="${LS_COLORS}:*.json=38;2;122;88;176:*.json5=38;2;122;88;176:*.toml=38;2;122;88;176:\
*.yaml=38;2;122;88;176:*.yml=38;2;122;88;176:*.ini=38;2;122;88;176:*.cfg=38;2;122;88;176:\
*.conf=38;2;122;88;176:*.config=38;2;122;88;176:*.env=38;2;122;88;176:\
*.properties=38;2;122;88;176"
LS_COLORS="${LS_COLORS}:*.xml=38;2;122;88;176:*.plist=38;2;122;88;176:*.csv=38;2;122;88;176:\
*.tsv=38;2;122;88;176:*.parquet=38;2;122;88;176:*.db=38;2;122;88;176:*.sqlite=38;2;122;88;176:\
*.sqlite3=38;2;122;88;176:*.lock=38;2;122;88;176"

# Prose and documents
LS_COLORS="${LS_COLORS}:*.md=38;2;144;103;10:*.markdown=38;2;144;103;10:*.rst=38;2;144;103;10:\
*.org=38;2;144;103;10:*.txt=38;2;144;103;10:*.text=38;2;144;103;10:*.adoc=38;2;144;103;10:\
*.tex=38;2;144;103;10:*.pdf=38;2;144;103;10:*.epub=38;2;144;103;10"
LS_COLORS="${LS_COLORS}:*.doc=38;2;144;103;10:*.docx=38;2;144;103;10:*.odt=38;2;144;103;10:\
*.rtf=38;2;144;103;10:*.ppt=38;2;144;103;10:*.pptx=38;2;144;103;10:*.xls=38;2;144;103;10:\
*.xlsx=38;2;144;103;10:*.ods=38;2;144;103;10"

# Pictures, video and sound
LS_COLORS="${LS_COLORS}:*.png=38;2;183;67;125:*.jpg=38;2;183;67;125:*.jpeg=38;2;183;67;125:\
*.gif=38;2;183;67;125:*.bmp=38;2;183;67;125:*.webp=38;2;183;67;125:*.svg=38;2;183;67;125:\
*.ico=38;2;183;67;125:*.tiff=38;2;183;67;125:*.tif=38;2;183;67;125:*.heic=38;2;183;67;125:\
*.avif=38;2;183;67;125"
LS_COLORS="${LS_COLORS}:*.psd=38;2;183;67;125:*.xcf=38;2;183;67;125:*.raw=38;2;183;67;125:\
*.cr2=38;2;183;67;125:*.nef=38;2;183;67;125:*.dng=38;2;183;67;125"
LS_COLORS="${LS_COLORS}:*.mp4=38;2;183;67;125:*.mkv=38;2;183;67;125:*.webm=38;2;183;67;125:\
*.mov=38;2;183;67;125:*.avi=38;2;183;67;125:*.m4v=38;2;183;67;125:*.wmv=38;2;183;67;125:\
*.flv=38;2;183;67;125"
LS_COLORS="${LS_COLORS}:*.mp3=38;2;183;67;125:*.flac=38;2;183;67;125:*.wav=38;2;183;67;125:\
*.ogg=38;2;183;67;125:*.opus=38;2;183;67;125:*.m4a=38;2;183;67;125:*.aac=38;2;183;67;125"

# Archives and images of whole systems
LS_COLORS="${LS_COLORS}:*.tar=38;2;177;84;35:*.tgz=38;2;177;84;35:*.gz=38;2;177;84;35:\
*.bz2=38;2;177;84;35:*.xz=38;2;177;84;35:*.zst=38;2;177;84;35:*.lz4=38;2;177;84;35:\
*.zip=38;2;177;84;35:*.7z=38;2;177;84;35:*.rar=38;2;177;84;35:*.jar=38;2;177;84;35:\
*.war=38;2;177;84;35"
LS_COLORS="${LS_COLORS}:*.deb=38;2;177;84;35:*.rpm=38;2;177;84;35:*.apk=38;2;177;84;35:\
*.dmg=38;2;177;84;35:*.iso=38;2;177;84;35:*.img=38;2;177;84;35:*.whl=38;2;177;84;35:\
*.pkg=38;2;177;84;35:*.cab=38;2;177;84;35:*.msi=38;2;177;84;35"

# Output you did not write and would not miss: build leavings, logs, backups.
# These are the one group deliberately pushed under the reading colour.
LS_COLORS="${LS_COLORS}:*.log=38;2;150;125;140:*.bak=38;2;150;125;140:*.tmp=38;2;150;125;140:\
*.temp=38;2;150;125;140:*.swp=38;2;150;125;140:*.swo=38;2;150;125;140:*.orig=38;2;150;125;140:\
*.rej=38;2;150;125;140:*.pid=38;2;150;125;140:*.part=38;2;150;125;140:\
*.crdownload=38;2;150;125;140"
LS_COLORS="${LS_COLORS}:*.pyc=38;2;150;125;140:*.pyo=38;2;150;125;140:*.o=38;2;150;125;140:\
*.obj=38;2;150;125;140:*.class=38;2;150;125;140:*.cache=38;2;150;125;140:*~=38;2;150;125;140"

export LS_COLORS
