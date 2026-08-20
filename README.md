# mohiuddin.dev

Personal site: fourteen projects, four documents, five things that run in the browser.

The organising rule is provenance. Every number carries a stamp saying how it was
obtained, and the stamps are load bearing rather than decorative:

| Stamp | Means |
|---|---|
| `MEASURED` | Came out of running the thing, and was written down |
| `DERIVED` | Computed from a repository, a public registry, or a simulator |
| `ESTIMATED` | A design calculation. No hardware has confirmed it |
| `PAPER` | Exists in documents only. Nothing was built |
| `REPORTED` | Someone else's number, quoted with its source |

## Running it

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npx next start -p 3111
```

## The documents

Four are generated from one source, `lib/resume.ts`: an engineering resume and CV,
and a research resume and CV. The print stylesheet lives at the bottom of
`app/globals.css` and only applies under `@media print`.

```bash
npx playwright install chromium   # once
npm run build
npx next start -p 3111 &
npm run pdfs           # -> public/docs/*.pdf   (A4, one page resumes, three page CVs)
curl -s localhost:3111/raw/eng-resume -o public/docs/Mohi-Uddin-Resume-Engineering.md
```

`PORT` overrides the port both scripts talk to, so `PORT=3200 npm run pdfs` works
if 3111 is busy.

Editing a bullet in `lib/resume.ts` updates the web page, the PDF and the markdown
together. There is no second copy to forget about.

## Checks

```bash
npm run shots                          # every route at 1440 / 834 / 390
ROUTES="/,/work/inkline" npm run shots  # or just the ones you touched
```

Horizontal overflow must be `0px` everywhere. That is the only automated visual
rule and it catches most of what actually breaks.

## Layout

```
app/
  page.tsx             index: hero, ledger, timeline, selected work, method
  work/                the index and the fourteen case studies
  thinking/            six working rules
  resume/              all four documents, with a track and kind switch
  print/[id]/          the print rendering the PDFs are made from
  raw/[id]/            the same documents as markdown
  globals.css          the whole design system, including print
components/
  demos/               five things that actually run: the matching engine, the
                       security scanner, the font tracer, the wavelength
                       scrubber, the per class report
lib/
  projects.ts          all fourteen case studies, one object each
  resume.ts            all four documents
```

## Design notes

Dark instrument panel. One accent, amber, used for the single most important thing
on screen. Hairlines instead of shadows. Instrument Serif for display, Sora for
interface, JetBrains Mono for anything the machine produced. No blue, no gradients,
no glass, no em dashes in the copy.
