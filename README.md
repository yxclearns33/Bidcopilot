# BidCopilot — Bid Risk & Compliance Engine

> A system that tells contractors whether they will be disqualified from a tender, why, and how to fix it before submitting.

## Quick start

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Project structure

```
src/
├── App.jsx                  # Root shell, routing state
├── App.css                  # Global design system (Clean Indigo)
├── main.jsx                 # Entry point
│
├── components/
│   ├── Sidebar.jsx          # Navigation
│   └── Topbar.jsx           # Top bar
│
├── data/
│   └── mockData.js          # All mock tenders, gaps, requirements
│
└── pages/
    ├── Dashboard.jsx         # Overview + compliance alert
    ├── ComplianceEngine.jsx  # ⚡ Hero screen — disqualification risks
    ├── UploadTender.jsx      # File upload + analysis trigger
    ├── Analysis.jsx          # Tender breakdown + score
    ├── BidPackGenerator.jsx  # 9-section AI bid writer
    ├── BidImprovement.jsx    # Score history + win probability
    ├── Opportunities.jsx     # Tender feed with match scores
    └── CompanyProfile.jsx    # Company info + document vault
```

## Design system

- **Sidebar:** `#1E1B4B` dark navy (Clean Indigo)
- **Accent:** `#4F46E5` indigo
- **Font:** Inter (loaded from Google Fonts)
- **Cards:** white with `1px #E8E8EE` border, `12px` radius

## Next steps

- [ ] Connect Supabase for real auth and data persistence
- [ ] Wire up Anthropic API for real compliance analysis
- [ ] Add real tender document parsing (PDF/DOCX extraction)
- [ ] Deploy to Vercel
