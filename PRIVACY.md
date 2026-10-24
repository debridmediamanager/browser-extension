# Privacy Policy — Debrid Media Manager Browser Extension

**Last updated:** 2026-10-24

## Data Collection

This extension does not collect, store or sell personal data, and it has no
account, analytics or tracking. To find the right title on some sites it asks a
public service for the title's identifier, as described below.

## How It Works

- On supported movie, TV and anime sites it reads the page to find the title's
  identifier (an IMDb, AniDB or MyAnimeList id) and adds a DMM button.
- On any page it reads magnet links, and torrent links whose address contains
  the info hash, to add a DMM button beside them.
- Clicking a DMM button opens debridmediamanager.com in a new tab with the
  title id, season number or info hash in the address.

## Requests to Other Services

Some sites do not show an IMDb or MyAnimeList id, so the extension looks it up.
Each request carries only the identifier of the title you are viewing, taken
from the page address. It contains no personal data, cookies or history.

| Site you are on | Service asked | What is sent |
|---|---|---|
| Trakt, TMDB, Serializd | Trakt API (api.trakt.tv) | the Trakt slug or TMDB id of the title |
| TVmaze | TVmaze API (api.tvmaze.com) | the TVmaze show, season or episode id |
| AniList | AniList API (graphql.anilist.co) | the AniList id |
| Kitsu | Kitsu API (kitsu.app) | the Kitsu slug |
| Wikipedia | Wikidata API (www.wikidata.org) | the article's Wikidata item id |
| TheTVDB, MDBList, Simkl | the same site | the show page of the season or episode you are viewing |

On TMDB, TVmaze and AniList list pages, these lookups happen only when you
click a DMM button, never for the whole page. Each service handles requests
under its own privacy policy.

## Permissions

- **Host permission (`<all_urls>`)**: Required to detect magnet and torrent
  links on any website. On supported sites, it reads the page to find title ids.

## Contact

For questions, open an issue at https://github.com/debridmediamanager/browser-extension/issues
