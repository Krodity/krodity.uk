# krodity.uk

My personal portfolio site — [krodity.uk](https://krodity.uk).

Hand-built with vanilla **HTML, CSS, and JavaScript** (no frameworks, no build step).

## Structure

| File           | Purpose                                             |
| -------------- | --------------------------------------------------- |
| `index.html`   | Landing page — intro, about, skills, experience, education |
| `projects.html`| Project showcase                                    |
| `styles.css`   | All styling (theme tokens, layout, animations)      |
| `script.js`    | Custom cursor, ambient effects, scroll reveals      |
| `misc/`        | Fonts, images, and favicon                          |

## Notes

- The custom cursor and ambient animations are enabled only on devices with a
  fine pointer and are disabled when the visitor prefers reduced motion.
- Fully responsive with a mobile-friendly layout.

Running locally is as simple as opening `index.html`, or serving the folder:

```bash
python3 -m http.server
```
