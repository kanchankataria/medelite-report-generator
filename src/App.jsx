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

import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./App.css";

function App() {
  const [ccn, setCcn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [facilityData, setFacilityData] = useState(null);
  const [claimsData, setClaimsData] = useState({});
  const [nationAvg, setNationAvg] = useState(null);
  const [stateAvg, setStateAvg] = useState(null);
  const [manualInputs, setManualInputs] = useState({
    facilityNameOverride: "",
    emr: "",
    currentCensus: "",
    patientType: "",
    previousCoverage: "No",
    previousPerformance: "",
    medicalCoverage: "",
  });
  const reportRef = useRef();

  const fetchFacilityData = async () => {
    if (!ccn.trim()) {
      setError("Please enter a CCN number.");
      return;
    }
    setLoading(true);
    setError("");
    setFacilityData(null);
    setClaimsData({});
    setNationAvg(null);
    setStateAvg(null);

    try {
      // 1. Main facility info

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
      const nationRes = await fetch(
        `/cms-api/datastore/query/xcdc-v8bm/0?conditions[0][property]=state_or_nation&conditions[0][value]=NATION&conditions[0][operator]==&limit=1`,
      );
      const nationJson = await nationRes.json();
      if (nationJson.results && nationJson.results.length > 0) {
        setNationAvg(nationJson.results[0]);
      }

      // 4. State averages
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

  // const downloadPDF = async () => {
  //   const element = reportRef.current;
  //   const canvas = await html2canvas(element, { scale: 2 });
  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF("p", "mm", "a4");
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //   const medicareUrl =
  //     "https://www.medicare.gov/care-compare/details/nursing-home/" + ccn;
  //   pdf.link(40, pdfHeight - 14, 120, 10, { url: medicareUrl });
  //   pdf.save(`Facility_Assessment_${ccn}.pdf`);
  // };

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

  return (
    <div className="app-container">
      <h1 className="app-title">
        Medelite Facility Assessment Report Generator
      </h1>

      <div className="input-section">
        <h2>Step 1: Enter Facility CCN</h2>
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
        {error && <p className="error">{error}</p>}
      </div>

      {facilityData && (
        <div className="input-section">
          <h2>Step 2: Fill in Internal Details</h2>
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
        </div>
      )}

      {facilityData && (
        <div ref={reportRef} className="report">
          <div className="report-header">
            <h1>INFINITE</h1>
            <p>Managed by MEDELITE</p>
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
                <td>{facilityData["overall_rating"]}</td>
              </tr>
              <tr>
                <td>
                  <strong>Health Inspection</strong>
                </td>
                <td>{facilityData["health_inspection_rating"]}</td>
              </tr>
              <tr>
                <td>
                  <strong>Staffing</strong>
                </td>
                <td>{facilityData["staffing_rating"]}</td>
              </tr>
              <tr>
                <td>
                  <strong>Quality of Resident Care</strong>
                </td>
                <td>{facilityData["qm_rating"]}</td>
              </tr>
              <tr>
                <td>
                  <strong>Short Term Hospitalization</strong>
                </td>
                <td>{m521 ? fmt(m521["adjusted_score"]) : "N/A"}</td>
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
                <td>{m522 ? fmt(m522["adjusted_score"]) : "N/A"}</td>
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
                <td>{m551 ? fmtRate(m551["adjusted_score"]) : "N/A"}</td>
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
                <td>{m552 ? fmtRate(m552["adjusted_score"]) : "N/A"}</td>
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
