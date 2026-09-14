# Cheffolio

Personal portfolio, blog, and shadcn registry site for giabao.dev. Content is authored once as MDX and published in several forms.

## Language

### Content

**Doc**:
A single MDX file under `docs/`, with frontmatter metadata and a body.
_Avoid_: Post, article, page (when referring to the source file)

**Category**:
The grouping a Doc belongs to, derived from its immediate folder under `docs/` (`blog`, `resume`). Never declared in frontmatter.
_Avoid_: Section, type, kind

**Markdown mirror**:
The plain-markdown rendering of a Doc served at the `.md` URL for LLMs and copy-paste. Custom MDX components are flattened into plain markdown.
_Avoid_: Raw markdown, LLM route, source

### Resume

**Resume**:
The single professional document about the site owner, published at `/resume` as a viewable and downloadable PDF with a Markdown mirror.
_Avoid_: CV, curriculum vitae

**Resume source**:
The one Doc in the `resume` Category from which the Resume PDF and its Markdown mirror are produced.
_Avoid_: Resume data, resume content, template

**Resume PDF**:
The paginated A4 document generated from the Resume source, shown inline on `/resume` and offered for download.
_Avoid_: Export, print version

**Entry**:
A dated item inside a Resume section (a project, a degree, an award) with a title, an optional subtitle such as a tech stack or institution, a date range, an optional link, and bullet points.
_Avoid_: Item, experience, card, block

**Header**:
The identity block at the top of the Resume: name, location, and contact links, declared in the Resume source frontmatter.
_Avoid_: Contact block, profile, hero
