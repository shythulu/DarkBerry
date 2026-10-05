#!/usr/bin/env bash
# A short terminal session in the terminal's own ANSI colours: a listing, git, a swatch row.
# $1 = flavour id, for the LS_COLORS file. cap.sh passes ID, SUB, PORTS and SAMPLE.
fl=$1; . "$PORTS/ls-colors${SUB:-}/${ID:-darkberry}-$fl.sh"
cd "$SAMPLE"
p() { printf '\e[1;35m%s\e[0m \e[1;36m❯\e[0m \e[1m%s\e[0m\n' "~/bog" "$1"; }
p "ls -l --group-directories-first"
ls -l --color=always --group-directories-first --time-style=+%b\ %e | sed 1d
echo
p "git status --short"
git -c color.ui=always status --short
echo
p "git diff src/ledger.rs"
git -c color.ui=always --no-pager diff src/ledger.rs | tail -n +5
echo
for i in 0 1 2 3 4 5 6 7; do printf '\e[48;5;%dm    \e[0m' $i; done; printf '  '
for i in 8 9 10 11 12 13 14 15; do printf '\e[48;5;%dm    \e[0m' $i; done; echo
printf '\e[1mbold\e[0m \e[3mitalic\e[0m \e[4munderline\e[0m \e[7m reverse \e[0m \e[2mdim\e[0m  '
printf '\e[31mred\e[0m \e[32mgreen\e[0m \e[33myellow\e[0m \e[34mblue\e[0m \e[35mmagenta\e[0m \e[36mcyan\e[0m\n'
p ""
