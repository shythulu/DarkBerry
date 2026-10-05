#!/usr/bin/env bash
# Builds the sample project the screenshots show: a small Rust crate with a git history,
# an unstaged change and an untracked file, plus files of every kind for a listing.
# Writes $SHOTS/sample ($HOME/.cache/darkberry-shots/sample by default), where cap.sh looks.
set -e
S=${SHOTS:-$HOME/.cache/darkberry-shots}/sample; rm -rf "$S"; mkdir -p "$S"/{src,scripts,assets,notes}; cd "$S"
cat > Cargo.toml <<'T'
[package]
name = "bog"
version = "0.3.0"
edition = "2021"

[dependencies]
serde = { version = "1", features = ["derive"] }
T
cat > src/main.rs <<'T'
//! Bog: a small brewing ledger for the witch's kitchen.
use std::collections::BTreeMap;
use std::fmt;

/// A brew in progress, steeped from one or more berries.
#[derive(Debug, Clone, PartialEq)]
pub struct Brew {
    pub name: String,
    pub berries: Vec<Berry>,
    pub potency: f32,
    pub ready: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum Berry { Bilberry, Cranberry, Gooseberry, Juniper }

impl fmt::Display for Brew {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let state = if self.ready { "ready" } else { "steeping" };
        write!(f, "{} ({:.1}%) is {}", self.name, self.potency * 100.0, state)
    }
}

impl Brew {
    pub fn steep(name: &str, berries: &[Berry]) -> Self {
        let potency = berries.len() as f32 * 0.125;
        Brew { name: name.to_owned(), berries: berries.to_vec(), potency, ready: false }
    }

    /// Stirs the brew `times` times; three stirs make it ready.
    pub fn stir(&mut self, times: u32) -> &mut Self {
        for _ in 0..times { self.potency = (self.potency + 0.05).min(1.0); }
        self.ready = times >= 3 || self.potency > 0.9;
        self
    }
}

fn main() {
    let mut ledger: BTreeMap<u32, Brew> = BTreeMap::new();
    let mut nightshade = Brew::steep("nightshade cordial", &[Berry::Bilberry, Berry::Juniper]);
    nightshade.stir(3);
    ledger.insert(1, nightshade);
    for (id, brew) in &ledger {
        match brew.ready {
            true => println!("#{id}: {brew}"),
            false => eprintln!("#{id}: not yet, {}", brew.name),
        }
    }
}
T
cat > src/lib.rs <<'T'
pub mod ledger;
pub const VERSION: &str = "0.3.0";
T
cat > src/ledger.rs <<'T'
use std::path::Path;
pub fn load(path: &Path) -> std::io::Result<String> { std::fs::read_to_string(path) }
T
cat > README.md <<'T'
# Bog

A brewing ledger for the witch's kitchen.

## Usage

1. Steep a brew with `bog steep <name>`.
2. Stir it three times.
3. Wait for *ready*.

| Berry | Potency |
|---|---|
| Bilberry | 0.125 |
| Juniper | 0.125 |

> The mire keeps what the fen forgets.
T
cat > notes/brewing.md <<'T'
# Brewing notes

- [x] bilberry cordial
- [ ] juniper tonic
- [ ] cloudberry jam, **if** the frost holds
T
printf 'MIRE_DEPTH=3\nFEN_LIGHT=dusk\n' > .env
printf '#!/bin/sh\necho steeping "$@"\n' > scripts/steep.sh; chmod +x scripts/steep.sh
printf 'target/\n*.log\n' > .gitignore
printf '{ "berries": ["bilberry", "juniper"], "stirs": 3 }\n' > data.json
printf '[fen]\nlight = "dusk"\n' > config.toml
printf 'all:\n\tcargo build\n' > Makefile
convert -size 640x400 plasma:fractal -blur 0x2 assets/photo.jpg
tar czf archive.tar.gz README.md notes
ln -s notes/brewing.md latest.md
printf 'steep 1\nsteep 2\n' > steep.log
touch CHANGELOG.md
git init -q -b main; git config user.email bog@example.invalid; git config user.name Bog
git add -A; git commit -qm "First brew"
# an unstaged change and an untracked file, so status and diff have something to show
sed -i 's/self.ready = times >= 3 || self.potency > 0.9;/self.ready = times >= 3 \&\& self.potency > 0.5;/' src/main.rs
sed -i 's/potency \* 100.0, state/potency * 100.0, state.to_uppercase()/' src/main.rs
printf 'pub fn taste(b: \&crate::Brew) -> bool { b.potency > 0.4 }\n' >> src/ledger.rs
printf '# Cloudberry\n\nNot yet.\n' > notes/cloudberry.md
echo "sample at $S"
