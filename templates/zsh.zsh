# muah — fast-syntax-highlighting color theme
# Generated from palette/dark.json — do not edit by hand.
#
# Source AFTER fast-syntax-highlighting has loaded so FAST_HIGHLIGHT_STYLES exists.
#
#   source ~/.config/zsh/muah.zsh
#
# Keys below are validated against FSH's canonical themes/default.ini.

# Defaults
FAST_HIGHLIGHT_STYLES[default]="fg={{text}}"
FAST_HIGHLIGHT_STYLES[unknown-token]="fg={{crimson}}"

# Keywords (kiss)
FAST_HIGHLIGHT_STYLES[reserved-word]="fg={{pink}},bold"

# Commands / callables
FAST_HIGHLIGHT_STYLES[command]="fg={{green}}"
FAST_HIGHLIGHT_STYLES[hashed-command]="fg={{green}}"
FAST_HIGHLIGHT_STYLES[subcommand]="fg={{green}}"
FAST_HIGHLIGHT_STYLES[builtin]="fg={{purple}}"
FAST_HIGHLIGHT_STYLES[function]="fg={{bright_purple}}"
FAST_HIGHLIGHT_STYLES[alias]="fg={{bright_purple}}"
FAST_HIGHLIGHT_STYLES[suffix-alias]="fg={{bright_purple}}"
FAST_HIGHLIGHT_STYLES[global-alias]="fg={{bright_purple}}"
FAST_HIGHLIGHT_STYLES[precommand]="fg={{orange}}"

# Options / flags
FAST_HIGHLIGHT_STYLES[single-hyphen-option]="fg={{string_blue}}"
FAST_HIGHLIGHT_STYLES[double-hyphen-option]="fg={{string_blue}}"

# Operators
FAST_HIGHLIGHT_STYLES[commandseparator]="fg={{red}}"
FAST_HIGHLIGHT_STYLES[redirection]="fg={{red}}"
FAST_HIGHLIGHT_STYLES[assign]="fg={{orange}}"

# Paths
FAST_HIGHLIGHT_STYLES[path]="fg={{accent_blue}}"
FAST_HIGHLIGHT_STYLES[path-to-dir]="fg={{accent_blue}}"
FAST_HIGHLIGHT_STYLES[pathseparator]="fg={{overlay1}}"

# Globs / history expansion
FAST_HIGHLIGHT_STYLES[globbing]="fg={{orange}}"
FAST_HIGHLIGHT_STYLES[globbing-ext]="fg={{orange}}"
FAST_HIGHLIGHT_STYLES[history-expansion]="fg={{orange}}"

# Quoted arguments
FAST_HIGHLIGHT_STYLES[single-quoted-argument]="fg={{string_blue}}"
FAST_HIGHLIGHT_STYLES[double-quoted-argument]="fg={{string_blue}}"
FAST_HIGHLIGHT_STYLES[dollar-quoted-argument]="fg={{string_blue}}"
FAST_HIGHLIGHT_STYLES[back-quoted-argument]="fg={{string_blue}}"
FAST_HIGHLIGHT_STYLES[back-dollar-quoted-argument]="fg={{string_blue}}"
FAST_HIGHLIGHT_STYLES[back-or-dollar-double-quoted-argument]="fg={{string_blue}}"

# Comments
FAST_HIGHLIGHT_STYLES[comment]="fg={{subtext}}"

# Variables / math
FAST_HIGHLIGHT_STYLES[variable]="fg={{text}}"
FAST_HIGHLIGHT_STYLES[mathvar]="fg={{accent_blue}}"
FAST_HIGHLIGHT_STYLES[mathnum]="fg={{accent_blue}}"
FAST_HIGHLIGHT_STYLES[matherr]="fg={{crimson}}"
