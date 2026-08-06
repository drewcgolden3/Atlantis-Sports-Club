# Atlantis QR Codes

Twelve trackable codes. Each points at the right page and carries a `?src=` tag
so the Switchboard OS dashboard can tell **which** flyer, sign, or ad produced
the lead — the tag is stored for the whole visit, so it still shows up even when
the person fills in a form two pages later.

Every lead's **Source** column reads e.g. `Website — Founders Form (QR: fitness-flyer)`.

| Label | Scan tag | Goes to |
|---|---|---|
| Fitness Flyer QR | `fitness-flyer` | Membership Options |
| Pool Membership QR | `pool-membership` | Membership Options |
| Founders Promotion QR | `founders-promo` | Membership Options → Founders form |
| Membership Flyer QR | `membership-flyer` | Scan-to-join landing page |
| Community Outreach QR | `community-outreach` | Atlantis in the Community |
| Business Partnership QR | `business-partnership` | Atlantis in the Community |
| Join the Team QR | `join-the-team` | Join the Atlantis Team |
| Swim Lessons QR | `swim-lessons` | Aquatics → Swim Lessons |
| Birthday Parties QR | `birthday-parties` | Birthday Parties |
| Radio Show QR | `radio-show` | Scan-to-join landing page |
| Social Media QR | `social-media` | Scan-to-join landing page |
| In-Club Sign QR | `in-club-sign` | Scan-to-join landing page |

`qr-codes.csv` has the full destination URLs.

## Which file to use

- **`.svg`** for anything printed — flyers, signs, banners. Vector, so it stays
  sharp at any size.
- **`.png`** for screens and social posts.

## Printing

- Print at **1 inch minimum**, 1.5–2 inches for a sign people scan from a step or
  two back. Codes are generated at high error correction, so they still scan with
  a small logo in the middle or a scuff across a corner.
- Keep the white border. It is part of the code — cropping it tight is the single
  most common reason a printed QR won't scan.
- Don't recolour to anything lighter than the navy supplied; contrast against the
  background is what the scanner keys on.

## Adding a new code

Any `?src=` value works without a code change — the site reads whatever it's
given. To mint another code, re-run the generator in `git log` for this folder,
or just append `?src=your-new-tag` to any page URL and make a QR of it.
