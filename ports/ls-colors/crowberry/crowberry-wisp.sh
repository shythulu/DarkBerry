# Crowberry Wisp for LS_COLORS. Crowberry tint of Wisp: light, neutrals leaned toward crowberry (base #f8f4ff).
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
# Source it from your shell rc:  . ~/.config/darkberry/crowberry-wisp.sh
#
# Plain POSIX sh, and safe to source from zsh: the assignments wrap the variable
# name in braces, because unbraced zsh reads `$LS_COLORS:st=` as the :s history
# modifier and refuses the whole file.

# --- What the entry is -----------------------------------------------------
# Directories carry the accent, because they are the thing the eye sorts a
# listing by first. Everything else is quieter than they are.
LS_COLORS="di=01;38;2;191;11;100"  # directory
LS_COLORS="${LS_COLORS}:fi=38;2;64;54;84"  # regular file
LS_COLORS="${LS_COLORS}:ln=38;2;2;107;128"  # symlink, cool and cold like the link column in the lsd theme
LS_COLORS="${LS_COLORS}:or=01;38;2;187;38;42"  # symlink with no target
LS_COLORS="${LS_COLORS}:mi=01;38;2;187;38;42"  # the missing target itself
LS_COLORS="${LS_COLORS}:ex=01;38;2;44;111;45"  # executable -- green because "you can run this" is older than any theme

# A world-writable or sticky directory is still a directory, so it keeps the
# accent's weight and shifts hue rather than shouting in an error colour.
LS_COLORS="${LS_COLORS}:tw=01;38;2;140;62;178"  # sticky and other-writable
LS_COLORS="${LS_COLORS}:ow=01;38;2;140;62;178"  # other-writable
LS_COLORS="${LS_COLORS}:st=01;38;2;140;62;178"  # sticky

# setuid and setgid do deserve to shout.
LS_COLORS="${LS_COLORS}:su=01;38;2;187;38;42"  # setuid
LS_COLORS="${LS_COLORS}:sg=01;38;2;187;38;42"  # setgid

# Pipes, sockets and devices: rare, and grouped so they read as one odd class.
LS_COLORS="${LS_COLORS}:pi=38;2;0;111;95"  # fifo
LS_COLORS="${LS_COLORS}:so=38;2;0;111;95"  # socket
LS_COLORS="${LS_COLORS}:bd=38;2;0;111;95"  # block device
LS_COLORS="${LS_COLORS}:cd=38;2;0;111;95"  # character device

# --- What the file holds ---------------------------------------------------
# Six groups, each a different hue, so a directory's shape is legible before
# you read a single name. Source is the loudest because it is what you came for.

# Source code
LS_COLORS="${LS_COLORS}:*.rs=38;2;140;62;178:*.py=38;2;140;62;178:*.pyi=38;2;140;62;178:\
*.js=38;2;140;62;178:*.mjs=38;2;140;62;178:*.cjs=38;2;140;62;178:*.jsx=38;2;140;62;178:\
*.ts=38;2;140;62;178:*.tsx=38;2;140;62;178:*.go=38;2;140;62;178:*.c=38;2;140;62;178:\
*.h=38;2;140;62;178:*.cc=38;2;140;62;178:*.cpp=38;2;140;62;178:*.hpp=38;2;140;62;178:\
*.cs=38;2;140;62;178"
LS_COLORS="${LS_COLORS}:*.rb=38;2;140;62;178:*.php=38;2;140;62;178:*.pl=38;2;140;62;178:\
*.lua=38;2;140;62;178:*.java=38;2;140;62;178:*.kt=38;2;140;62;178:*.swift=38;2;140;62;178:\
*.zig=38;2;140;62;178:*.hs=38;2;140;62;178:*.ml=38;2;140;62;178:*.scala=38;2;140;62;178:\
*.dart=38;2;140;62;178:*.ex=38;2;140;62;178:*.exs=38;2;140;62;178"
LS_COLORS="${LS_COLORS}:*.sh=38;2;140;62;178:*.bash=38;2;140;62;178:*.zsh=38;2;140;62;178:\
*.fish=38;2;140;62;178:*.ps1=38;2;140;62;178:*.psm1=38;2;140;62;178:*.nu=38;2;140;62;178:\
*.vim=38;2;140;62;178:*.el=38;2;140;62;178:*.scm=38;2;140;62;178:*.sql=38;2;140;62;178"

# Configuration and data
LS_COLORS="${LS_COLORS}:*.json=38;2;110;82;171:*.json5=38;2;110;82;171:*.toml=38;2;110;82;171:\
*.yaml=38;2;110;82;171:*.yml=38;2;110;82;171:*.ini=38;2;110;82;171:*.cfg=38;2;110;82;171:\
*.conf=38;2;110;82;171:*.config=38;2;110;82;171:*.env=38;2;110;82;171:\
*.properties=38;2;110;82;171"
LS_COLORS="${LS_COLORS}:*.xml=38;2;110;82;171:*.plist=38;2;110;82;171:*.csv=38;2;110;82;171:\
*.tsv=38;2;110;82;171:*.parquet=38;2;110;82;171:*.db=38;2;110;82;171:*.sqlite=38;2;110;82;171:\
*.sqlite3=38;2;110;82;171:*.lock=38;2;110;82;171"

# Prose and documents
LS_COLORS="${LS_COLORS}:*.md=38;2;129;91;2:*.markdown=38;2;129;91;2:*.rst=38;2;129;91;2:\
*.org=38;2;129;91;2:*.txt=38;2;129;91;2:*.text=38;2;129;91;2:*.adoc=38;2;129;91;2:\
*.tex=38;2;129;91;2:*.pdf=38;2;129;91;2:*.epub=38;2;129;91;2"
LS_COLORS="${LS_COLORS}:*.doc=38;2;129;91;2:*.docx=38;2;129;91;2:*.odt=38;2;129;91;2:\
*.rtf=38;2;129;91;2:*.ppt=38;2;129;91;2:*.pptx=38;2;129;91;2:*.xls=38;2;129;91;2:\
*.xlsx=38;2;129;91;2:*.ods=38;2;129;91;2"

# Pictures, video and sound
LS_COLORS="${LS_COLORS}:*.png=38;2;166;54;118:*.jpg=38;2;166;54;118:*.jpeg=38;2;166;54;118:\
*.gif=38;2;166;54;118:*.bmp=38;2;166;54;118:*.webp=38;2;166;54;118:*.svg=38;2;166;54;118:\
*.ico=38;2;166;54;118:*.tiff=38;2;166;54;118:*.tif=38;2;166;54;118:*.heic=38;2;166;54;118:\
*.avif=38;2;166;54;118"
LS_COLORS="${LS_COLORS}:*.psd=38;2;166;54;118:*.xcf=38;2;166;54;118:*.raw=38;2;166;54;118:\
*.cr2=38;2;166;54;118:*.nef=38;2;166;54;118:*.dng=38;2;166;54;118"
LS_COLORS="${LS_COLORS}:*.mp4=38;2;166;54;118:*.mkv=38;2;166;54;118:*.webm=38;2;166;54;118:\
*.mov=38;2;166;54;118:*.avi=38;2;166;54;118:*.m4v=38;2;166;54;118:*.wmv=38;2;166;54;118:\
*.flv=38;2;166;54;118"
LS_COLORS="${LS_COLORS}:*.mp3=38;2;166;54;118:*.flac=38;2;166;54;118:*.wav=38;2;166;54;118:\
*.ogg=38;2;166;54;118:*.opus=38;2;166;54;118:*.m4a=38;2;166;54;118:*.aac=38;2;166;54;118"

# Archives and images of whole systems
LS_COLORS="${LS_COLORS}:*.tar=38;2;162;71;18:*.tgz=38;2;162;71;18:*.gz=38;2;162;71;18:\
*.bz2=38;2;162;71;18:*.xz=38;2;162;71;18:*.zst=38;2;162;71;18:*.lz4=38;2;162;71;18:\
*.zip=38;2;162;71;18:*.7z=38;2;162;71;18:*.rar=38;2;162;71;18:*.jar=38;2;162;71;18:\
*.war=38;2;162;71;18"
LS_COLORS="${LS_COLORS}:*.deb=38;2;162;71;18:*.rpm=38;2;162;71;18:*.apk=38;2;162;71;18:\
*.dmg=38;2;162;71;18:*.iso=38;2;162;71;18:*.img=38;2;162;71;18:*.whl=38;2;162;71;18:\
*.pkg=38;2;162;71;18:*.cab=38;2;162;71;18:*.msi=38;2;162;71;18"

# Output you did not write and would not miss: build leavings, logs, backups.
# These are the one group deliberately pushed under the reading colour.
LS_COLORS="${LS_COLORS}:*.log=38;2;137;128;155:*.bak=38;2;137;128;155:*.tmp=38;2;137;128;155:\
*.temp=38;2;137;128;155:*.swp=38;2;137;128;155:*.swo=38;2;137;128;155:*.orig=38;2;137;128;155:\
*.rej=38;2;137;128;155:*.pid=38;2;137;128;155:*.part=38;2;137;128;155:\
*.crdownload=38;2;137;128;155"
LS_COLORS="${LS_COLORS}:*.pyc=38;2;137;128;155:*.pyo=38;2;137;128;155:*.o=38;2;137;128;155:\
*.obj=38;2;137;128;155:*.class=38;2;137;128;155:*.cache=38;2;137;128;155:*~=38;2;137;128;155"

export LS_COLORS
