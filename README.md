# Medelite Facility Assessment Report Generator

## 🏥 Project Overview

This is a web application built for Medelite that allows Directors and staff to instantly
generate professional facility assessment reports for any skilled nursing home in the USA.

Instead of manually searching through multiple government databases and copying data into
spreadsheets, a user simply types a facility's CCN (CMS Certification Number) and the app
automatically fetches all public data, combines it with internal operational inputs, and
produces a polished downloadable report in seconds.

**Key Highlights:**

- 🔍 Instant lookup for any of 15,000+ US nursing homes using CMS public data
- 📊 Visual star rating cards with color-coded performance indicators
- 📄 One-click PDF export with clickable Medicare hyperlink
- 📝 Word Document (.docx) export with logo and clickable links
- 📈 All 12 hospitalization/ED metrics with state and national averages
- ✅⚠️ Performance indicators comparing facility vs national benchmarks
- 📱 Fully mobile responsive

**Built with:** React + Vite, jsPDF, html2canvas, docx, file-saver, deployed on Vercel

---

## 🔗 Live Application

**Live URL:** https://medelite-report-generator.vercel.app

**GitHub Repository:** https://github.com/kanchankataria/medelite-report-generator

> ⚠️ The live URL is publicly accessible without any login or authentication required.
> Simply click the link to open the app directly.

---

## 🧪 Test Case (Official Spec Verification)

To verify the application works correctly, use the following test case from the project spec:

| Field             | Value                                                             |
| ----------------- | ----------------------------------------------------------------- |
| CCN               | 686123                                                            |
| Expected Facility | Kendall Lakes Healthcare and Rehab Center                         |
| Location          | Miami, FL                                                         |
| Medicare Profile  | https://www.medicare.gov/care-compare/details/nursing-home/686123 |

The app dynamically replaces the CCN in the Medicare URL — so if you search CCN `055289`,
the Medicare link automatically becomes:
https://www.medicare.gov/care-compare/details/nursing-home/055289

This works for any valid US nursing home CCN — not just the test case.

---

## ✅ Features Implemented

### Core MVP Features (Required)

#### 1. Dynamic CCN Lookup

- User enters any valid 6-digit CCN number
- App instantly queries the CMS Provider Data Catalog API
- Returns facility name, location, bed count, star ratings and more
- Works for any of the 15,000+ nursing homes registered with Medicare in the USA

#### 2. CMS API Data Engine

- Fetches real-time data from the official CMS Provider Data Catalog
- Uses the Provider Information dataset (ID: 4pq5-n9py)
- Data includes: facility name, address, certified beds, star ratings, staffing info
- All data is live and updated monthly by CMS

#### 3. Facility Name Override

- By default the app shows the official legal name from CMS
- An optional override field lets the user type a custom/internal name
- The override name replaces the CMS name only in the report output
- The INFINITE branding header is never affected by this override

#### 4. Manual Operational Inputs

The following fields are filled in manually by the user since they are
not available in any public database:

- EMR System (e.g. PCC, MatrixCare)
- Current Census (number of current residents)
- Type of Patient (e.g. Long-term & Short-term)
- Previous Coverage from Medelite (Yes/No dropdown)
- Previous Provider Performance from Medelite
- Medical Coverage (e.g. Optometry, PCP, Podiatry)

#### 5. One-Click PDF Download

- Single "Download PDF" button generates and downloads the report instantly
- Uses html2canvas to capture the HTML report as a high-resolution image
- Uses jsPDF to convert the image into a properly sized PDF document
- Custom page size ensures the entire report is never cut off
- PDF filename includes the CCN (e.g. Facility_Assessment_686123.pdf)

#### 6. Word Document Export (.docx)

- Additional "Download Word Doc" button generates an editable Word document
- Uses the docx library to create a properly formatted .docx file
- Includes the INFINITE logo image at the top of the document
- All facility data and hospitalization metrics included in a clean table
- Medicare Profile row includes a clickable hyperlink to Medicare.gov
- File downloads with CCN in filename (e.g. Facility_Assessment_686123.docx)

#### 7. Medicare Source Hyperlink

- Every generated PDF includes a clickable "View on Medicare.gov" link
- The URL is dynamically generated using the searched CCN
- Example: https://www.medicare.gov/care-compare/details/nursing-home/686123
- When a different CCN is searched (e.g. 055289), the link automatically
  updates to: https://www.medicare.gov/care-compare/details/nursing-home/055289
- This ensures every report links back to the correct official CMS source

#### 8. Deployment

- Application is deployed on Vercel with automatic deployments from GitHub
- Every git push to main triggers a new Vercel deployment
- Vercel rewrite rules handle the CMS API proxy in production

---

### Bonus Features (Optional - All Implemented)

#### 9. All 12 Hospitalization/ED Metrics from CMS Claims API

The app fetches and displays all 12 hospitalization and emergency department
metrics directly from the CMS Medicare Claims Quality Measures dataset (ID: ijh5-nb2v):

**Short-Stay (STR) Metrics:**

- Short Term Hospitalization (measure code 521)
- STR National Average for Hospitalization
- STR State Average for Hospitalization
- STR ED Visit (measure code 522)
- STR ED Visits National Average
- STR ED Visits State Average

**Long-Stay (LT) Metrics:**

- LT Hospitalization (measure code 551)
- LT National Average for Hospitalization
- LT State Average for Hospitalization
- ED Visit (measure code 552)
- LT ED Visits National Average
- LT ED Visits State Average

State and national averages are fetched from the CMS State & US Averages
dataset (ID: xcdc-v8bm) and automatically update based on the facility's state.

#### 10. Color-Coded Star Ratings

- Overall Star Rating, Health Inspection, Staffing, and Quality of Resident Care
  are displayed with color coding:
  - 🟢 Green = 4-5 stars (good performance)
  - 🟡 Yellow = 3 stars (average performance)
  - 🔴 Red = 1-2 stars (poor performance)
- Overall star rating also shows star emoji icons (⭐⭐⭐⭐⭐)

#### 11. Performance Indicators

- Each facility hospitalization metric is compared to the national average
- Visual emoji indicators show performance at a glance:
  - ✅ = Facility performing BETTER than national average (lower is better)
  - ⚠️ = Facility performing WORSE than national average
  - ➡️ = Same as national average

#### 12. Advanced Error Handling

- If an invalid CCN is entered, a friendly error message appears
- Error box includes a helpful tip with a clickable link to medicare.gov/care-compare
  so users can find the correct CCN easily
- Network errors are caught and displayed cleanly

#### 13. Mobile Responsive

The application is fully responsive and works on:

- Desktop browsers
- Mobile phones
- Tablets

The layout automatically adjusts for smaller screens — the form stacks vertically,
buttons become full width, and the report table scrolls horizontally on small devices.

## 14.📎 Sample Output Files

View sample generated reports in the `/samples` folder:

- [Sample PDF Report](./samples/Facility_Assessment_686123.pdf)
- [Sample Word Doc Report](./samples/Facility_Assessment_686123.docx)
- [Sample PDF Report](./samples/Facility_Assessment_055289.pdf)
- [Sample Word Doc Report](./samples/Facility_Assessment_055289.docx)

---

## 🗂️ Data Sources

| Dataset                          | CMS ID    | Used For                                    |
| -------------------------------- | --------- | ------------------------------------------- |
| Provider Information             | 4pq5-n9py | Facility name, location, beds, star ratings |
| Medicare Claims Quality Measures | ijh5-nb2v | Hospitalization & ED metrics                |
| State & US Averages              | xcdc-v8bm | National and state benchmark averages       |

---

## 🏗️ Tech Stack

| Technology                    | Purpose                           |
| ----------------------------- | --------------------------------- |
| React 18                      | Frontend UI framework             |
| Vite                          | Build tool and dev server         |
| jsPDF                         | PDF generation                    |
| html2canvas                   | HTML to image conversion for PDF  |
| docx                          | Word document generation          |
| file-saver                    | Trigger file downloads in browser |
| Vercel                        | Hosting and deployment            |
| CMS Provider Data Catalog API | Public nursing home data          |

---

## 🚀 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/kanchankataria/medelite-report-generator.git

# Navigate to project folder
cd medelite-report-generator

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:5173
```

---

## 📋 How to Use the App

1. **Enter a CCN** — Type any valid 6-digit nursing home CCN in the input box
2. **Click "Fetch Facility Data"** — Wait 3-6 seconds for CMS API to respond
3. **Fill in Internal Details** — Enter EMR, census, patient type, and Medelite history
4. **Click "Download PDF"** — PDF report downloads instantly to your computer
5. **Click "Download Word Doc"** — Editable .docx report downloads instantly
6. **View on Medicare.gov** — Click the link in PDF or Word Doc to see official CMS profile

---

## ⚙️ Engineering Challenges & Solutions

### Challenge 1: CORS Restrictions

**Problem:** The CMS API does not allow direct browser requests. When the app
tried to fetch data directly from data.cms.gov, the browser blocked it with:
"Access to fetch has been blocked by CORS policy"

**What I tried first:** Calling the CMS API directly from React — blocked by browser.

**Solution:** Set up a proxy in two places:

- **Local:** Vite dev server proxy routes /cms-api/\* to data.cms.gov
- **Production:** vercel.json rewrite rules route /cms-api/\* to data.cms.gov

---

### Challenge 2: CMS API Filter Not Working

**Problem:** The CCN filter was being ignored — no matter what CCN was entered,
the app always returned the first facility in the database (Burns Nursing Home, AL).

**What I tried first:** Using filters[] parameter with the field name — didn't work.

**Solution:** Switched to the conditions[] parameter format which works reliably:
conditions[0][property]=cms_certification_number_ccn
conditions[0][value]=686123
conditions[0][operator]==

---

### Challenge 3: Test Facility Has No Claims Data

**Problem:** The official test case (Kendall Lakes, CCN 686123) has no data in
the CMS Claims Quality Measures dataset because the facility had insufficient
Medicare claims volume during the reporting period (footnote code 9).

**Solution:** App displays "N/A" for facility-specific metrics while still showing
national and state averages — exactly matching what Medicare.gov shows for this facility.

---

### Challenge 4: PDF Content Getting Cut Off

**Problem:** The generated PDF was cutting off halfway through the report because
jsPDF defaulted to standard A4 page size which was too short for the full content.

**Solution:** Used a custom page size calculated from actual report height:
const pdfHeight = (canvas.height \* pdfWidth) / canvas.width;
const pdf = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);

---

### Challenge 5: Word Document Export with Logo

**Problem:** Generating a Word document from React requires converting the
logo image to an ArrayBuffer format that the docx library can embed, and
creating clickable hyperlinks inside table cells.

**Solution:**

- Used the docx library with ImageRun to embed the logo
- Fetched the logo via fetch() and converted to ArrayBuffer
- Used ExternalHyperlink inside TableCell for the Medicare Profile link
- Result: A fully formatted .docx file with logo, table, and clickable link

---

### Challenge 6: State Averages Showing Same Value for All Facilities

**Problem:** State averages were not updating when different CCNs were searched —
every facility showed the same state average regardless of its actual state.

**Solution:** Fixed the filter to use state_or_nation field with the conditions[]
parameter. Now when a Florida facility is searched, FL averages load automatically.
When a California facility is searched, CA averages load automatically.
