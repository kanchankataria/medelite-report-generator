// import { useState, useRef } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import "./App.css";

// function App() {
//   const [ccn, setCcn] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [facilityData, setFacilityData] = useState(null);
//   const [manualInputs, setManualInputs] = useState({
//     facilityNameOverride: "",
//     emr: "",
//     currentCensus: "",
//     patientType: "",
//     previousCoverage: "No",
//     previousPerformance: "",
//     medicalCoverage: "",
//   });
//   const reportRef = useRef();

//   const fetchFacilityData = async () => {
//     if (!ccn.trim()) {
//       setError("Please enter a CCN number.");
//       return;
//     }
//     setLoading(true);
//     setError("");
//     setFacilityData(null);

//     try {
//       const encodedCCN = encodeURIComponent(ccn.trim());
//       // const res = await fetch(
//       //   `https://data.cms.gov/provider-data/api/1/datastore/query/4pq5-n9py/0?filters%5BCMS%20Certification%20Number%20%28CCN%29%5D=${encodedCCN}&limit=1`,
//       // );
//       const res = await fetch(
//         `/cms-api/datastore/query/4pq5-n9py/0?filters%5BCMS%20Certification%20Number%20%28CCN%29%5D=${ccn.trim()}&limit=1`,
//       );
//       const data = await res.json();

//       if (!data.results || data.results.length === 0) {
//         setError("No facility found for this CCN. Please check and try again.");
//         setLoading(false);
//         return;
//       }

//       const f = data.results[0];
//       setFacilityData(f);
//       setManualInputs((prev) => ({
//         ...prev,
//         facilityNameOverride: "",
//       }));
//     } catch (err) {
//       setError("Failed to fetch data. Please check your internet connection.");
//     }

//     setLoading(false);
//   };

//   const handleManualChange = (e) => {
//     setManualInputs({ ...manualInputs, [e.target.name]: e.target.value });
//   };

//   const downloadPDF = async () => {
//     const element = reportRef.current;
//     const canvas = await html2canvas(element, { scale: 2 });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     const medicareUrl =
//       "https://www.medicare.gov/care-compare/details/nursing-home/" + ccn;
//     pdf.link(40, pdfHeight - 14, 120, 10, { url: medicareUrl });
//     pdf.save(`Facility_Assessment_${ccn}.pdf`);
//   };

//   const facilityName =
//     manualInputs.facilityNameOverride ||
//     (facilityData ? facilityData["provider_name"] : "");

//   const state = facilityData ? facilityData["state"] : "";

//   return (
//     <div className="app-container">
//       <h1 className="app-title">
//         Medelite Facility Assessment Report Generator
//       </h1>

//       <div className="input-section">
//         <h2>Step 1: Enter Facility CCN</h2>
//         <div className="ccn-row">
//           <input
//             type="text"
//             placeholder="Enter CCN (e.g. 686123)"
//             value={ccn}
//             onChange={(e) => setCcn(e.target.value)}
//             className="ccn-input"
//           />
//           <button
//             onClick={fetchFacilityData}
//             className="fetch-btn"
//             disabled={loading}
//           >
//             {loading ? "Fetching..." : "Fetch Facility Data"}
//           </button>
//         </div>
//         {error && <p className="error">{error}</p>}
//       </div>

//       {facilityData && (
//         <div className="input-section">
//           <h2>Step 2: Fill in Internal Details</h2>
//           <div className="form-grid">
//             <label>Facility Name Override (optional)</label>
//             <input
//               name="facilityNameOverride"
//               value={manualInputs.facilityNameOverride}
//               onChange={handleManualChange}
//               placeholder={facilityData["provider_name"]}
//             />
//             <label>EMR System</label>
//             <input
//               name="emr"
//               value={manualInputs.emr}
//               onChange={handleManualChange}
//               placeholder="e.g. PCC, MatrixCare"
//             />
//             <label>Current Census</label>
//             <input
//               name="currentCensus"
//               value={manualInputs.currentCensus}
//               onChange={handleManualChange}
//               placeholder="e.g. 112"
//               type="number"
//             />
//             <label>Type of Patient</label>
//             <input
//               name="patientType"
//               value={manualInputs.patientType}
//               onChange={handleManualChange}
//               placeholder="e.g. Long-term & Short-term"
//             />
//             <label>Previous Coverage from Medelite</label>
//             <select
//               name="previousCoverage"
//               value={manualInputs.previousCoverage}
//               onChange={handleManualChange}
//             >
//               <option>Yes</option>
//               <option>No</option>
//             </select>
//             <label>Previous Provider Performance</label>
//             <input
//               name="previousPerformance"
//               value={manualInputs.previousPerformance}
//               onChange={handleManualChange}
//               placeholder="e.g. About 30 patients/day"
//             />
//             <label>Medical Coverage</label>
//             <input
//               name="medicalCoverage"
//               value={manualInputs.medicalCoverage}
//               onChange={handleManualChange}
//               placeholder="e.g. Optometry, PCP, Podiatry"
//             />
//           </div>
//           <button onClick={downloadPDF} className="pdf-btn">
//             ⬇ Download PDF
//           </button>
//         </div>
//       )}

//       {facilityData && (
//         <div ref={reportRef} className="report">
//           <div className="report-header">
//             <h1>INFINITE</h1>
//             <p>Managed by MEDELITE</p>
//             <h2>FACILITY ASSESSMENT SNAPSHOT</h2>
//             <h3>{state}</h3>
//           </div>
//           <table className="report-table">
//             <tbody>
//               <tr>
//                 <td>
//                   <strong>Name of Facility</strong>
//                 </td>
//                 <td>{facilityName}</td>
//               </tr>
//               <tr>
//                 <td>
//                   <strong>Location</strong>
//                 </td>
//                 <td>{facilityData["location"]}</td>
//               </tr>
//               <tr>
//                 <td>
//                   <strong>EMR</strong>
//                 </td>
//                 <td>{manualInputs.emr}</td>
//               </tr>
//               <tr>
//                 <td>
//                   <strong>Census Capacity</strong>
//                 </td>
//                 <td>{facilityData["number_of_certified_beds"]}</td>
//               </tr>
//               <tr>
//                 <td>
//                   <strong>Current Census</strong>
//                 </td>
//                 <td>{manualInputs.currentCensus}</td>
//               </tr>
//               <tr>
//                 <td>
//                   <strong>Type of Patient</strong>
//                 </td>
//                 <td>{manualInputs.patientType}</td>
//               </tr>
//               <tr>
//                 <td>
//                   <strong>Previous Coverage from Medelite</strong>
//                 </td>
//                 <td>{manualInputs.previousCoverage}</td>
//               </tr>
//               <tr>
//                 <td>
//                   <strong>Previous Provider Performance from Medelite</strong>
//                 </td>
//                 <td>{manualInputs.previousPerformance}</td>
//               </tr>
//               <tr>
//                 <td>
//                   <strong>Medical Coverage</strong>
//                 </td>
//                 <td>{manualInputs.medicalCoverage}</td>
//               </tr>
//               <tr>
//                 <td>
//                   <strong>Overall Star Rating</strong>
//                 </td>
//                 <td>{facilityData["overall_rating"]}</td>
//               </tr>
//               <tr>
//                 <td>
//                   <strong>Health Inspection</strong>
//                 </td>
//                 <td>{facilityData["health_inspection_rating"]}</td>
//               </tr>
//               <tr>
//                 <td>
//                   <strong>Staffing</strong>
//                 </td>
//                 <td>{facilityData["staffing_rating"]}</td>
//               </tr>
//               <tr>
//                 <td>
//                   <strong>Quality of Resident Care</strong>
//                 </td>
//                 <td>{facilityData["qm_rating"]}</td>
//               </tr>
//               <tr>
//                 <td>
//                   <strong>Medicare Profile</strong>
//                 </td>
//                 <td>
//                   <a
//                     href={
//                       "https://www.medicare.gov/care-compare/details/nursing-home/" +
//                       ccn
//                     }
//                     target="_blank"
//                     rel="noreferrer"
//                   >
//                     View on Medicare.gov
//                   </a>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

// ============================================================
// Medelite Facility Assessment Report Generator
// Built by: FNU Kanchan
// Description: A React app that lets users enter a nursing
// home CCN to fetch public CMS data, fill in internal details,
// and download a polished PDF report.
// ============================================================

import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  WidthType,
  AlignmentType,
  ImageRun,
  ExternalHyperlink,
} from "docx";
import { saveAs } from "file-saver";
import "./App.css";

function App() {
  // ---- STATE VARIABLES ----
  // These store data that changes when the user interacts with the app
  const [ccn, setCcn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [facilityData, setFacilityData] = useState(null);
  const [claimsData, setClaimsData] = useState({});
  const [nationAvg, setNationAvg] = useState(null);
  const [stateAvg, setStateAvg] = useState(null);

  // Manual inputs filled in by the user (not available in CMS API)
  const [manualInputs, setManualInputs] = useState({
    facilityNameOverride: "",
    emr: "",
    currentCensus: "",
    patientType: "",
    previousCoverage: "No",
    previousPerformance: "",
    medicalCoverage: "",
  });

  // reportRef points to the HTML report section so we can convert it to PDF
  const reportRef = useRef();

  // ============================================================
  // FUNCTION: fetchFacilityData
  // Triggered when user clicks "Fetch Facility Data"
  // Makes 4 API calls to CMS to get all needed data
  // ============================================================
  const fetchFacilityData = async () => {
    // Validate that CCN is not empty
    if (!ccn.trim()) {
      setError("Please enter a CCN number.");
      return;
    }

    // Reset all previous data before new fetch
    setLoading(true);
    setError("");
    setFacilityData(null);
    setClaimsData({});
    setNationAvg(null);
    setStateAvg(null);

    try {
      // 1. Main facility info
      // ---- API CALL 1: Main Facility Info ----
      // Dataset: 4pq5-n9py (NH Provider Information)
      // Returns: facility name, location, beds, star ratings, etc.
      const res = await fetch(
        `/cms-api/datastore/query/4pq5-n9py/0?conditions[0][property]=cms_certification_number_ccn&conditions[0][value]=${ccn.trim()}&conditions[0][operator]==&limit=1`,
      );
      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        setError("No facility found for this CCN. Please check and try again.");
        setLoading(false);
        return;
      }

      const f = data.results[0];
      setFacilityData(f);

      setManualInputs((prev) => ({ ...prev, facilityNameOverride: "" }));

      const facilityState = f["state"];

      // 2. Claims-based quality measures for this facility
      // ---- API CALL 2: Claims-Based Quality Measures ----
      // Dataset: ijh5-nb2v (Medicare Claims Quality Measures)
      // Returns: hospitalization and ED visit metrics for this facility
      // Measure codes: 521=STR Hosp, 522=STR ED, 551=LT Hosp, 552=LT ED
      const claimsRes = await fetch(
        `/cms-api/datastore/query/ijh5-nb2v/0?conditions[0][property]=cms_certification_number_ccn&conditions[0][value]=${ccn.trim()}&conditions[0][operator]==&limit=10`,
      );
      const claimsJson = await claimsRes.json();
      const measures = {};
      if (claimsJson.results) {
        claimsJson.results.forEach((row) => {
          measures[row["measure_code"]] = row;
        });
      }
      setClaimsData(measures);

      // 3. National averages

      // ---- API CALL 3: National Averages ----
      // Dataset: xcdc-v8bm (State & US Averages)
      // Filter: state_or_nation = "NATION" to get US-wide averages
      const nationRes = await fetch(
        `/cms-api/datastore/query/xcdc-v8bm/0?conditions[0][property]=state_or_nation&conditions[0][value]=NATION&conditions[0][operator]==&limit=1`,
      );
      const nationJson = await nationRes.json();
      if (nationJson.results && nationJson.results.length > 0) {
        setNationAvg(nationJson.results[0]);
      }

      // 4. State averages

      // ---- API CALL 4: State Averages ----
      // Dataset: xcdc-v8bm (State & US Averages)
      // Filter: state_or_nation = facility's state (e.g. "FL")
      const stateRes = await fetch(
        `/cms-api/datastore/query/xcdc-v8bm/0?conditions[0][property]=state_or_nation&conditions[0][value]=${facilityState}&conditions[0][operator]==&limit=1`,
      );
      const stateJson = await stateRes.json();
      if (stateJson.results && stateJson.results.length > 0) {
        setStateAvg(stateJson.results[0]);
      }
    } catch (err) {
      setError("Failed to fetch data. Please check your internet connection.");
    }

    setLoading(false);
  };

  const handleManualChange = (e) => {
    setManualInputs({ ...manualInputs, [e.target.name]: e.target.value });
  };

  // ============================================================
  // FUNCTION: downloadPDF
  // Converts the report HTML section to a canvas image,
  // then generates a PDF file and triggers browser download
  // ============================================================
  const downloadPDF = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pdf = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    const medicareUrl =
      "https://www.medicare.gov/care-compare/details/nursing-home/" + ccn;
    pdf.link(40, pdfHeight - 14, 120, 10, { url: medicareUrl });
    pdf.save(`Facility_Assessment_${ccn}.pdf`);
  };

  const downloadWord = async () => {
    // Fetch logo image and convert to base64 for Word doc
    const logoResponse = await fetch("/Picture1.png");
    const logoBlob = await logoResponse.blob();
    const logoArrayBuffer = await logoBlob.arrayBuffer();

    const rows = [
      ["Name of Facility", facilityName],
      ["Location", facilityData["location"] || ""],
      ["EMR", manualInputs.emr],
      ["Census Capacity", facilityData["number_of_certified_beds"] || ""],
      ["Current Census", manualInputs.currentCensus],
      ["Type of Patient", manualInputs.patientType],
      ["Previous Coverage from Medelite", manualInputs.previousCoverage],
      [
        "Previous Provider Performance from Medelite",
        manualInputs.previousPerformance,
      ],
      ["Medical Coverage", manualInputs.medicalCoverage],
      ["Overall Star Rating", facilityData["overall_rating"] || ""],
      ["Health Inspection", facilityData["health_inspection_rating"] || ""],
      ["Staffing", facilityData["staffing_rating"] || ""],
      ["Quality of Resident Care", facilityData["qm_rating"] || ""],
      [
        "Short Term Hospitalization",
        m521 ? fmt(m521["adjusted_score"]) : "N/A",
      ],
      [
        "STR National Avg. for Hospitalization",
        nationAvg
          ? fmt(
              nationAvg[
                "percentage_of_short_stay_residents_who_were_rehospitalized__1d02"
              ],
            )
          : "N/A",
      ],
      [
        "STR State Avg. for Hospitalization",
        stateAvg
          ? fmt(
              stateAvg[
                "percentage_of_short_stay_residents_who_were_rehospitalized__1d02"
              ],
            )
          : "N/A",
      ],
      ["STR ED Visit", m522 ? fmt(m522["adjusted_score"]) : "N/A"],
      [
        "STR ED Visits National Avg.",
        nationAvg
          ? fmt(
              nationAvg[
                "percentage_of_short_stay_residents_who_had_an_outpatient_em_d911"
              ],
            )
          : "N/A",
      ],
      [
        "STR ED Visits State Avg.",
        stateAvg
          ? fmt(
              stateAvg[
                "percentage_of_short_stay_residents_who_had_an_outpatient_em_d911"
              ],
            )
          : "N/A",
      ],
      ["LT Hospitalization", m551 ? fmtRate(m551["adjusted_score"]) : "N/A"],
      [
        "LT National Avg. for Hospitalization",
        nationAvg
          ? fmtRate(
              nationAvg[
                "number_of_hospitalizations_per_1000_longstay_resident_days"
              ],
            )
          : "N/A",
      ],
      [
        "LT State Avg. for Hospitalization",
        stateAvg
          ? fmtRate(
              stateAvg[
                "number_of_hospitalizations_per_1000_longstay_resident_days"
              ],
            )
          : "N/A",
      ],
      ["ED Visit", m552 ? fmtRate(m552["adjusted_score"]) : "N/A"],
      [
        "LT ED Visits National Avg.",
        nationAvg
          ? fmtRate(
              nationAvg[
                "number_of_outpatient_emergency_department_visits_per_1000_l_de9d"
              ],
            )
          : "N/A",
      ],
      [
        "LT ED Visits State Avg.",
        stateAvg
          ? fmtRate(
              stateAvg[
                "number_of_outpatient_emergency_department_visits_per_1000_l_de9d"
              ],
            )
          : "N/A",
      ],
    ];

    const tableRows = rows.map(
      ([label, value]) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: label, bold: true })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: String(value) })],
                }),
              ],
            }),
          ],
        }),
    );

    // Medicare Profile row with clickable hyperlink
    const medicareUrl = `https://www.medicare.gov/care-compare/details/nursing-home/${ccn}`;
    const medicareRow = new TableRow({
      children: [
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Medicare Profile", bold: true })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [
                new ExternalHyperlink({
                  link: medicareUrl,
                  children: [
                    new TextRun({
                      text: "View on Medicare.gov",
                      style: "Hyperlink",
                      color: "0563C1",
                      underline: { type: "single" },
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    const doc = new Document({
      sections: [
        {
          children: [
            // Logo at top
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data: logoArrayBuffer,
                  transformation: { width: 200, height: 60 },
                  type: "webp",
                }),
              ],
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              text: "FACILITY ASSESSMENT SNAPSHOT",
              heading: "Heading2",
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: state,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [...tableRows, medicareRow],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Facility_Assessment_${ccn}.docx`);
  };
  const fmt = (val, decimals = 2) =>
    val !== undefined && val !== null && val !== ""
      ? parseFloat(val).toFixed(decimals) + "%"
      : "N/A";

  const fmtRate = (val, decimals = 2) =>
    val !== undefined && val !== null && val !== ""
      ? parseFloat(val).toFixed(decimals)
      : "N/A";

  const facilityName =
    manualInputs.facilityNameOverride ||
    (facilityData ? facilityData["provider_name"] : "");

  const state = facilityData ? facilityData["state"] : "";

  // Claims measure values
  const m521 = claimsData["521"];
  const m522 = claimsData["522"];
  const m551 = claimsData["551"];
  const m552 = claimsData["552"];

  const getStarStyle = (rating) => {
    const r = parseInt(rating);
    if (r >= 4) return { color: "#22a745", fontWeight: "bold" };
    if (r === 3) return { color: "#f0a500", fontWeight: "bold" };
    return { color: "#dc3545", fontWeight: "bold" };
  };

  // Returns emoji indicator comparing facility value to national average
  // ✅ = facility performing better than national avg (lower is better for these metrics)
  // ⚠️ = facility performing worse than national avg
  // ➡️ = same as national avg
  const getIndicator = (facilityVal, avgVal) => {
    const f = parseFloat(facilityVal);
    const a = parseFloat(avgVal);
    if (isNaN(f) || isNaN(a)) return "";
    if (f < a) return " ✅";
    if (f > a) return " ⚠️";
    return " ➡️";
  };

  // Returns color class and label based on star rating for cards
  const getCardInfo = (rating) => {
    const r = parseInt(rating);
    if (r >= 4) return { colorClass: "green", label: "Good" };
    if (r === 3) return { colorClass: "yellow", label: "Average" };
    return { colorClass: "red", label: "Poor" };
  };

  // ============================================================
  // RENDER: The UI layout
  // ============================================================
  return (
    <div className="app-container">
      <h1 className="app-title">
        Medelite Facility Assessment Report Generator
      </h1>

      <div className="input-section">
        <h2>Enter Facility CCN</h2>
        <div className="ccn-row">
          <input
            type="text"
            placeholder="Enter CCN (e.g. 686123)"
            value={ccn}
            onChange={(e) => setCcn(e.target.value)}
            className="ccn-input"
          />
          <button
            onClick={fetchFacilityData}
            className="fetch-btn"
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch Facility Data"}
          </button>
        </div>
        {/* {error && <p className="error">{error}</p>} */}
        {error && (
          <div className="error-box">
            <p>❌ {error}</p>
            <p style={{ fontSize: "13px", color: "#666" }}>
              💡 Tip: Find any facility's CCN at{" "}
              <a
                href="https://www.medicare.gov/care-compare"
                target="_blank"
                rel="noreferrer"
              >
                medicare.gov/care-compare
              </a>
            </p>
          </div>
        )}
      </div>

      {facilityData && (
        <div className="input-section">
          <h2>Fill in Internal Details</h2>
          <div className="form-grid">
            <label>Facility Name Override (optional)</label>
            <input
              name="facilityNameOverride"
              value={manualInputs.facilityNameOverride}
              onChange={handleManualChange}
              placeholder={facilityData["provider_name"]}
            />
            <label>EMR System</label>
            <input
              name="emr"
              value={manualInputs.emr}
              onChange={handleManualChange}
              placeholder="e.g. PCC, MatrixCare"
            />
            <label>Current Census</label>
            <input
              name="currentCensus"
              value={manualInputs.currentCensus}
              onChange={handleManualChange}
              placeholder="e.g. 112"
              type="number"
            />
            <label>Type of Patient</label>
            <input
              name="patientType"
              value={manualInputs.patientType}
              onChange={handleManualChange}
              placeholder="e.g. Long-term & Short-term"
            />
            <label>Previous Coverage from Medelite</label>
            <select
              name="previousCoverage"
              value={manualInputs.previousCoverage}
              onChange={handleManualChange}
            >
              <option>Yes</option>
              <option>No</option>
            </select>
            <label>Previous Provider Performance</label>
            <input
              name="previousPerformance"
              value={manualInputs.previousPerformance}
              onChange={handleManualChange}
              placeholder="e.g. About 30 patients/day"
            />
            <label>Medical Coverage</label>
            <input
              name="medicalCoverage"
              value={manualInputs.medicalCoverage}
              onChange={handleManualChange}
              placeholder="e.g. Optometry, PCP, Podiatry"
            />
          </div>
          <button onClick={downloadPDF} className="pdf-btn">
            ⬇ Download PDF
          </button>
          <button
            onClick={downloadWord}
            className="pdf-btn"
            style={{ backgroundColor: "#2b579a", marginTop: "10px" }}
          >
            📄 Download Word Doc
          </button>
        </div>
      )}

      {/* Star Rating Cards - web app only, NOT in PDF */}
      {facilityData && (
        <div className="cards-container">
          {[
            { title: "Overall Rating", value: facilityData["overall_rating"] },
            {
              title: "Health Inspection",
              value: facilityData["health_inspection_rating"],
            },
            { title: "Staffing", value: facilityData["staffing_rating"] },
            { title: "Quality of Care", value: facilityData["qm_rating"] },
          ].map((item) => {
            const { colorClass, label } = getCardInfo(item.value);
            return (
              <div key={item.title} className={`rating-card ${colorClass}`}>
                <div className="card-title">{item.title}</div>
                <div className="card-stars">
                  {"⭐".repeat(parseInt(item.value))}
                </div>
                <div className={`card-number ${colorClass}`}>{item.value}</div>
                <div className={`card-label ${colorClass}`}>{label}</div>
              </div>
            );
          })}
        </div>
      )}

      {facilityData && (
        <div ref={reportRef} className="report">
          <div className="report-header">
            <img
              src="/Picture1.png"
              alt="INFINITE Managed by MEDELITE"
              style={{
                width: "250px",
                marginBottom: "10px",
                backgroundColor: "white",
                padding: "8px",
                borderRadius: "4px",
              }}
            />
            <h2>FACILITY ASSESSMENT SNAPSHOT</h2>
            <h3>{state}</h3>
          </div>

          <table className="report-table">
            <tbody>
              <tr>
                <td>
                  <strong>Name of Facility</strong>
                </td>
                <td>{facilityName}</td>
              </tr>
              <tr>
                <td>
                  <strong>Location</strong>
                </td>
                <td>{facilityData["location"]}</td>
              </tr>
              <tr>
                <td>
                  <strong>EMR</strong>
                </td>
                <td>{manualInputs.emr}</td>
              </tr>
              <tr>
                <td>
                  <strong>Census Capacity</strong>
                </td>
                <td>{facilityData["number_of_certified_beds"]}</td>
              </tr>
              <tr>
                <td>
                  <strong>Current Census</strong>
                </td>
                <td>{manualInputs.currentCensus}</td>
              </tr>
              <tr>
                <td>
                  <strong>Type of Patient</strong>
                </td>
                <td>{manualInputs.patientType}</td>
              </tr>
              <tr>
                <td>
                  <strong>Previous Coverage from Medelite</strong>
                </td>
                <td>{manualInputs.previousCoverage}</td>
              </tr>
              <tr>
                <td>
                  <strong>Previous Provider Performance from Medelite</strong>
                </td>
                <td>{manualInputs.previousPerformance}</td>
              </tr>
              <tr>
                <td>
                  <strong>Medical Coverage</strong>
                </td>
                <td>{manualInputs.medicalCoverage}</td>
              </tr>
              <tr>
                <td>
                  <strong>Overall Star Rating</strong>
                </td>
                <td style={getStarStyle(facilityData["overall_rating"])}>
                  {"⭐".repeat(parseInt(facilityData["overall_rating"]))}{" "}
                  {facilityData["overall_rating"]}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Health Inspection</strong>
                </td>
                <td
                  style={getStarStyle(facilityData["health_inspection_rating"])}
                >
                  {facilityData["health_inspection_rating"]}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Staffing</strong>
                </td>
                <td style={getStarStyle(facilityData["staffing_rating"])}>
                  {facilityData["staffing_rating"]}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Quality of Resident Care</strong>
                </td>
                <td style={getStarStyle(facilityData["qm_rating"])}>
                  {facilityData["qm_rating"]}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Short Term Hospitalization</strong>
                </td>
                <td>
                  {m521
                    ? fmt(m521["adjusted_score"]) +
                      getIndicator(
                        m521["adjusted_score"],
                        nationAvg?.[
                          "percentage_of_short_stay_residents_who_were_rehospitalized__1d02"
                        ],
                      )
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>STR National Avg. for Hospitalization</strong>
                </td>
                <td>
                  {nationAvg
                    ? fmt(
                        nationAvg[
                          "percentage_of_short_stay_residents_who_were_rehospitalized__1d02"
                        ],
                      )
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>STR State Avg. for Hospitalization</strong>
                </td>
                <td>
                  {stateAvg
                    ? fmt(
                        stateAvg[
                          "percentage_of_short_stay_residents_who_were_rehospitalized__1d02"
                        ],
                      )
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>STR ED Visit</strong>
                </td>
                <td>
                  {m522
                    ? fmt(m522["adjusted_score"]) +
                      getIndicator(
                        m522["adjusted_score"],
                        nationAvg?.[
                          "percentage_of_short_stay_residents_who_had_an_outpatient_em_d911"
                        ],
                      )
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>STR ED Visits National Avg.</strong>
                </td>
                <td>
                  {nationAvg
                    ? fmt(
                        nationAvg[
                          "percentage_of_short_stay_residents_who_had_an_outpatient_em_d911"
                        ],
                      )
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>STR ED Visits State Avg.</strong>
                </td>
                <td>
                  {stateAvg
                    ? fmt(
                        stateAvg[
                          "percentage_of_short_stay_residents_who_had_an_outpatient_em_d911"
                        ],
                      )
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>LT Hospitalization</strong>
                </td>
                <td>
                  {m551
                    ? fmtRate(m551["adjusted_score"]) +
                      getIndicator(
                        m551["adjusted_score"],
                        nationAvg?.[
                          "number_of_hospitalizations_per_1000_longstay_resident_days"
                        ],
                      )
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>LT National Avg. for Hospitalization</strong>
                </td>
                <td>
                  {nationAvg
                    ? fmtRate(
                        nationAvg[
                          "number_of_hospitalizations_per_1000_longstay_resident_days"
                        ],
                      )
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>LT State Avg. for Hospitalization</strong>
                </td>
                <td>
                  {stateAvg
                    ? fmtRate(
                        stateAvg[
                          "number_of_hospitalizations_per_1000_longstay_resident_days"
                        ],
                      )
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>ED Visit</strong>
                </td>
                <td>
                  {m552
                    ? fmtRate(m552["adjusted_score"]) +
                      getIndicator(
                        m552["adjusted_score"],
                        nationAvg?.[
                          "number_of_outpatient_emergency_department_visits_per_1000_l_de9d"
                        ],
                      )
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>LT ED Visits National Avg.</strong>
                </td>
                <td>
                  {nationAvg
                    ? fmtRate(
                        nationAvg[
                          "number_of_outpatient_emergency_department_visits_per_1000_l_de9d"
                        ],
                      )
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>LT ED Visits State Avg.</strong>
                </td>
                <td>
                  {stateAvg
                    ? fmtRate(
                        stateAvg[
                          "number_of_outpatient_emergency_department_visits_per_1000_l_de9d"
                        ],
                      )
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Medicare Profile</strong>
                </td>
                <td>
                  <a
                    href={
                      "https://www.medicare.gov/care-compare/details/nursing-home/" +
                      ccn
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on Medicare.gov
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
