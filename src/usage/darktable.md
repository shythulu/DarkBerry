darktable ignores the system GTK theme and uses its own, which is why this port exists
beside the [GTK 3](../gtk) one.

1. Copy a flavour from this folder beside darktable's own CSS, so the `@import` resolves; the file's header has the path.
2. Pick it in darktable's preferences under General > Theme.

For colour work, keep the image surround neutral. A saturated frame shifts how you judge
colour in the picture, which is why darktable ships greys. Darkberry uses its least
saturated colours there, but a grey theme is still the right tool for grading.
