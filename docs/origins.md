# Origins — from the PRASM Network whitepaper to Mae Hong Son

> **What this is.** The founder's statement of where PRASM comes from and why the
> refugee work is the same idea, not a new one. It ties the 2018 whitepaper to
> the identity and records phases in [`concept.md`](concept.md). Living
> document — if a line overclaims, fix it.

**Status:** Draft v0.1 · October 2026 · Owner: founder

## The direction, in one line

**PRASM uses bioinformation, and that is still the core.** In Mae Hong Son we
apply it so that people with no ID can reach a hospital and medical care, and
so that the medical records this creates can work as their identity.

> 프라즘 프로젝트는 기본적으로 생체정보를 활용하는 것이고, 그건 지금도
> 유효하다. 이것을 매홍손의 난민들에게 적용하는 것은, 신분증이 없는 사람들이
> 병원에 가고 의료서비스를 이용할 수 있게 하고, 그로 인해 발생하는
> 의료기록이 신분증 역할을 할 수 있게 하는 것이다. — founder

## Where it began: the 2018 whitepaper

In 2018 the founder's PRASM project published _PRASM Network: an AI-based
decentralized bioinformatic network_ (English edition 13 May 2018; Korean edition 9 July
2018). The ideas that carry forward:

- **Bioinformation belongs to the person it describes.** The owner controls
  what is shared, how far, and with whom. Ownership comes before any use.
- **Bioinformation identifies its owner.** The whitepaper says it plainly:
  bioinformation "defines its ownership in itself" and "can be used to identify
  the owner." That sentence is the bridge to everything below.
- **Records carry their provenance.** Raw data is stored together with the
  channel and method that produced it, so its reliability can be judged.
- **Accounts have roles.** Everyone is a participant; care providers get extra
  roles. (Here: patient, doctor, village steward, partner clinic.)
- **AI protocols learn from outcomes.** AI suggests; what people actually do is
  measured; the protocol improves. Here, always under a human clinician
  (→ concept.md, _Red lines_).
- **A network of nodes.** Participants and providers each contribute and
  benefit — a virtuous circle.

## Why it fits the village

For someone with no papers, the medical record is often the _first_ trustworthy
document about them. It is created by a professional, it is dated, it describes
a body that cannot be faked, and it grows over time. That is already how PRASM
started: one record, written for one sick boy, became his first proof of
existence (→ [`content/about.ts`](../content/about.ts)).

So the logic runs in a loop:

```
no ID ──► PRASM gets the person to care ──► care creates a medical record
  ▲                                                     │
  └──── the record helps them reach care next time ◄────┘
               (and, in time, recognized identity)
```

Health access is the entry point; identity is what the records add up to.

## What we keep, and what we leave behind

| From the 2018 whitepaper            | In PRASM today                                                                                           |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Ownership of bioinformation         | **Kept, and made stronger.** Explicit, revocable consent; the person can see and take their record.      |
| Bioinformation identifies its owner | **Kept, carefully.** The medical record as identity; any biometric step only with a safe design (below). |
| Provenance of data                  | **Kept.** Who recorded it, when, where, how — this is what makes a record credible as identity.          |
| Roles and nodes                     | **Kept.** Doctor, steward, partner hospitals.                                                            |
| AI protocols                        | **Kept, bounded.** AI organizes and drafts; it never makes a clinical or identity decision.              |
| Token rewards / token sale          | **Left behind.** No tokens, no payment for data, no investment language on a charity site.               |
| Wellness marketplace                | **Left behind.** Not this community's need.                                                              |

Paying vulnerable people for their health data creates pressure, not consent.
The ownership idea survives; the market around it does not.

## Safety first: biometrics and undocumented people

Biometric and medical data about undocumented refugees is the most dangerous
data we could hold. If it leaks or is handed over, it can be used to find,
detain, or return people. Humanitarian biometric programs have been criticized
for exactly this, for example over Rohingya refugee data shared with the
government they fled. So:

- **Consent is a precondition, not a form.** Explained in the person's own
  language, revocable, and never a condition for receiving care.
- **Care never waits on identity.** Nobody is refused treatment for declining
  to be recorded.
- **Minimum data.** No fingerprints, face templates, or genetic data unless a
  specific, reviewed need justifies it.
- **The person holds their own copy.** Portable proof they control, so the
  record is useful even if PRASM disappears.
- **No sharing with authorities without the person's informed decision.** Any
  recognition pathway is worked out with legal and protection partners first.
- **Tier-2 rules apply in full** (→ concept.md, _Data and privacy model_).

## What this changes in the plan

- §3.4 in [`concept.md`](concept.md) is now framed as **Medical Record →
  Identity**: the registry grows out of clinical records, not as a separate
  database.
- Still Stage C. The safety design above is the precondition, as before.

## Where things stand (October 2026)

- **Name.** The community is **Kayan**: one of the Karenni peoples of Kayah
  State. Karenni and Karen are related but distinct groups, so the site says
  Kayan throughout.
- **Records today.** PRASM is collecting the records that Mae Hong Son
  hospitals produce when we bring people to care. Their value is in volume and
  continuity: the more records a person has, and the longer they run, the more
  they mean.
- **Biometrics.** Part of the plan, not yet decided.

## Tentative direction: a biometric-linked wallet as personal ID

The founder's current thinking: **a person's bioinformation acts as their
personal identification number, linked to a crypto wallet address.** The
technology and the many variables will become clear as we go. This is a
direction, not a design. Notes to carry into that work:

- **Biometrics should unlock a key, not be the key.** Fingerprints and faces
  never read exactly the same twice, cannot be changed if leaked, and can be
  taken by force. Safer pattern: generate the wallet key randomly, and use the
  biometric only to match the person to it (on a device, or against an
  encrypted template), with a human recovery route if it fails.
- **Nothing personal on a public chain.** A public blockchain is permanent and
  readable by anyone, and PDPA gives people the right to erase their data. At
  most, put hashes or signed attestations on chain ("a licensed clinic recorded
  a visit on this date"). Records themselves stay off chain, encrypted.
- **One address is one long trail.** Every use of a single public address links
  together. Consider separate keys per purpose, or a decentralized identifier
  (DID) and verifiable credentials, where the person shows only what is needed.
- **The person must be able to hold it without a smartphone.** A printed card
  with a QR code, held by the person, backed up by PRASM, works off-grid.
- **Precedents to learn from.** Iris-scan identity projects tied to crypto
  wallets have been suspended or investigated by regulators in several
  countries; humanitarian biometric programs have shared refugee data with the
  governments people fled. Both are lessons in what not to repeat.

### What to do now so records count later

Records only add up if they are collected consistently from day one:

1. **Consent for each record we keep**, recorded with the record.
2. **Provenance on every record:** which hospital, which doctor, date, document
   type, how we got the copy.
3. **One stable internal ID per person**, so records from different visits link
   to the same person. It can later be bound to a wallet or biometric without
   re-collecting anything.
4. **Encrypted storage with an access log** (Tier 2), never in shared chat
   apps.

## Open questions for the founder

- **Partner hospitals:** which hospitals' records are we collecting today, and
  would they confirm a record is genuine if asked?
- **Recognition path:** which bodies (Thai civil registration, UNHCR, NGOs)
  should the record eventually help a person reach, and with which partners?
- **Current format:** are records kept as paper, photos, or scans, and where?
