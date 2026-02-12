// =============== MODE SWITCHING ===============
// Store manual calculation data (global scope)
let manualConductorData = null;
let manualSheathData = null;

// Mode switching will be initialized after DOM loads
let btnPdfMode, btnManualMode, pdfInterface, manualInterface;

window.addEventListener('load', function() {
  btnPdfMode = document.getElementById("btnPdfMode");
  btnManualMode = document.getElementById("btnManualMode");
  pdfInterface = document.getElementById("pdfInterface");
  manualInterface = document.getElementById("manualInterface");

  // Mode switching handlers
  if (btnPdfMode && btnManualMode && pdfInterface && manualInterface) {
    console.log("Mode switching elements found successfully");
    
    btnPdfMode.onclick = function() {
      console.log("PDF Mode clicked");
      pdfInterface.style.display = "block";
      manualInterface.style.display = "none";
      btnPdfMode.className = "btn btn-primary-enhanced btn-enhanced";
      btnManualMode.className = "btn btn-outline-enhanced btn-enhanced";
    };

    btnManualMode.onclick = function() {
      console.log("Manual Mode clicked");
      pdfInterface.style.display = "none";
      manualInterface.style.display = "block";
      btnPdfMode.className = "btn btn-outline-enhanced btn-enhanced";
      btnManualMode.className = "btn btn-primary-enhanced btn-enhanced";
    };
  } else {
    console.error("Mode switching elements not found");
  }
});

// =============== BASIC DOM HANDLES ===============
const pdfInput = document.getElementById("pdfFile");
const btnExtract = document.getElementById("btnExtract");
const extractStatus = document.getElementById("extractStatus");


const conductorForm = document.getElementById("conductorForm");
const sheathForm = document.getElementById("sheathForm");
const resultBox = document.getElementById("resultBox");
const resultText = document.getElementById("resultText");
const btnReset = document.getElementById("btnReset");

// Download buttons
const btnDownloadConductor = document.getElementById("btnDownloadConductor");
const btnDownloadSheath = document.getElementById("btnDownloadSheath");
const btnDownloadMerged = document.getElementById("btnDownloadMerged");
const btnDownloadConductorWord = document.getElementById("btnDownloadConductorWord");
const btnDownloadSheathWord = document.getElementById("btnDownloadSheathWord");

function setupSelectDropdownButton(buttonId, selectId) {
  const btn = document.getElementById(buttonId);
  const select = document.getElementById(selectId);
  if (!btn || !select) return;

  let overlayOpen = false;

  const openCustomOverlay = () => {
    const rect = select.getBoundingClientRect();
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.left = rect.left + "px";
    overlay.style.top = rect.bottom + "px";
    overlay.style.width = rect.width + "px";
    overlay.style.background = "#fff";
    overlay.style.border = "1px solid #c3c7d0";
    overlay.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    overlay.style.zIndex = "2000";
    overlay.style.borderRadius = "4px";
    overlay.style.maxHeight = "220px";
    overlay.style.overflowY = "auto";
    for (let i = 0; i < select.options.length; i++) {
      const opt = select.options[i];
      const item = document.createElement("div");
      item.textContent = opt.textContent;
      item.style.padding = "8px 12px";
      item.style.cursor = "pointer";
      item.style.whiteSpace = "nowrap";
      if (opt.selected) item.style.background = "#E6F0FF";
      item.addEventListener("mouseenter", () => (item.style.background = "#E6F0FF"));
      item.addEventListener("mouseleave", () => (item.style.background = opt.selected ? "#E6F0FF" : "#fff"));
      item.addEventListener("click", () => {
        select.value = opt.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        document.body.removeChild(overlay);
        overlayOpen = false;
        select.style.pointerEvents = "auto";
      });
      overlay.appendChild(item);
    }
    const close = (e) => {
      const target = e && e.target && e.target.nodeType ? e.target : null;
      if (!target || (!overlay.contains(target) && target !== btn)) {
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
        document.removeEventListener("click", close, true);
        window.removeEventListener("resize", close, true);
        window.removeEventListener("scroll", close, true);
        overlayOpen = false;
        select.style.pointerEvents = "auto";
      }
    };
    document.addEventListener("click", close, true);
    window.addEventListener("resize", close, true);
    window.addEventListener("scroll", close, true);
    document.body.appendChild(overlay);
    overlayOpen = true;
    // Prevent native dropdown interactions while overlay is open
    select.style.pointerEvents = "none";
  };

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    select.blur();
    openCustomOverlay();
  });

  select.addEventListener("change", () => {
    select.blur();
  });

  const suppressIfOverlay = (e) => {
    if (overlayOpen) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  select.addEventListener("mousedown", suppressIfOverlay, true);
  select.addEventListener("click", suppressIfOverlay, true);
  select.addEventListener("keydown", suppressIfOverlay, true);

  document.addEventListener("click", (e) => {
    if (!select.contains(e.target) && !btn.contains(e.target)) {
      select.blur();
    }
  });
}

// Store calculation data
let conductorData = null;
let sheathData = null;
let conductorCalculated = false;
let sheathCalculated = false;

// PDF preview button
const btnViewPdf = document.getElementById("btnViewPdf");
let uploadedPdfUrl = null;

// Rated-voltage dropdown (optional)
const ratedVoltageSelect = document.getElementById("ratedVoltageSelect");
const ratedVoltageHelp = document.getElementById("ratedVoltageHelp");

// Dropdowns for insulation & outer sheath
const insulationSelect = document.getElementById("insulationMaterial");
const outerSheathSelect = document.getElementById("outerSheathMaterial");

setupSelectDropdownButton("materialDropdownBtn", "material");
setupSelectDropdownButton("sheathMaterialDropdownBtn", "sheathMaterial");
setupSelectDropdownButton("manualMaterialDropdownBtn", "manualMaterial");
setupSelectDropdownButton("manualSheathMaterialDropdownBtn", "manualSheathMaterial");
setupSelectDropdownButton("manualConductorModeDropdownBtn", "manualConductorMode");
setupSelectDropdownButton("cwsConfigDropdownBtn", "cwsSheathConfig");
setupSelectDropdownButton("cwsSheathMaterialDropdownBtn", "cwsSheathMaterial");
setupSelectDropdownButton("insulationMaterialDropdownBtn", "insulationMaterial");
setupSelectDropdownButton("outerSheathMaterialDropdownBtn", "outerSheathMaterial");
setupSelectDropdownButton("manualInsulationMaterialDropdownBtn", "manualInsulationMaterial");
setupSelectDropdownButton("manualOuterSheathMaterialDropdownBtn", "manualOuterSheathMaterial");
setupSelectDropdownButton("conductorModeDropdownBtn", "conductorMode");
setupSelectDropdownButton("voltageDropdownBtn", "ratedVoltageSelect");

function updateSheathCwsGeometry() {
  const dInput = document.getElementById("sheathCwsWireDiameter");
  const nInput = document.getElementById("sheathCwsWireCount");
  const areaEl = document.getElementById("sheathCwsArea");

  if (!dInput || !nInput || !areaEl) return;

  const d = parseFloat(dInput.value);
  const N = parseFloat(nInput.value);

  if (!isNaN(d) && !isNaN(N) && d > 0 && N > 0) {
    const wireArea = (Math.PI * d * d) / 4;
    const totalArea = N * wireArea;
    areaEl.value = totalArea.toFixed(2);
  } else {
    areaEl.value = "";
  }
}

const sheathCwsWireDiameterEl = document.getElementById("sheathCwsWireDiameter");
const sheathCwsWireCountEl = document.getElementById("sheathCwsWireCount");
if (sheathCwsWireDiameterEl) sheathCwsWireDiameterEl.addEventListener("input", updateSheathCwsGeometry);
if (sheathCwsWireCountEl) sheathCwsWireCountEl.addEventListener("input", updateSheathCwsGeometry);
function updateManualCwsGeometry() {
  const dInput = document.getElementById("manualCwsWireDiameter");
  const nInput = document.getElementById("manualCwsWireCount");
  const areaEl = document.getElementById("manualCwsArea");
  if (!dInput || !nInput || !areaEl) return;
  const d = parseFloat(dInput.value);
  const N = parseFloat(nInput.value);
  if (!isNaN(d) && !isNaN(N) && d > 0 && N > 0) {
    const wireArea = (Math.PI * d * d) / 4;
    const totalArea = N * wireArea;
    areaEl.value = totalArea.toFixed(2);
  } else {
    areaEl.value = "";
  }
}
const manualCwsWireDiameterEl = document.getElementById("manualCwsWireDiameter");
const manualCwsWireCountEl = document.getElementById("manualCwsWireCount");
if (manualCwsWireDiameterEl) manualCwsWireDiameterEl.addEventListener("input", updateManualCwsGeometry);
if (manualCwsWireCountEl) manualCwsWireCountEl.addEventListener("input", updateManualCwsGeometry);

const sheathMaterialSelectForToggle = document.getElementById("sheathMaterial");
if (sheathMaterialSelectForToggle) {
  const toggleByMaterial = () => {
    const val = (sheathMaterialSelectForToggle.value || "").toLowerCase();
    const cwsBlock = document.getElementById("sheathCwsParameters");
    const headerEl = document.getElementById("sheathParametersHeader");
    
    // Update header text based on selection
    if (headerEl && sheathMaterialSelectForToggle.selectedIndex >= 0) {
      const selectedText = sheathMaterialSelectForToggle.options[sheathMaterialSelectForToggle.selectedIndex].text;
      if (val) {
        if (val === "cws_only") {
            headerEl.textContent = "Screen Parameters";
        } else {
            // Remove "CWS + " prefix if present (e.g. "CWS + Aluminium Sheath" -> "Aluminium Sheath")
            let displayText = selectedText.replace("CWS + ", "").trim();
            // Ensure "Sheath" is part of the name if it's not already (e.g. "Aluminium" -> "Aluminium Sheath")
            if (!displayText.toLowerCase().includes("sheath")) {
                displayText += " Sheath";
            }
            headerEl.textContent = `${displayText} Parameters`;
        }
      } else {
        headerEl.textContent = "Sheath Parameters";
      }
    }
    
    if (cwsBlock) {
      cwsBlock.style.display = val.includes("cws") ? "block" : "none";
    }
    
    // Hide sheath geometry fields for CWS Only
    if (val === "cws_only") {
      // Find and hide the row containing sheath geometry fields
      const sheathGeometryRows = document.querySelectorAll("#sheathForm .row");
      sheathGeometryRows.forEach(row => {
        const outerDInput = row.querySelector("#sheathOuterD");
        const innerDInput = row.querySelector("#sheathInnerD");
        const thicknessInput = row.querySelector("#sheathThickness");
        const areaInput = row.querySelector("#sheathAreaGiven");
        
        if (outerDInput || innerDInput || thicknessInput || areaInput) {
          row.style.display = "none";
        }
      });
    } else {
      // Show sheath geometry fields for other options
      const sheathGeometryRows = document.querySelectorAll("#sheathForm .row");
      sheathGeometryRows.forEach(row => {
        const outerDInput = row.querySelector("#sheathOuterD");
        const innerDInput = row.querySelector("#sheathInnerD");
        const thicknessInput = row.querySelector("#sheathThickness");
        const areaInput = row.querySelector("#sheathAreaGiven");
        
        if (outerDInput || innerDInput || thicknessInput || areaInput) {
          row.style.display = "";
        }
      });
    }
  };
  sheathMaterialSelectForToggle.addEventListener("change", toggleByMaterial);
  toggleByMaterial(); // init
}
const manualSheathMaterialSelectForToggle = document.getElementById("manualSheathMaterial");
if (manualSheathMaterialSelectForToggle) {
  const toggleManualByMaterial = () => {
    const val = (manualSheathMaterialSelectForToggle.value || "").toLowerCase();
    const cwsBlock = document.getElementById("manualCwsParameters");
    const headerEl = document.getElementById("manualSheathParametersHeader");
    if (headerEl && manualSheathMaterialSelectForToggle.selectedIndex >= 0) {
      const selectedText = manualSheathMaterialSelectForToggle.options[manualSheathMaterialSelectForToggle.selectedIndex].text;
      if (val) {
        if (val === "cws_only") {
          headerEl.textContent = "Screen Parameters";
        } else {
          let displayText = selectedText.replace("CWS + ", "").trim();
          if (!displayText.toLowerCase().includes("sheath")) {
            displayText += " Sheath";
          }
          headerEl.textContent = `${displayText} Parameters`;
        }
      } else {
        headerEl.textContent = "Sheath Parameters";
      }
    }
    
    if (cwsBlock) {
      cwsBlock.style.display = val.includes("cws") ? "block" : "none";
    }
    
    // Hide sheath geometry fields for CWS Only in manual mode
    if (val === "cws_only") {
      // Find and hide the row containing sheath geometry fields
      const sheathGeometryRows = document.querySelectorAll("#manualSheathForm .row");
      sheathGeometryRows.forEach(row => {
        const outerDInput = row.querySelector("#manualSheathOuterD");
        const innerDInput = row.querySelector("#manualSheathInnerD");
        const thicknessInput = row.querySelector("#manualSheathThickness");
        const areaInput = row.querySelector("#manualSheathAreaGiven");
        
        if (outerDInput || innerDInput || thicknessInput || areaInput) {
          row.style.display = "none";
        }
      });
    } else {
      // Show sheath geometry fields for other options
      const sheathGeometryRows = document.querySelectorAll("#manualSheathForm .row");
      sheathGeometryRows.forEach(row => {
        const outerDInput = row.querySelector("#manualSheathOuterD");
        const innerDInput = row.querySelector("#manualSheathInnerD");
        const thicknessInput = row.querySelector("#manualSheathThickness");
        const areaInput = row.querySelector("#manualSheathAreaGiven");
        
        if (outerDInput || innerDInput || thicknessInput || areaInput) {
          row.style.display = "";
        }
      });
    }
  };
  manualSheathMaterialSelectForToggle.addEventListener("change", toggleManualByMaterial);
  toggleManualByMaterial(); // init
}
// =============== CONSTANT TABLES ===============

// Sheaths, screens, armour (Table I) - Updated with exact IEC 60949 values
const TABLE_I_SHEATHS = {
  lead: { K: 41, beta: 230, sigmaC: 1.45e6, rho20: 2.14e-7 },
  steel: { K: 78, beta: 202, sigmaC: 3.8e6, rho20: 13.8e-8 },
  bronze: { K: 180, beta: 313, sigmaC: 3.4e6, rho20: 3.5e-8 },
  aluminium: { K: 148, beta: 228, sigmaC: 2.5e6, rho20: 2.84e-8 }
};

// Conductors (Table I)
const TABLE_I_CONDUCTORS = {
  copper: { K: 226, beta: 234.5, sigmaC: 3.45e6, rho20: 1.7241e-8 },
  aluminium: { K: 148, beta: 228, sigmaC: 2.5e6, rho20: 2.8264e-8 }
};

// CWS (Copper Wire Screen) - treated as copper material with exact IEC values
const TABLE_I_CWS = {
  copper: { K: 226, beta: 234.5, sigmaC: 3.45e6, rho20: 1.7241e-8 }
};

// Thermal constants (ρ, σ)
const THERMAL_CONSTANTS = {
  insulating: {
    "impregnated-paper-solid": { rho: 6.0, sigma: 2.0e6 },
    "impregnated-paper-oil-filled": { rho: 5.0, sigma: 2.0e6 },
    oil: { rho: 7.0, sigma: 1.7e6 },
    PE: { rho: 3.5, sigma: 2.4e6 },
    XLPE: { rho: 3.5, sigma: 2.4e6 },
    PVC: {
      "<=3kV": { rho: 5.0, sigma: 1.7e6 },
      ">3kV": { rho: 6.0, sigma: 1.7e6 }
    },
    EPR: {
      "<=3kV": { rho: 3.5, sigma: 2.0e6 },
      ">3kV": { rho: 5.0, sigma: 2.0e6 }
    },
    "butyl-rubber": { rho: 5.0, sigma: 2.0e6 },
    "natural-rubber": { rho: 5.0, sigma: 2.0e6 }
  },
  protective: {
    "compounded-jute": { rho: 6.0, sigma: 2.0e6 },
    "rubber-sandwich": { rho: 6.0, sigma: 2.0e6 },
    polychloroprene: { rho: 5.5, sigma: 2.0e6 },
    PVC: {
      "<=35kV": { rho: 5.0, sigma: 1.7e6 },
      ">35kV": { rho: 6.0, sigma: 1.7e6 }
    },
    "PVC-bitumen": { rho: 6.0, sigma: 1.7e6 },
    PE: { rho: 3.5, sigma: 2.4e6 }
  }
};

// Thermal contact factor F
const THERMAL_CONTACT_FACTOR = {
  default: 0.7,
  "oil-filled": 1.0
};

// =============== INITIAL DEFAULTS ===============

// Default insulation = XLPE if nothing is selected
if (insulationSelect && !insulationSelect.value) {
  insulationSelect.value = "XLPE";
}

// Default outer sheath = PE if nothing is selected
if (outerSheathSelect && !outerSheathSelect.value) {
  outerSheathSelect.value = "PE";
}

// =============== UTILS ===============
function setValue(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  if (value === null || value === undefined) return;
  el.value = value;
}

function showResult(html, isError = false) {
  console.log("showResult called with html length:", html.length);
  console.log("HTML preview:", html.substring(0, 150));
  resultText.innerHTML = html;
  resultText.className = isError ? 'results-box error' : 'results-box';
  resultBox.style.display = "block";
  console.log("Result box display set to block");
  console.log("resultText.innerHTML is now:", resultText.innerHTML.substring(0, 150));

  // Force scroll after a short delay to ensure rendering
  setTimeout(() => {
    if (resultBox && typeof resultBox.scrollIntoView === "function") {
      resultBox.scrollIntoView({ behavior: "smooth", block: "center" });
      console.log("Scrolled to result box");
    }
  }, 100);
}

function showNotification(message, type = 'info') {
  // Simple notification system
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    color: white;
    font-weight: 600;
    z-index: 9999;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#2563eb'
  };
  
  notification.style.background = colors[type] || colors.info;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function validateVoltageTime(voltageKv, t) {
  if (voltageKv <= 0 || t <= 0) {
    showNotification("Voltage and time must be positive.", 'error');
    return false;
  }
  if (t > 10) {
    showNotification("Time must not be greater than 10 seconds.", 'error');
    return false;
  }
  return true;
}

// =============== Rated Voltage dropdown helper ===============
function populateRatedVoltages(list, headerVoltage) {
  if (!ratedVoltageSelect || !ratedVoltageHelp) return;
  
  const voltageDropdownBtn = document.getElementById("voltageDropdownBtn");

  ratedVoltageSelect.innerHTML = "";
  if (!list || !list.length) {
    ratedVoltageSelect.style.display = "none";
    ratedVoltageHelp.style.display = "none";
    if (voltageDropdownBtn) voltageDropdownBtn.style.display = "none";
    return;
  }

  ratedVoltageSelect.style.display = "block";
  ratedVoltageHelp.style.display = "block";
  if (voltageDropdownBtn) {
    voltageDropdownBtn.style.display = "block";
    console.log("Showing voltage dropdown button");
  }

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select rated voltage";
  ratedVoltageSelect.appendChild(placeholder);

  list.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = `${v} kV`;
    ratedVoltageSelect.appendChild(opt);
  });

  // Auto-select header voltage if it is in the list
  if (headerVoltage != null) {
    const match = list.find((v) => v === headerVoltage);
    if (match !== undefined) {
      ratedVoltageSelect.value = String(match);
    }
  }
}

if (ratedVoltageSelect) {
  ratedVoltageSelect.addEventListener("change", () => {
    const val = parseFloat(ratedVoltageSelect.value);
    console.log("Dropdown changed to:", val);
    if (!isNaN(val)) {
      setValue("voltageKv", val);
      setValue("sheathVoltageKv", val);
      
      // Close the dropdown immediately
      ratedVoltageSelect.size = 1;
      ratedVoltageSelect.blur();
      console.log("Dropdown closed after selection");
    }
  });
  
  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!ratedVoltageSelect.contains(e.target) && !voltageDropdownBtn.contains(e.target)) {
      ratedVoltageSelect.size = 1;
    }
  });
}

// Add click handler for dropdown button
const voltageDropdownBtn = document.getElementById("voltageDropdownBtn");
if (voltageDropdownBtn) {
  voltageDropdownBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    ratedVoltageSelect.blur();
  });
}

// Add click handler for conductor mode dropdown button
const conductorModeDropdownBtn = document.getElementById("conductorModeDropdownBtn");
const conductorModeSelect = document.getElementById("conductorMode");
if (conductorModeDropdownBtn && conductorModeSelect) {
  conductorModeDropdownBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    conductorModeSelect.blur();
  });
}

// =============== PDF PREVIEW WIRING ===============
pdfInput.addEventListener("change", () => {
  const file = pdfInput.files[0];
  if (!file) {
    uploadedPdfUrl = null;
    if (btnViewPdf) btnViewPdf.style.display = "none";
    return;
  }

  if (uploadedPdfUrl) {
    URL.revokeObjectURL(uploadedPdfUrl);
  }
  uploadedPdfUrl = URL.createObjectURL(file);

  if (btnViewPdf) {
    btnViewPdf.style.display = "inline-block";
  }
  
  showNotification("PDF loaded successfully!", 'success');
});

if (btnViewPdf) {
  btnViewPdf.addEventListener("click", () => {
    if (uploadedPdfUrl) {
      window.open(uploadedPdfUrl, "_blank");
    }
  });
}

// =============== STEP 1: PDF OCR & EXTRACTION ===============
btnExtract.addEventListener("click", async () => {
  const file = pdfInput.files[0];
  if (!file) {
    showNotification("Please choose a PDF file first.", 'warning');
    return;
  }

  extractStatus.innerHTML = 'Extracting...';
  extractStatus.className = 'status-badge status-warning';
  resultBox.style.display = "none";

  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await fetch("/api/extract", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Extraction failed");

    console.log("Extraction data from server:", data);

    // Choose a finalVoltage to use:
    let finalVoltage = data.voltageKv;
    if ((finalVoltage == null || isNaN(finalVoltage)) &&
        data.ratedVoltages && data.ratedVoltages.length) {
      finalVoltage = data.ratedVoltages[data.ratedVoltages.length - 1];
    }

    // Voltage / current / time
    setValue("voltageKv", finalVoltage);
    
    // Handle short circuit current with red box if not found
    if (data.sccKa) {
      setValue("sccKa", data.sccKa);
      setValue("sheathSccKa", data.sccKa);
      // Remove any previous error styling
      document.getElementById("sccKa").style.borderColor = "";
      document.getElementById("sheathSccKa").style.borderColor = "";
    } else {
      // Show red box and message when no short circuit current found
      setValue("sccKa", "");
      setValue("sheathSccKa", "");
      
      // Add red border to indicate missing value
      document.getElementById("sccKa").style.borderColor = "#ef4444";
      document.getElementById("sccKa").style.borderWidth = "2px";
      document.getElementById("sccKa").placeholder = "⚠️ Not found in PDF";
      
      document.getElementById("sheathSccKa").style.borderColor = "#ef4444";
      document.getElementById("sheathSccKa").style.borderWidth = "2px";
      document.getElementById("sheathSccKa").placeholder = "⚠️ Not found in PDF";
      
      // Show notification message
      showNotification("⚠️ Short circuit current not found in PDF. Please enter manually.", 'warning');
    }
    
    setValue("timeSec", data.timeSec ?? 1);

    setValue("sheathVoltageKv", finalVoltage);
    setValue("sheathTimeSec", data.timeSec ?? 1);

    // Conductor area (if extracted)
    if (data.conductorArea) {
      setValue("givenConductorArea", data.conductorArea);
    }

    // Sheath dimensions (if extracted with improved OCR)
    console.log("Sheath dimensions from extraction:", {
      outerD: data.sheathOuterD,
      innerD: data.sheathInnerD,
      thickness: data.sheathThickness
    });
    
    if (data.sheathOuterD) {
      console.log("Setting sheathOuterD to:", data.sheathOuterD);
      setValue("sheathOuterD", data.sheathOuterD);
    }
    if (data.sheathInnerD) {
      console.log("Setting sheathInnerD to:", data.sheathInnerD);
      setValue("sheathInnerD", data.sheathInnerD);
    }
    if (data.sheathThickness) {
      console.log("Setting sheathThickness to:", data.sheathThickness);
      setValue("sheathThickness", data.sheathThickness);
    }
    // Trigger geometry update to calculate area
    if (data.sheathOuterD && data.sheathInnerD) {
      console.log("Triggering updateSheathGeometry");
      updateSheathGeometry();
    }

    // Conductor material
    const condMat = data.conductorMaterial || data.material || "";
    if (condMat) {
      document.getElementById("material").value = condMat;
    }

    // Sheath material
    let sheathMat = data.sheathMaterial || "";
    if (!sheathMat && condMat) {
      const lower = condMat.toLowerCase();
      if (lower.includes("al")) sheathMat = "aluminium";
      else sheathMat = "aluminium";
    }
    if (sheathMat) {
      const sheathSelect = document.getElementById("sheathMaterial");
      if (sheathSelect) sheathSelect.value = sheathMat;
    }

    // Insulation / outer sheath
    if (data.insulationMaterial && insulationSelect) {
      insulationSelect.value = data.insulationMaterial;
    }
    if (data.outerSheathMaterial && outerSheathSelect) {
      outerSheathSelect.value = data.outerSheathMaterial;
    }

    // K & β
    setValue("kValue", data.kValue);
    setValue("beta", data.beta);

    // Rated voltages dropdown
    populateRatedVoltages(data.ratedVoltages, data.voltageKv);

    // Debug text removed - keeping extraction logic only

    extractStatus.innerHTML = 'Extraction Complete';
    extractStatus.className = 'status-badge status-success';
    showNotification("Data extracted successfully!", 'success');
    
    // Show complete report button after successful extraction
    updateMergedButtonVisibility();
  } catch (err) {
    console.error(err);
    extractStatus.innerHTML = 'Extraction Failed';
    extractStatus.className = 'status-badge status-error';
    showNotification("Could not extract data from PDF: " + err.message, 'error');
  }
});

// =============== STEP 2: CONDUCTOR CALCULATION ===============
function calculateConductorAreaFromCurrent() {
  const voltageKv = parseFloat(document.getElementById("voltageKv").value);
  const I_AD_kA = parseFloat(document.getElementById("sccKa").value);
  const t = parseFloat(document.getElementById("timeSec").value);
  const K = parseFloat(document.getElementById("kValue").value);
  const beta = parseFloat(document.getElementById("beta").value);
  const theta_i = parseFloat(document.getElementById("thetaInitial").value);
  const theta_f = 250;

  if ([voltageKv, I_AD_kA, t, K, beta].some((v) => isNaN(v))) {
    showNotification("Please fill all conductor inputs.", 'warning');
    return null;
  }
  if (!validateVoltageTime(voltageKv, t)) return null;
  if (I_AD_kA <= 0 || K <= 0) {
    showNotification("Current and K must be positive.", 'error');
    return null;
  }

  const lnTerm = Math.log((theta_f + beta) / (theta_i + beta));
  if (lnTerm <= 0) {
    showNotification("Invalid temperature / beta combination.", 'error');
    return null;
  }

  const I_AD_A = I_AD_kA * 1000;
  const S_sq = (I_AD_A ** 2 * t) / (K ** 2 * lnTerm);
  if (S_sq <= 0) {
    showNotification("Calculated conductor area is not valid.", 'error');
    return null;
  }

  return Math.sqrt(S_sq);
}

function calculateConductorCurrentFromArea() {
  const t = parseFloat(document.getElementById("timeSec").value);
  const K = parseFloat(document.getElementById("kValue").value);
  const beta = parseFloat(document.getElementById("beta").value);
  const theta_i = parseFloat(document.getElementById("thetaInitial").value);
  const theta_f = 250;
  const S_given = parseFloat(
    document.getElementById("givenConductorArea").value
  );

  if ([t, K, beta, S_given].some((v) => isNaN(v))) {
    showNotification("Please fill time, K, β and given area.", 'warning');
    return null;
  }
  if (t <= 0) {
    showNotification("Time must be positive.", 'error');
    return null;
  }
  if (S_given <= 0 || K <= 0) {
    showNotification("Area and K must be positive.", 'error');
    return null;
  }

  const lnTerm = Math.log((theta_f + beta) / (theta_i + beta));
  if (lnTerm <= 0) {
    showNotification("Invalid temperature / beta combination.", 'error');
    return null;
  }

  const I_AD_A = K * S_given * Math.sqrt(lnTerm / t);
  return I_AD_A / 1000;
}

conductorForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("=== CONDUCTOR FORM SUBMITTED ===");
  // Don't hide result box - just update it
  
  const mode = document.getElementById("conductorMode").value;
  const S_given_str = document.getElementById("givenConductorArea").value;
  let html = "<h6 style='color: #2563eb;'>Conductor Calculation Results</h6><hr>";

  const voltageKv = parseFloat(document.getElementById("voltageKv").value);
  const I_AD_kA = parseFloat(document.getElementById("sccKa").value);
  const t = parseFloat(document.getElementById("timeSec").value);
  const K = parseFloat(document.getElementById("kValue").value);
  const beta = parseFloat(document.getElementById("beta").value);
  const material = document.getElementById("material").value;
  const insulation = document.getElementById("insulationMaterial").value;
  const outerSheath = document.getElementById("outerSheathMaterial").value;
  const theta_i = parseFloat(document.getElementById("thetaInitial").value);
  const theta_f = 250;

  if (mode === "area-from-current") {
    const S_required = calculateConductorAreaFromCurrent();
    if (S_required == null) return;

    html += `<p><strong>Required cross-sectional area S:</strong> <span style="font-size: 1.2rem; color: #2563eb;">${S_required.toFixed(2)} mm²</span></p>`;

    // Calculate I_AD for the calculated area using the formula
    const lnTerm = Math.log((theta_f + beta) / (theta_i + beta));
    const I_AD_for_calculated_area = K * S_required * Math.sqrt(lnTerm / t);
    html += `<p><strong>Maximum current carrying capacity for calculated area:</strong> <span style="font-size: 1.1rem; color: #059669;">${(I_AD_for_calculated_area / 1000).toFixed(2)} kA</span></p>`;

    const S_given = S_given_str !== "" ? parseFloat(S_given_str) : S_required;
    let I_AD_given_area = null; // Declare outside the if block
    let isUndersized = false; // Track if cable is undersized
    
    if (S_given_str !== "") {
      if (isNaN(S_given) || S_given <= 0) {
        showNotification("Given conductor area must be positive.", 'error');
        return;
      }
      
      // Calculate and display current carrying capacity for given area
      I_AD_given_area = K * S_given * Math.sqrt(lnTerm / t);
      html += `<p><strong>Maximum current carrying capacity for given area (${S_given.toFixed(2)} mm²):</strong> <span style="font-size: 1.1rem; color: #059669;">${(I_AD_given_area / 1000).toFixed(2)} kA</span></p>`;
      
      if (S_given >= S_required) {
        html += '<p><strong style="color: #10b981;">Cable size is sufficient for the required area.</strong></p>';
        showNotification("Conductor calculation passed!", 'success');
      } else {
        html += '<p><strong style="color: #ef4444;">Cable undersized. Please choose the next available size.</strong></p>';
        showNotification("Cable undersized - check results!", 'warning');
        isUndersized = true;
      }
    }
    
    // Calculate I_AD for the given area (reuse existing lnTerm)
    const I_AD_A = K * S_given * Math.sqrt(lnTerm / t);
    const I_AD_calculated = I_AD_A / 1000;
    
    // Store data for PDF generation
    conductorData = {
      voltage: voltageKv,
      area: S_given,
      material: material,
      insulation: insulation,
      outer_sheath: outerSheath,
      scc_required: I_AD_kA,
      time: t,
      theta_i: theta_i,
      theta_f: theta_f,
      beta: beta,
      k_value: K,
      i_ad: I_AD_calculated.toFixed(3),
      i_ad_calculated_area: (I_AD_for_calculated_area / 1000).toFixed(3),
      calculated_area: S_required.toFixed(2),
      i_ad_given_area: I_AD_given_area ? (I_AD_given_area / 1000).toFixed(3) : null
    };
    
    // Show result with error styling if undersized
    conductorCalculated = true;
    btnDownloadConductor.style.display = "inline-block";
    if (btnDownloadConductorWord) btnDownloadConductorWord.style.display = "inline-block";
    updateMergedButtonVisibility();
    showResult(html, isUndersized);
    
  } else {
    const I_AD_kA_calc = calculateConductorCurrentFromArea();
    if (I_AD_kA_calc == null) return;
    html += `<p><strong>Adiabatic short-circuit current I<sub>AD</sub> for given area:</strong> <span style="font-size: 1.2rem; color: #2563eb;">${I_AD_kA_calc.toFixed(2)} kA</span></p>`;
    showNotification("Conductor calculation complete!", 'success');
    
    const S_given = parseFloat(S_given_str);
    
    // Store data for PDF generation
    conductorData = {
      voltage: voltageKv,
      area: S_given,
      material: material,
      insulation: insulation,
      outer_sheath: outerSheath,
      scc_required: I_AD_kA,
      time: t,
      theta_i: theta_i,
      theta_f: theta_f,
      beta: beta,
      k_value: K,
      i_ad: I_AD_kA_calc.toFixed(3)
    };
    
    conductorCalculated = true;
    btnDownloadConductor.style.display = "inline-block";
    if (btnDownloadConductorWord) btnDownloadConductorWord.style.display = "inline-block";
    updateMergedButtonVisibility();
    showResult(html);
  }
});

// =============== STEP 3: SHEATH GEOMETRY ===============
function updateSheathGeometry() {
  const DoInput = document.getElementById("sheathOuterD");
  const DiInput = document.getElementById("sheathInnerD");
  const thicknessEl = document.getElementById("sheathThickness");
  const areaEl = document.getElementById("sheathAreaGiven");

  const Do = parseFloat(DoInput.value);
  const Di = parseFloat(DiInput.value);

  DoInput.style.borderColor = "";
  DiInput.style.borderColor = "";

  if (!isNaN(Do) && !isNaN(Di) && Do > 0 && Di > 0) {
    if (Do > Di) {
      const delta = (Do - Di) / 2;
      const area = (Math.PI / 4) * (Do * Do - Di * Di);
      thicknessEl.value = delta.toFixed(3);
      areaEl.value = area.toFixed(2);
    } else {
      thicknessEl.value = "";
      areaEl.value = "";
      DoInput.style.borderColor = "red";
      DiInput.style.borderColor = "red";
    }
  } else {
    thicknessEl.value = "";
    areaEl.value = "";
  }
}

document
  .getElementById("sheathOuterD")
  .addEventListener("input", updateSheathGeometry);
document
  .getElementById("sheathInnerD")
  .addEventListener("input", updateSheathGeometry);

// =============== SHEATH THERMAL HELPERS ===============
function getThermalConstants(materialType, materialName, voltageKv) {
  const group = THERMAL_CONSTANTS[materialType];
  if (!group) return null;
  const entry = group[materialName];
  if (!entry) return null;

  if (entry.rho !== undefined) return entry;

  if (materialType === "insulating") {
    if (materialName === "PVC" || materialName === "EPR") {
      return voltageKv <= 3 ? entry["<=3kV"] : entry[">3kV"];
    }
  } else if (materialType === "protective") {
    if (materialName === "PVC") {
      return voltageKv <= 35 ? entry["<=35kV"] : entry[">35kV"];
    }
  }
  return null;
}

function calculateM(
  insulationMaterial,
  outerSheathMaterial,
  sheathThickness,
  sheathMaterial,
  voltageKv,
  isOilFilled
) {
  const insulation = getThermalConstants(
    "insulating",
    insulationMaterial,
    voltageKv
  );
  const outerSheath = getThermalConstants(
    "protective",
    outerSheathMaterial,
    voltageKv
  );
  if (!insulation || !outerSheath) return null;

  const sigma2 = insulation.sigma;
  const rho2 = insulation.rho;
  const sigma3 = outerSheath.sigma;
  const rho3 = outerSheath.rho;

  const sheath = TABLE_I_SHEATHS[sheathMaterial];
  if (!sheath) return null;

  const sigma1 = sheath.sigmaC;
  const delta = sheathThickness;

  const F =
    isOilFilled === "yes"
      ? THERMAL_CONTACT_FACTOR["oil-filled"]
      : THERMAL_CONTACT_FACTOR.default;

  const sqrtTerm1 = Math.sqrt(sigma2 / rho2);
  const sqrtTerm2 = Math.sqrt(sigma3 / rho3);
  const numerator = sqrtTerm1 + sqrtTerm2;
  const denominator = 2 * sigma1 * delta * 1e-3;

  if (denominator === 0) return null;

  return (numerator / denominator) * F;
}

function calculateEpsilon(M, t) {
  if (M == null || isNaN(t) || t <= 0) return null;
  const MsqrtT = M * Math.sqrt(t);
  return (
    1 + 0.61 * MsqrtT - 0.069 * Math.pow(MsqrtT, 2) + 0.0043 * Math.pow(MsqrtT, 3)
  );
}

function calculateSheathAdiabaticArea(
  I_AD_kA,
  t,
  sheathMaterial,
  theta_i,
  theta_f
) {
  const mat = TABLE_I_SHEATHS[sheathMaterial];
  if (!mat) return null;

  const K = mat.K;
  const beta = mat.beta;

  const lnTerm = Math.log((theta_f + beta) / (theta_i + beta));
  if (lnTerm <= 0) return null;

  const I_AD_A = I_AD_kA * 1000;
  const s_sq = (I_AD_A ** 2 * t) / (K ** 2 * lnTerm);
  if (s_sq <= 0) return null;

  return Math.sqrt(s_sq);
}

// =============== SHEATH FORM SUBMIT ===============
sheathForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("=== SHEATH FORM SUBMITTED ===");
  // Don't hide result box - just update it

  const sheathMaterial = document
    .getElementById("sheathMaterial")
    .value.toLowerCase();
  console.log("Sheath material:", sheathMaterial);
  const voltageKv = parseFloat(
    document.getElementById("sheathVoltageKv").value
  );
  const I_AD_kA = parseFloat(
    document.getElementById("sheathSccKa").value
  );
  const t = parseFloat(
    document.getElementById("sheathTimeSec").value
  );
  const insulationMaterial =
    document.getElementById("insulationMaterial").value;
  const outerSheathMaterial =
    document.getElementById("outerSheathMaterial").value;
  const theta_i = parseFloat(
    document.getElementById("sheathThetaInitial").value
  );
  const theta_f = parseFloat(
    document.getElementById("sheathThetaFinal").value
  );
  // Derive configuration from sheathMaterial selection
  const sheathSelection = sheathMaterial; // already lowercased
  let configMode = "normal";
  let sheathMaterialForConstants = sheathSelection;
  if (sheathSelection === "cws_lead") {
    configMode = "cws+sheath";
    sheathMaterialForConstants = "lead";
  } else if (sheathSelection === "cws_aluminium") {
    configMode = "cws+sheath";
    sheathMaterialForConstants = "aluminium";
  } else if (sheathSelection === "cws_only") {
    configMode = "cws_only";
  } else if (sheathSelection === "iron") {
    sheathMaterialForConstants = "steel";
  }
  const Do = parseFloat(document.getElementById("sheathOuterD").value);
  const Di = parseFloat(document.getElementById("sheathInnerD").value);
  const sheathThickness = parseFloat(
    document.getElementById("sheathThickness").value
  );
  const s_given = parseFloat(
    document.getElementById("sheathAreaGiven").value
  );
  
  console.log("=== SHEATH DIAMETER VALUES ===");
  console.log("Outer Diameter (Do):", Do);
  console.log("Inner Diameter (Di):", Di);
  console.log("Thickness:", sheathThickness);
  console.log("Given Area:", s_given);
  console.log("=== END DIAMETER VALUES ===");
  
  const conductorArea = parseFloat(document.getElementById("givenConductorArea").value) || 0;
  const conductorMaterial = document.getElementById("material").value;

  const isOilFilled = "no";

  console.log("Validation check:", {configMode, sheathSelection, sheathMaterialForConstants, voltageKv, I_AD_kA, t, theta_i, theta_f, Do, Di, sheathThickness, s_given, insulationMaterial, outerSheathMaterial});

  // Branch early: if configuration includes CWS, run combined comparison and return
  if (configMode !== "normal") {
    if ([voltageKv, I_AD_kA, t, theta_i, theta_f].some(v => isNaN(v))) {
      showNotification("Please fill basic inputs.", 'warning');
      return;
    }
    if (!validateVoltageTime(voltageKv, t)) return;
    let html = "<h6 style='color: #2563eb;'>CWS & Sheath Comparison</h6><hr>";
    let results = [];
    let hasError = false;

    // Read CWS parameters (from sheath section)
    const cwsArea = parseFloat(document.getElementById("sheathCwsArea").value);
    const cwsThetaI = parseFloat(document.getElementById("sheathCwsThetaInitial").value);
    const cwsThetaF = parseFloat(document.getElementById("sheathCwsThetaFinal").value);
    const cwsWireDiameter = parseFloat(document.getElementById("sheathCwsWireDiameter").value);
    const cwsThickness = cwsWireDiameter;
    if ([cwsArea, cwsThetaI, cwsThetaF, cwsWireDiameter].some((v) => isNaN(v))) {
      showNotification("Please fill all CWS parameters.", 'warning');
      return;
    }

    const cwsAdiabatic = calculateAdiabaticCurrent(cwsArea, t, "copper", cwsThetaI, cwsThetaF, TABLE_I_CWS);
    if (!cwsAdiabatic) {
      showNotification("Could not calculate CWS adiabatic current.", 'error');
      return;
    }
    const cwsM = calculateMFactor(insulationMaterial, outerSheathMaterial, cwsThickness, "copper", voltageKv, "no", "cws");
    if (!cwsM) {
      showNotification("Could not calculate CWS M factor.", 'error');
      return;
    }
    const cwsEpsilon = calculateEpsilon(cwsM, t);
    const cwsNonAdiabatic = cwsEpsilon * cwsAdiabatic;
    results.push({
      component: "CWS (Copper Wire Screen)",
      adiabatic: cwsAdiabatic.toFixed(3),
      nonAdiabatic: cwsNonAdiabatic.toFixed(3),
      area: cwsArea.toFixed(2),
      material: "Copper"
    });

    // If configuration is cws + sheath, also compute sheath row AND store individual sheath data
    if (configMode === "cws+sheath") {
      if ([Do, Di, sheathThickness, s_given].some((v) => isNaN(v))) {
        showNotification("Please fill all sheath geometry inputs.", 'warning');
        return;
      }
      if (!(Do > Di && Do > 0 && Di > 0)) {
        showNotification("Outer diameter must be greater than inner diameter.", 'error');
        return;
      }
      const sheathAdiabatic = calculateAdiabaticCurrent(s_given, t, sheathMaterialForConstants, theta_i, theta_f, TABLE_I_SHEATHS);
      if (!sheathAdiabatic) {
        showNotification("Could not calculate sheath adiabatic current.", 'error');
        return;
      }
      const sheathM = calculateMFactor(insulationMaterial, outerSheathMaterial, sheathThickness, sheathMaterialForConstants, voltageKv, "no", "sheath");
      if (!sheathM) {
        showNotification("Could not calculate sheath M factor.", 'error');
        return;
      }
      const sheathEpsilon = calculateEpsilon(sheathM, t);
      const sheathNonAdiabatic = sheathEpsilon * sheathAdiabatic;
      results.push({
        component: `${sheathMaterialForConstants.charAt(0).toUpperCase() + sheathMaterialForConstants.slice(1)} Sheath`,
        adiabatic: sheathAdiabatic.toFixed(3),
        nonAdiabatic: sheathNonAdiabatic.toFixed(3),
        area: s_given.toFixed(2),
        material: sheathMaterial.charAt(0).toUpperCase() + sheathMaterial.slice(1)
      });

      // Store individual sheath data for traditional sheath PDF report
      const sheath = TABLE_I_SHEATHS[sheathMaterialForConstants];
      const insulation = getThermalConstants("insulating", insulationMaterial, voltageKv);
      const outerSheath = getThermalConstants("protective", outerSheathMaterial, voltageKv);
      
      sheathData = {
        voltage: voltageKv,
        conductor_area: conductorArea,
        material: conductorMaterial,
        sheath_material: sheathMaterialForConstants.charAt(0).toUpperCase() + sheathMaterialForConstants.slice(1),
        insulation: insulationMaterial,
        outer_sheath: outerSheathMaterial,
        thickness: sheathThickness.toFixed(3),
        inner_d: Di.toFixed(2),
        outer_d: Do.toFixed(2),
        sheath_area: s_given.toFixed(2),
        scc_required: I_AD_kA,
        time: t,
        theta_i: theta_i,
        theta_f: theta_f,
        beta: sheath ? sheath.beta : 228,
        k_value: sheath ? sheath.K : 148,
        i_ad: sheath ? ((sheath.K * s_given * Math.sqrt(Math.log((theta_f + sheath.beta) / (theta_i + sheath.beta)) / t)) / 1000).toFixed(3) : sheathAdiabatic.toFixed(3),
        sigma1: sheath ? sheath.sigmaC : 2500000,
        sigma2: insulation ? insulation.sigma : 2400000,
        sigma3: outerSheath ? outerSheath.sigma : 2400000,
        rho2: insulation ? insulation.rho : 3.5,
        rho3: outerSheath ? outerSheath.rho : 3.5,
        f_factor: 0.7,
        m_factor: sheathM.toFixed(3),
        epsilon: sheathEpsilon.toFixed(3),
        i_non_ad: sheath ? (sheathEpsilon * (sheath.K * s_given * Math.sqrt(Math.log((theta_f + sheath.beta) / (theta_i + sheath.beta)) / t)) / 1000).toFixed(3) : sheathNonAdiabatic.toFixed(3),
        required_area: (sheathAdiabatic * sheathEpsilon).toFixed(2)
      };
    }

    const totalAd = results.reduce((s, r) => s + parseFloat(r.adiabatic), 0);
    const totalNon = results.reduce((s, r) => s + parseFloat(r.nonAdiabatic), 0);
    html += `<h6 class="mt-2 mb-3">Calculation Results (t = ${t} s)</h6>`;
    html += `<div class="table-responsive">`;
    html += `<table class="table table-bordered table-striped">`;
    html += `<thead class="table-dark">`;
    html += `<tr><th>Component</th><th>Material</th><th>Area (mm²)</th><th>Adiabatic (1s)</th><th>Non-Adiabatic (1s)</th></tr>`;
    html += `</thead><tbody>`;
    results.forEach(result => {
      html += `<tr>`;
      html += `<td><strong>${result.component}</strong></td>`;
      html += `<td>${result.material}</td>`;
      html += `<td>${result.area}</td>`;
      html += `<td><span style="color: #2563eb; font-weight: bold;">${result.adiabatic} kA</span></td>`;
      html += `<td><span style="color: #059669; font-weight: bold;">${result.nonAdiabatic} kA</span></td>`;
      html += `</tr>`;
    });
    html += `<tr>`;
    html += `<td><strong>Total</strong></td>`;
    html += `<td></td>`;
    html += `<td></td>`;
    html += `<td><span style="color: #2563eb; font-weight: bold;">${totalAd.toFixed(3)} kA</span></td>`;
    html += `<td><span style="color: #059669; font-weight: bold;">${totalNon.toFixed(3)} kA</span></td>`;
    html += `</tr>`;
    html += `</tbody></table></div>`;

    document.getElementById("resultBox").style.display = "block";
    document.getElementById("resultText").innerHTML = html;
    document.getElementById("resultText").className = hasError ? 'results-box error' : 'results-box';
    
    // Show both download buttons for CWS combinations
    btnDownloadSheath.style.display = "inline-block"; // Traditional sheath report (for individual sheath)
    if (btnDownloadSheathWord) btnDownloadSheathWord.style.display = "inline-block";
    
    // Show CWS & Sheath combination report button
    const btnDownloadCwsSheath = document.getElementById("btnDownloadCwsSheath");
    if (btnDownloadCwsSheath) {
      btnDownloadCwsSheath.style.display = "inline-block";
    }
    
    // Mark that we have calculated both types
    sheathCalculated = true;
    updateMergedButtonVisibility();
    showNotification("CWS & Sheath comparison complete!", 'success');
    setTimeout(() => {
      const resultBox = document.getElementById("resultBox");
      if (resultBox && typeof resultBox.scrollIntoView === "function") {
        resultBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
    return;
  }
  
  if (
    !sheathMaterial ||
    [voltageKv, I_AD_kA, t, theta_i, theta_f, Do, Di, sheathThickness, s_given].some(
      (v) => isNaN(v)
    ) ||
    !insulationMaterial ||
    !outerSheathMaterial
  ) {
    console.log("Validation failed!");
    showNotification("Please fill all sheath inputs.", 'warning');
    return;
  }
  
  console.log("Validation passed, calculating...");

  if (!validateVoltageTime(voltageKv, t)) return;
  if (I_AD_kA <= 0) {
    showNotification("Short-circuit current must be positive.", 'error');
    return;
  }
  if (!(Do > Di && Do > 0 && Di > 0)) {
    showNotification("Outer diameter must be greater than inner diameter.", 'error');
    return;
  }

  const s_adiab = calculateSheathAdiabaticArea(
    I_AD_kA,
    t,
    sheathMaterial,
    theta_i,
    theta_f
  );
  if (s_adiab == null) {
    showNotification("Could not calculate adiabatic sheath area.", 'error');
    return;
  }

  const M = calculateM(
    insulationMaterial,
    outerSheathMaterial,
    sheathThickness,
    sheathMaterial,
    voltageKv,
    isOilFilled
  );
  if (M == null) {
    showNotification("Could not calculate M factor.", 'error');
    return;
  }

  const epsilon = calculateEpsilon(M, t);
  if (epsilon == null) {
    showNotification("Could not calculate ε factor.", 'error');
    return;
  }

  const s_required = s_adiab * epsilon;
  const i_non_ad = epsilon * s_adiab;

  let html = "<h6 style='color: #10b981;'>Sheath Calculation Results</h6><hr>";
  html += `<p><strong>Adiabatic area s<sub>adiab</sub>:</strong> ${s_adiab.toFixed(2)} mm²</p>`;
  html += `<p><strong>Non-adiabatic factor ε:</strong> ${epsilon.toFixed(3)}</p>`;
  html += `<p><strong>Required sheath area (non-adiabatic):</strong> <span style="font-size: 1.2rem; color: #2563eb;">${s_required.toFixed(2)} mm²</span></p>`;
  
  // Calculate and display both adiabatic and non-adiabatic currents
  const sheath = TABLE_I_SHEATHS[sheathMaterial];
  if (sheath) {
    const K_sheath = sheath.K;
    const beta_sheath = sheath.beta;
    const lnTerm_sheath = Math.log((theta_f + beta_sheath) / (theta_i + beta_sheath));
    
    // Adiabatic current using ACTUAL sheath area (from outer/inner diameter)
    const I_AD_adiabatic = K_sheath * s_given * Math.sqrt(lnTerm_sheath / t);
    html += `<p><strong>I<sub>AD</sub> Short circuit current calculated on adiabatic basis (from above calculation):</strong> <span style="font-size: 1.1rem; color: #059669;">${(I_AD_adiabatic / 1000).toFixed(3)} kA for 1 second</span></p>`;
    
    // Non-adiabatic current = ε × I_AD (correct formula)
    const I_non_adiabatic = epsilon * I_AD_adiabatic;
    html += `<p><strong>I Short circuit current calculated on non adiabatic basis as per above Eq. 2:</strong> <span style="font-size: 1.1rem; color: #059669;">${(I_non_adiabatic / 1000).toFixed(3)} kA for 1 second</span></p>`;
  }
  
  html += `<p><strong>Actual sheath area from D<sub>outer</sub>, D<sub>inner</sub>:</strong> ${s_given.toFixed(2)} mm²</p>`;

  let isUndersized = false; // Track if sheath is undersized
  if (s_given >= s_required) {
    html += '<p><strong style="color: #10b981;">Sheath size is sufficient for the required area.</strong></p>';
    showNotification("Sheath calculation passed!", 'success');
  } else {
    html += '<p><strong style="color: #ef4444;">Sheath undersized. Please choose the next available size.</strong></p>';
    showNotification("Sheath undersized - check results!", 'warning');
    isUndersized = true;
  }

  // Get thermal constants for PDF
  const insulation = getThermalConstants("insulating", insulationMaterial, voltageKv);
  const outerSheath = getThermalConstants("protective", outerSheathMaterial, voltageKv);
  
  // Store data for PDF generation with CORRECTED current values
  sheathData = {
    voltage: voltageKv,
    conductor_area: conductorArea,
    material: conductorMaterial,
    sheath_material: sheathMaterial.charAt(0).toUpperCase() + sheathMaterial.slice(1),
    insulation: insulationMaterial,
    outer_sheath: outerSheathMaterial,
    thickness: sheathThickness.toFixed(3),
    inner_d: Di.toFixed(2),
    outer_d: Do.toFixed(2),
    sheath_area: s_given.toFixed(2),
    scc_required: I_AD_kA,
    time: t,
    theta_i: theta_i,
    theta_f: theta_f,
    beta: sheath ? sheath.beta : 228,
    k_value: sheath ? sheath.K : 148,
    // Use CORRECTED current values calculated with actual sheath area
    i_ad: sheath ? ((sheath.K * s_given * Math.sqrt(Math.log((theta_f + sheath.beta) / (theta_i + sheath.beta)) / t)) / 1000).toFixed(3) : s_adiab.toFixed(3),
    sigma1: sheath ? sheath.sigmaC : 2500000,
    sigma2: insulation ? insulation.sigma : 2400000,
    sigma3: outerSheath ? outerSheath.sigma : 2400000,
    rho2: insulation ? insulation.rho : 3.5,
    rho3: outerSheath ? outerSheath.rho : 3.5,
    f_factor: 0.7,
    m_factor: M.toFixed(3),
    epsilon: epsilon.toFixed(3),
    // Use CORRECTED non-adiabatic current: ε × I_AD (using actual area)
    i_non_ad: sheath ? (epsilon * (sheath.K * s_given * Math.sqrt(Math.log((theta_f + sheath.beta) / (theta_i + sheath.beta)) / t)) / 1000).toFixed(3) : i_non_ad.toFixed(3),
    required_area: s_required.toFixed(2),
    i_ad_required_area: sheath ? ((sheath.K * s_required * Math.sqrt(Math.log((theta_f + sheath.beta) / (theta_i + sheath.beta)) / t)) / 1000).toFixed(3) : null
  };

  console.log("=== SHEATH DATA FOR PDF ===");
  console.log("inner_d:", sheathData.inner_d);
  console.log("outer_d:", sheathData.outer_d);
  console.log("thickness:", sheathData.thickness);
  console.log("sheath_area:", sheathData.sheath_area);
  console.log("=== END SHEATH DATA ===");

  console.log("Calculation complete, showing result");
  console.log("HTML to display:", html.substring(0, 100) + "...");
  sheathCalculated = true;
  btnDownloadSheath.style.display = "inline-block";
  if (btnDownloadSheathWord) btnDownloadSheathWord.style.display = "inline-block";
  updateMergedButtonVisibility();
  console.log("About to call showResult");
  showResult(html, isUndersized); // Pass error flag if undersized
  console.log("=== SHEATH CALCULATION COMPLETE ===");
});

// =============== PDF DOWNLOAD HANDLERS ===============
function updateMergedButtonVisibility() {
  // Show complete report button after PDF extraction (not requiring both calculations)
  if (btnDownloadMerged && uploadedPdfUrl) {
    btnDownloadMerged.style.display = "inline-block";
  }
}

btnDownloadConductor.addEventListener("click", async () => {
  if (!conductorData) {
    showNotification("Please calculate conductor first.", 'warning');
    return;
  }
  
  try {
    const response = await fetch("/api/generate_conductor_pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(conductorData)
    });
    
    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Conductor_Calculation_Report.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    showNotification("Conductor report downloaded!", 'success');
  } catch (error) {
    console.error(error);
    showNotification("Failed to generate conductor PDF", 'error');
  }
});
if (btnDownloadConductorWord) {
  btnDownloadConductorWord.addEventListener("click", async () => {
    if (!conductorData) {
      showNotification("Please calculate conductor first.", 'warning');
      return;
    }
    try {
      const response = await fetch("/api/generate_conductor_word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conductorData)
      });
      if (!response.ok) throw new Error("Failed to generate Word");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Conductor_Calculation_Report.docx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showNotification("Conductor Word report downloaded!", 'success');
    } catch (error) {
      console.error(error);
      showNotification("Failed to generate conductor Word", 'error');
    }
  });
}

btnDownloadSheath.addEventListener("click", async () => {
  if (!sheathData) {
    showNotification("Please calculate sheath first.", 'warning');
    return;
  }
  
  console.log("Sending sheath data:", sheathData);
  
  try {
    const response = await fetch("/api/generate_sheath_pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(sheathData)
    });
    
    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Sheath_Calculation_Report.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    showNotification("Sheath report downloaded!", 'success');
  } catch (error) {
    console.error(error);
    showNotification("Failed to generate sheath PDF", 'error');
  }
});
if (btnDownloadSheathWord) {
  btnDownloadSheathWord.addEventListener("click", async () => {
    if (!sheathData) {
      showNotification("Please calculate sheath first.", 'warning');
      return;
    }
    try {
      const response = await fetch("/api/generate_sheath_word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sheathData)
      });
      if (!response.ok) throw new Error("Failed to generate Word");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Sheath_Calculation_Report.docx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showNotification("Sheath Word report downloaded!", 'success');
    } catch (error) {
      console.error(error);
      showNotification("Failed to generate sheath Word", 'error');
    }
  });
}

// CWS & Sheath combination download handler
const btnDownloadCwsSheath = document.getElementById("btnDownloadCwsSheath");
if (btnDownloadCwsSheath) {
  btnDownloadCwsSheath.addEventListener("click", async () => {
    // For CWS combinations, we need to collect the data from the current calculation
    const sheathMaterial = document.getElementById("sheathMaterial").value.toLowerCase();
    const configMode = sheathMaterial.includes("cws_only") ? "cws_only" : (sheathMaterial.startsWith("cws_") ? "cws+sheath" : "normal");
    
    if (configMode === "normal") {
      showNotification("CWS & Sheath report is only available for CWS combinations.", 'warning');
      return;
    }

    // Collect current calculation data
    const voltageKv = parseFloat(document.getElementById("sheathVoltageKv").value);
    const t = parseFloat(document.getElementById("sheathTimeSec").value);
    const conductorArea = parseFloat(document.getElementById("givenConductorArea").value) || 0;
    
    let cwsSheathData = {
      voltage: voltageKv,
      conductor_area: conductorArea,
      time: t,
      cws_results: null,
      sheath_results: null
    };

    // Add CWS data if present
    if (configMode.includes("cws")) {
      const cwsArea = parseFloat(document.getElementById("sheathCwsArea").value);
      const cwsThetaI = parseFloat(document.getElementById("sheathCwsThetaInitial").value);
      const cwsThetaF = parseFloat(document.getElementById("sheathCwsThetaFinal").value);
      const cwsWireDiameter = parseFloat(document.getElementById("sheathCwsWireDiameter").value);
      
      if (!isNaN(cwsArea) && !isNaN(cwsThetaI) && !isNaN(cwsThetaF) && !isNaN(cwsWireDiameter)) {
        const cwsAdiabatic = calculateAdiabaticCurrent(cwsArea, t, "copper", cwsThetaI, cwsThetaF, TABLE_I_CWS);
        const insulationMaterial = document.getElementById("insulationMaterial").value;
        const outerSheathMaterial = document.getElementById("outerSheathMaterial").value;
        const cwsM = calculateMFactor(insulationMaterial, outerSheathMaterial, cwsWireDiameter, "copper", voltageKv, "no", "cws");
        const cwsEpsilon = calculateEpsilon(cwsM, t);
        const cwsNonAdiabatic = cwsEpsilon * cwsAdiabatic;

        cwsSheathData.cws_results = {
          area: cwsArea.toFixed(2),
          thickness: cwsWireDiameter.toFixed(2),
          theta_i: cwsThetaI.toString(),
          theta_f: cwsThetaF.toString(),
          k_value: "226",
          beta: "234.5",
          sigma_c: "3.45E+06",
          rho20: "1.7241E-08",
          i_ad: cwsAdiabatic.toFixed(3),
          i_non_ad: cwsNonAdiabatic.toFixed(3),
          epsilon: cwsEpsilon.toFixed(3),
          m_factor: cwsM.toFixed(4),
          p_factor: (cwsM * Math.sqrt(t)).toFixed(3),
          earth_fault_current: (cwsAdiabatic * 1.025).toFixed(2)
        };
      }
    }

    // Add sheath data if present
    if (configMode === "cws+sheath") {
      const sheathMaterialForConstants = sheathMaterial === "cws_lead" ? "lead" : "aluminium";
      const sheathOuterD = parseFloat(document.getElementById("sheathOuterD").value);
      const sheathInnerD = parseFloat(document.getElementById("sheathInnerD").value);
      const sheathArea = parseFloat(document.getElementById("sheathAreaGiven").value);
      const sheathThetaI = parseFloat(document.getElementById("sheathThetaInitial").value);
      const sheathThetaF = parseFloat(document.getElementById("sheathThetaFinal").value);
      const sheathThickness = parseFloat(document.getElementById("sheathThickness").value);
      
      if (!isNaN(sheathArea) && !isNaN(sheathThetaI) && !isNaN(sheathThetaF) && !isNaN(sheathThickness)) {
        const sheathAdiabatic = calculateAdiabaticCurrent(sheathArea, t, sheathMaterialForConstants, sheathThetaI, sheathThetaF, TABLE_I_SHEATHS);
        const insulationMaterial = document.getElementById("insulationMaterial").value;
        const outerSheathMaterial = document.getElementById("outerSheathMaterial").value;
        const sheathM = calculateMFactor(insulationMaterial, outerSheathMaterial, sheathThickness, sheathMaterialForConstants, voltageKv, "no", "sheath");
        const sheathEpsilon = calculateEpsilon(sheathM, t);
        const sheathNonAdiabatic = sheathEpsilon * sheathAdiabatic;
        const sheathConstants = TABLE_I_SHEATHS[sheathMaterialForConstants];

        cwsSheathData.sheath_results = {
          material: sheathMaterialForConstants.charAt(0).toUpperCase() + sheathMaterialForConstants.slice(1),
          area: sheathArea.toFixed(2),
          thickness: sheathThickness.toFixed(2),
          theta_i: sheathThetaI.toString(),
          theta_f: sheathThetaF.toString(),
          k_value: sheathConstants.K.toString(),
          beta: sheathConstants.beta.toString(),
          sigma_c: sheathConstants.sigmaC.toExponential(2),
          rho20: sheathConstants.rho20.toExponential(2),
          i_ad: sheathAdiabatic.toFixed(3),
          i_non_ad: sheathNonAdiabatic.toFixed(3),
          epsilon: sheathEpsilon.toFixed(3),
          m_factor: sheathM.toFixed(4),
          p_factor: (sheathM * Math.sqrt(t)).toFixed(3),
          earth_fault_current: (sheathAdiabatic * 0.48).toFixed(2)
        };
      }
    }

    try {
      const response = await fetch("/api/generate_cws_sheath_pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cwsSheathData)
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "CWS_Sheath_Combination_Report.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showNotification("CWS & Sheath combination report downloaded!", 'success');
    } catch (error) {
      console.error(error);
      showNotification("Failed to generate CWS & Sheath PDF: " + error.message, 'error');
    }
  });
}

if (btnDownloadMerged) {
  btnDownloadMerged.addEventListener("click", async () => {
    // Send calculation data to backend so it can generate reports on-demand
    const requestData = {
      conductorData: conductorData,  // Will be null if not calculated
      sheathData: sheathData        // Will be null if not calculated
    };
    
    console.log("Sending calculation data for complete report:", requestData);
    
    try {
      const response = await fetch("/api/generate_merged_pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate merged PDF");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Complete_Cable_Analysis_Report.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showNotification("Complete report downloaded!", 'success');
    } catch (error) {
      console.error(error);
      showNotification(error.message || "Failed to generate merged PDF", 'error');
    }
  });
}

// =============== RESET BUTTON ===============
btnReset.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset all fields?")) {
    window.location.reload();
  }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// =============== MANUAL INTERFACE FUNCTIONALITY ===============

// Manual sheath geometry calculation
function updateManualSheathGeometry() {
  const DoInput = document.getElementById("manualSheathOuterD");
  const DiInput = document.getElementById("manualSheathInnerD");
  const thicknessEl = document.getElementById("manualSheathThickness");
  const areaEl = document.getElementById("manualSheathAreaGiven");

  const Do = parseFloat(DoInput.value);
  const Di = parseFloat(DiInput.value);

  if (!isNaN(Do) && !isNaN(Di) && Do > 0 && Di > 0 && Do > Di) {
    const delta = (Do - Di) / 2;
    const area = (Math.PI / 4) * (Do * Do - Di * Di);
    thicknessEl.value = delta.toFixed(3);
    areaEl.value = area.toFixed(2);
  } else {
    thicknessEl.value = "";
    areaEl.value = "";
  }
}

// Manual geometry event listeners
document.getElementById("manualSheathOuterD").addEventListener("input", updateManualSheathGeometry);
document.getElementById("manualSheathInnerD").addEventListener("input", updateManualSheathGeometry);

// Auto-fill K and β values when material is selected in manual mode
document.getElementById("manualMaterial").addEventListener("change", (e) => {
  const material = e.target.value.toLowerCase();
  const kValueInput = document.getElementById("manualKValue");
  const betaInput = document.getElementById("manualBeta");
  
  if (material === "copper") {
    kValueInput.value = 226;
    betaInput.value = 234.5;
    showNotification("Auto-filled K and β values for Copper", 'success');
  } else if (material === "aluminium") {
    kValueInput.value = 148;
    betaInput.value = 228;
    showNotification("Auto-filled K and β values for Aluminium", 'success');
  } else {
    kValueInput.value = "";
    betaInput.value = "";
  }
});

// Auto-fill K and β values for sheath material in manual mode
document.getElementById("manualSheathMaterial").addEventListener("change", (e) => {
  const sheathMaterial = e.target.value.toLowerCase();
  
  // Get sheath material constants from TABLE_I_SHEATHS
  const sheathConstants = {
    lead: { K: 41, beta: 230 },
    steel: { K: 78, beta: 202 },
    bronze: { K: 180, beta: 313 },
    aluminium: { K: 148, beta: 228 }
  };
  
  if (sheathConstants[sheathMaterial]) {
    // Note: Sheath calculations use their own K and β values internally
    // This is just for user reference/information
    showNotification(`Sheath material selected: ${sheathMaterial.charAt(0).toUpperCase() + sheathMaterial.slice(1)} (K=${sheathConstants[sheathMaterial].K}, β=${sheathConstants[sheathMaterial].beta})`, 'info');
  }
});

// Auto-fill K and β values for PDF extraction mode - conductor material
const conductorMaterialSelect = document.getElementById("material");
if (conductorMaterialSelect) {
  conductorMaterialSelect.addEventListener("change", (e) => {
    const material = e.target.value.toLowerCase();
    const kValueInput = document.getElementById("kValue");
    const betaInput = document.getElementById("beta");
    
    if (material === "copper") {
      kValueInput.value = 226;
      betaInput.value = 234.5;
      showNotification("Auto-filled K and β values for Copper", 'success');
    } else if (material === "aluminium") {
      kValueInput.value = 148;
      betaInput.value = 228;
      showNotification("Auto-filled K and β values for Aluminium", 'success');
    } else {
      kValueInput.value = "";
      betaInput.value = "";
    }
  });
}

// Auto-fill notification for PDF extraction mode - sheath material
const sheathMaterialSelect = document.getElementById("sheathMaterial");
if (sheathMaterialSelect) {
  sheathMaterialSelect.addEventListener("change", (e) => {
    const sheathMaterial = e.target.value.toLowerCase();
    
    const sheathConstants = {
      lead: { K: 41, beta: 230 },
      steel: { K: 78, beta: 202 },
      bronze: { K: 180, beta: 313 },
      aluminium: { K: 148, beta: 228 }
    };
    
    if (sheathConstants[sheathMaterial]) {
      showNotification(`Sheath material selected: ${sheathMaterial.charAt(0).toUpperCase() + sheathMaterial.slice(1)} (K=${sheathConstants[sheathMaterial].K}, β=${sheathConstants[sheathMaterial].beta})`, 'info');
    }
  });
}

// Manual conductor form handler
document.getElementById("manualConductorForm").addEventListener("submit", (e) => {
  e.preventDefault();
  
  const mode = document.getElementById("manualConductorMode").value;
  const voltageKv = parseFloat(document.getElementById("manualVoltageKv").value);
  const I_AD_kA = parseFloat(document.getElementById("manualSccKa").value);
  const t = parseFloat(document.getElementById("manualTimeSec").value);
  const K = parseFloat(document.getElementById("manualKValue").value);
  const beta = parseFloat(document.getElementById("manualBeta").value);
  const material = document.getElementById("manualMaterial").value;
  const theta_i = parseFloat(document.getElementById("manualThetaInitial").value);
  const theta_f = parseFloat(document.getElementById("manualThetaFinal").value);
  const S_given_str = document.getElementById("manualGivenConductorArea").value;

  if ([voltageKv, t, K, beta].some((v) => isNaN(v))) {
    showNotification("Please fill all conductor inputs.", 'warning');
    return;
  }
  if (!validateVoltageTime(voltageKv, t)) return;

  let html = "<h6 style='color: #2563eb;'>Manual Conductor Calculation Results</h6><hr>";
  let isUndersized = false; // Declare at function level

  if (mode === "area-from-current") {
    const lnTerm = Math.log((theta_f + beta) / (theta_i + beta));
    const I_AD_A = I_AD_kA * 1000;
    const S_sq = (I_AD_A ** 2 * t) / (K ** 2 * lnTerm);
    const S_required = Math.sqrt(S_sq);

    html += `<p><strong>Required cross-sectional area S:</strong> <span style="font-size: 1.2rem; color: #2563eb;">${S_required.toFixed(2)} mm²</span></p>`;

    // Calculate I_AD for the calculated area
    const I_AD_for_calculated_area = K * S_required * Math.sqrt(lnTerm / t);
    html += `<p><strong>Maximum current carrying capacity for calculated area:</strong> <span style="font-size: 1.1rem; color: #059669;">${(I_AD_for_calculated_area / 1000).toFixed(2)} kA</span></p>`;

    const S_given = S_given_str !== "" ? parseFloat(S_given_str) : S_required;
    
    // Calculate I_AD for given area (always calculate, even if same as required)
    const I_AD_given_area = K * S_given * Math.sqrt(lnTerm / t);
    
    if (S_given_str !== "") {
      // Display current carrying capacity for given area
      html += `<p><strong>Maximum current carrying capacity for given area (${S_given.toFixed(2)} mm²):</strong> <span style="font-size: 1.1rem; color: #059669;">${(I_AD_given_area / 1000).toFixed(2)} kA</span></p>`;
      
      if (S_given >= S_required) {
        html += '<p><strong style="color: #10b981;">Cable size is sufficient for the required area.</strong></p>';
      } else {
        html += '<p><strong style="color: #ef4444;">Cable undersized. Please choose the next available size.</strong></p>';
        isUndersized = true;
      }
    }

    manualConductorData = {
      voltage: voltageKv,
      area: S_given,
      material: material,
      scc_required: I_AD_kA,
      time: t,
      theta_i: theta_i,
      theta_f: theta_f,
      beta: beta,
      k_value: K,
      i_ad_calculated_area: (I_AD_for_calculated_area / 1000).toFixed(3),
      calculated_area: S_required.toFixed(2),
      i_ad_given_area: (I_AD_given_area / 1000).toFixed(3)
    };
  } else if (mode === "current-from-area") {
    const lnTerm = Math.log((theta_f + beta) / (theta_i + beta));
    const S_given = parseFloat(S_given_str);
    if (isNaN(S_given)) {
      showNotification("Please enter the given conductor area.", 'warning');
      return;
    }
    const I_AD_A = K * S_given * Math.sqrt(lnTerm / t);
    const I_AD_kA_calc = I_AD_A / 1000;
    html += `<p><strong>Maximum current carrying capacity for given area (${S_given.toFixed(2)} mm²):</strong> <span style="font-size: 1.1rem; color: #059669;">${I_AD_kA_calc.toFixed(2)} kA</span></p>`;
    if (!isNaN(I_AD_kA)) {
      if (I_AD_kA_calc >= I_AD_kA) {
        html += '<p><strong style="color: #10b981;">Cable size is sufficient for the required current.</strong></p>';
      } else {
        html += '<p><strong style="color: #ef4444;">Cable undersized. Please choose the next available size.</strong></p>';
        isUndersized = true;
      }
    }
    manualConductorData = {
      voltage: voltageKv,
      area: S_given,
      material: material,
      scc_required: isNaN(I_AD_kA) ? "" : I_AD_kA,
      time: t,
      theta_i: theta_i,
      theta_f: theta_f,
      beta: beta,
      k_value: K,
      i_ad_given_area: I_AD_kA_calc.toFixed(3)
    };
  }

  document.getElementById("manualResultBox").style.display = "block";
  const manualResultText = document.getElementById("manualResultText");
  manualResultText.innerHTML = html;
  // Apply error styling if undersized
  manualResultText.className = isUndersized ? 'results-box error' : 'results-box';
  document.getElementById("btnDownloadManualConductor").style.display = "inline-block";
  if (document.getElementById("btnDownloadManualConductorWord")) document.getElementById("btnDownloadManualConductorWord").style.display = "inline-block";
  showNotification("Manual conductor calculation complete!", 'success');
  
  // Scroll to results
  setTimeout(() => {
    const resultBox = document.getElementById("manualResultBox");
    if (resultBox && typeof resultBox.scrollIntoView === "function") {
      resultBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100);
});

// Manual sheath form handler
document.getElementById("manualSheathForm").addEventListener("submit", (e) => {
  e.preventDefault();
  
  const sheathMaterialRaw = document.getElementById("manualSheathMaterial").value.toLowerCase();
  const sheathMaterial = sheathMaterialRaw;
  const voltageKv = parseFloat(document.getElementById("manualSheathVoltageKv").value);
  const I_AD_kA = parseFloat(document.getElementById("manualSheathSccKa").value);
  const t = parseFloat(document.getElementById("manualSheathTimeSec").value);
  const insulationMaterial = document.getElementById("manualInsulationMaterial").value;
  const outerSheathMaterial = document.getElementById("manualOuterSheathMaterial").value;
  const theta_i = parseFloat(document.getElementById("manualSheathThetaInitial").value);
  const theta_f = parseFloat(document.getElementById("manualSheathThetaFinal").value);
  const Do = parseFloat(document.getElementById("manualSheathOuterD").value);
  const Di = parseFloat(document.getElementById("manualSheathInnerD").value);
  const sheathThickness = parseFloat(document.getElementById("manualSheathThickness").value);
  const s_given = parseFloat(document.getElementById("manualSheathAreaGiven").value);

  const manualMode = sheathMaterialRaw.includes("cws_only") ? "cws_only" : (sheathMaterialRaw.startsWith("cws_") ? "cws+sheath" : "normal");
  const sheathMaterialForConstants = sheathMaterialRaw === "cws_lead" ? "lead" : (sheathMaterialRaw === "cws_aluminium" ? "aluminium" : sheathMaterialRaw);

  if (manualMode !== "normal") {
    if ([voltageKv, I_AD_kA, t].some((v) => isNaN(v))) {
      showNotification("Please fill voltage, current and time.", 'warning');
      return;
    }
    if (!validateVoltageTime(voltageKv, t)) return;
    let html = "<h6 style='color: #2563eb;'>CWS & Sheath Comparison</h6><hr>";
    let results = [];
    const cwsArea = parseFloat(document.getElementById("manualCwsArea").value);
    const cwsThetaI = parseFloat(document.getElementById("manualCwsThetaInitial").value);
    const cwsThetaF = parseFloat(document.getElementById("manualCwsThetaFinal").value);
    const cwsWireDiameter = parseFloat(document.getElementById("manualCwsWireDiameter").value);
    const cwsThickness = cwsWireDiameter;
    if ([cwsArea, cwsThetaI, cwsThetaF, cwsWireDiameter].some((v) => isNaN(v))) {
      showNotification("Please fill all CWS parameters.", 'warning');
      return;
    }
    const cwsAdiabatic = calculateAdiabaticCurrent(cwsArea, t, "copper", cwsThetaI, cwsThetaF, TABLE_I_CWS);
    const cwsM = calculateMFactor(insulationMaterial, outerSheathMaterial, cwsThickness, "copper", voltageKv, "no", "cws");
    if (!cwsAdiabatic || !cwsM) {
      showNotification("CWS calculation failed. Check inputs.", 'error');
      return;
    }
    const cwsEpsilon = calculateEpsilon(cwsM, t);
    const cwsNonAdiabatic = cwsEpsilon * cwsAdiabatic;
    results.push({
      component: "CWS (Copper Wire Screen)",
      adiabatic: cwsAdiabatic.toFixed(3),
      nonAdiabatic: cwsNonAdiabatic.toFixed(3),
      area: cwsArea.toFixed(2),
      material: "Copper"
    });
    if (manualMode === "cws+sheath") {
      if ([Do, Di, sheathThickness, s_given, theta_i, theta_f].some((v) => isNaN(v))) {
        showNotification("Please fill all sheath geometry and temperature.", 'warning');
        return;
      }
      if (!(Do > Di && Do > 0 && Di > 0)) {
        showNotification("Outer diameter must be greater than inner diameter.", 'error');
        return;
      }
      const sheathAdiabatic = calculateAdiabaticCurrent(s_given, t, sheathMaterialForConstants, theta_i, theta_f, TABLE_I_SHEATHS);
      const sheathM = calculateMFactor(insulationMaterial, outerSheathMaterial, sheathThickness, sheathMaterialForConstants, voltageKv, "no", "sheath");
      if (!sheathAdiabatic || !sheathM) {
        showNotification("Sheath calculation failed. Check inputs.", 'error');
        return;
      }
      const sheathEpsilon = calculateEpsilon(sheathM, t);
      const sheathNonAdiabatic = sheathEpsilon * sheathAdiabatic;
      results.push({
        component: `${sheathMaterialForConstants.charAt(0).toUpperCase() + sheathMaterialForConstants.slice(1)} Sheath`,
        adiabatic: sheathAdiabatic.toFixed(3),
        nonAdiabatic: sheathNonAdiabatic.toFixed(3),
        area: s_given.toFixed(2),
        material: sheathMaterialForConstants.charAt(0).toUpperCase() + sheathMaterialForConstants.slice(1)
      });

      // Store individual sheath data for traditional sheath PDF report
      const sheath = TABLE_I_SHEATHS[sheathMaterialForConstants];
      const insulation = getThermalConstants("insulating", insulationMaterial, voltageKv);
      const outerSheath = getThermalConstants("protective", outerSheathMaterial, voltageKv);
      
      manualSheathData = {
        voltage: voltageKv,
        conductor_area: 0, // Not available in manual mode
        material: "N/A", // Not available in manual mode
        sheath_material: sheathMaterialForConstants.charAt(0).toUpperCase() + sheathMaterialForConstants.slice(1),
        insulation: insulationMaterial,
        outer_sheath: outerSheathMaterial,
        thickness: sheathThickness.toFixed(3),
        inner_d: Di.toFixed(2),
        outer_d: Do.toFixed(2),
        sheath_area: s_given.toFixed(2),
        scc_required: I_AD_kA,
        time: t,
        theta_i: theta_i,
        theta_f: theta_f,
        beta: sheath ? sheath.beta : 228,
        k_value: sheath ? sheath.K : 148,
        i_ad: sheath ? ((sheath.K * s_given * Math.sqrt(Math.log((theta_f + sheath.beta) / (theta_i + sheath.beta)) / t)) / 1000).toFixed(3) : sheathAdiabatic.toFixed(3),
        sigma1: sheath ? sheath.sigmaC : 2500000,
        sigma2: insulation ? insulation.sigma : 2400000,
        sigma3: outerSheath ? outerSheath.sigma : 2400000,
        rho2: insulation ? insulation.rho : 3.5,
        rho3: outerSheath ? outerSheath.rho : 3.5,
        f_factor: 0.7,
        m_factor: sheathM.toFixed(3),
        epsilon: sheathEpsilon.toFixed(3),
        i_non_ad: sheath ? (sheathEpsilon * (sheath.K * s_given * Math.sqrt(Math.log((theta_f + sheath.beta) / (theta_i + sheath.beta)) / t)) / 1000).toFixed(3) : sheathNonAdiabatic.toFixed(3),
        required_area: (sheathAdiabatic * sheathEpsilon).toFixed(2)
      };
    }
    const totalAd = results.reduce((s, r) => s + parseFloat(r.adiabatic), 0);
    const totalNon = results.reduce((s, r) => s + parseFloat(r.nonAdiabatic), 0);
    html += `<h6 class="mt-2 mb-3">Calculation Results (t = ${t} s)</h6><div class="table-responsive"><table class="table table-bordered table-striped"><thead class="table-dark"><tr><th>Component</th><th>Material</th><th>Area (mm²)</th><th>Adiabatic (1s)</th><th>Non-Adiabatic (1s)</th></tr></thead><tbody>`;
    results.forEach(result => {
      html += `<tr><td><strong>${result.component}</strong></td><td>${result.material}</td><td>${result.area}</td><td><span style="color:#2563eb;font-weight:bold;">${result.adiabatic} kA</span></td><td><span style="color:#059669;font-weight:bold;">${result.nonAdiabatic} kA</span></td></tr>`;
    });
    html += `<tr><td><strong>Total</strong></td><td></td><td></td><td><span style="color:#2563eb;font-weight:bold;">${totalAd.toFixed(3)} kA</span></td><td><span style="color:#059669;font-weight:bold;">${totalNon.toFixed(3)} kA</span></td></tr>`;
    html += `</tbody></table></div>`;
    document.getElementById("manualResultBox").style.display = "block";
    const manualResultText = document.getElementById("manualResultText");
    manualResultText.innerHTML = html;
    manualResultText.className = 'results-box';
    
    // Show both download buttons for CWS combinations
    document.getElementById("btnDownloadManualSheath").style.display = "inline-block"; // Traditional sheath report (for individual sheath)
    if (document.getElementById("btnDownloadManualSheathWord")) document.getElementById("btnDownloadManualSheathWord").style.display = "inline-block";
    
    // Show CWS & Sheath combination report button for manual mode
    const btnDownloadManualCwsSheath = document.getElementById("btnDownloadManualCwsSheath");
    if (btnDownloadManualCwsSheath && manualMode !== "normal") {
      btnDownloadManualCwsSheath.style.display = "inline-block";
    }
    
    showNotification("Manual CWS & Sheath comparison complete!", 'success');
    setTimeout(() => {
      const resultBox = document.getElementById("manualResultBox");
      if (resultBox && typeof resultBox.scrollIntoView === "function") {
        resultBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
    return;
  }

  if (!sheathMaterial || [voltageKv, I_AD_kA, t, theta_i, theta_f, Do, Di, sheathThickness, s_given].some((v) => isNaN(v))) {
    showNotification("Please fill all sheath inputs.", 'warning');
    return;
  }

  if (!validateVoltageTime(voltageKv, t)) return;

  const s_adiab = calculateSheathAdiabaticArea(I_AD_kA, t, sheathMaterial, theta_i, theta_f);
  const M = calculateM(insulationMaterial, outerSheathMaterial, sheathThickness, sheathMaterial, voltageKv, "no");
  const epsilon = calculateEpsilon(M, t);
  const s_required = s_adiab * epsilon;

  let html = "<h6 style='color: #10b981;'>Manual Sheath Calculation Results</h6><hr>";
  html += `<p><strong>Adiabatic area s<sub>adiab</sub>:</strong> ${s_adiab.toFixed(2)} mm²</p>`;
  html += `<p><strong>Non-adiabatic factor ε:</strong> ${epsilon.toFixed(3)}</p>`;
  html += `<p><strong>Required sheath area (non-adiabatic):</strong> <span style="font-size: 1.2rem; color: #2563eb;">${s_required.toFixed(2)} mm²</span></p>`;
  
  // Calculate and display both adiabatic and non-adiabatic currents using ACTUAL sheath area
  const sheath = TABLE_I_SHEATHS[sheathMaterial];
  if (sheath) {
    const K_sheath = sheath.K;
    const beta_sheath = sheath.beta;
    const lnTerm_sheath = Math.log((theta_f + beta_sheath) / (theta_i + beta_sheath));
    
    // Adiabatic current using ACTUAL sheath area (from outer/inner diameter)
    const I_AD_adiabatic = K_sheath * s_given * Math.sqrt(lnTerm_sheath / t);
    html += `<p><strong>I<sub>AD</sub> Short circuit current calculated on adiabatic basis (from above calculation):</strong> <span style="font-size: 1.1rem; color: #059669;">${(I_AD_adiabatic / 1000).toFixed(3)} kA for 1 second</span></p>`;
    
    // Non-adiabatic current = ε × I_AD (correct formula)
    const I_non_adiabatic = epsilon * I_AD_adiabatic;
    html += `<p><strong>I Short circuit current calculated on non adiabatic basis as per above Eq. 2:</strong> <span style="font-size: 1.1rem; color: #059669;">${(I_non_adiabatic / 1000).toFixed(3)} kA for 1 second</span></p>`;
  }
  
  html += `<p><strong>Actual sheath area:</strong> ${s_given.toFixed(2)} mm²</p>`;

  let isUndersized = false; // Track if sheath is undersized
  if (s_given >= s_required) {
    html += '<p><strong style="color: #10b981;">Sheath size is sufficient for the required area.</strong></p>';
  } else {
    html += '<p><strong style="color: #ef4444;">Sheath undersized. Please choose the next available size.</strong></p>';
    isUndersized = true;
  }

  manualSheathData = {
    voltage: voltageKv,
    sheath_material: sheathMaterial.charAt(0).toUpperCase() + sheathMaterial.slice(1),
    thickness: sheathThickness.toFixed(3),
    inner_d: Di.toFixed(2),
    outer_d: Do.toFixed(2),
    sheath_area: s_given.toFixed(2),
    scc_required: I_AD_kA,
    time: t,
    theta_i: theta_i,
    theta_f: theta_f,
    beta: sheath ? sheath.beta : 228,
    k_value: sheath ? sheath.K : 148,
    // Use CORRECTED current values calculated with actual sheath area
    i_ad: sheath ? ((sheath.K * s_given * Math.sqrt(Math.log((theta_f + sheath.beta) / (theta_i + sheath.beta)) / t)) / 1000).toFixed(3) : null,
    // Use CORRECTED non-adiabatic current: ε × I_AD (using actual area)
    i_non_ad: sheath ? (epsilon * (sheath.K * s_given * Math.sqrt(Math.log((theta_f + sheath.beta) / (theta_i + sheath.beta)) / t)) / 1000).toFixed(3) : null,
    required_area: s_required.toFixed(2),
    i_ad_required_area: sheath ? ((sheath.K * s_required * Math.sqrt(Math.log((theta_f + sheath.beta) / (theta_i + sheath.beta)) / t)) / 1000).toFixed(3) : null
  };

  document.getElementById("manualResultBox").style.display = "block";
  const manualResultText = document.getElementById("manualResultText");
  manualResultText.innerHTML = html;
  // Apply error styling if undersized
  manualResultText.className = isUndersized ? 'results-box error' : 'results-box';
  document.getElementById("btnDownloadManualSheath").style.display = "inline-block";
  if (document.getElementById("btnDownloadManualSheathWord")) document.getElementById("btnDownloadManualSheathWord").style.display = "inline-block";
  showNotification("Manual sheath calculation complete!", 'success');
  
  // Scroll to results
  setTimeout(() => {
    const resultBox = document.getElementById("manualResultBox");
    if (resultBox && typeof resultBox.scrollIntoView === "function") {
      resultBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100);
});

// Manual reset button
document.getElementById("btnResetManual").addEventListener("click", () => {
  if (confirm("Are you sure you want to reset all manual fields?")) {
    document.getElementById("manualConductorForm").reset();
    document.getElementById("manualSheathForm").reset();
    document.getElementById("manualResultBox").style.display = "none";
    document.getElementById("btnDownloadManualConductor").style.display = "none";
    document.getElementById("btnDownloadManualSheath").style.display = "none";
    if (document.getElementById("btnDownloadManualConductorWord")) document.getElementById("btnDownloadManualConductorWord").style.display = "none";
    if (document.getElementById("btnDownloadManualSheathWord")) document.getElementById("btnDownloadManualSheathWord").style.display = "none";
    manualConductorData = null;
    manualSheathData = null;
  }
});

// Manual dropdown button for conductor mode
const manualConductorModeDropdownBtn = document.getElementById("manualConductorModeDropdownBtn");
const manualConductorModeSelect = document.getElementById("manualConductorMode");
if (manualConductorModeDropdownBtn && manualConductorModeSelect) {
  manualConductorModeDropdownBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    manualConductorModeSelect.blur();
  });
}

// Manual download button handlers
document.getElementById("btnDownloadManualConductor").addEventListener("click", async () => {
  if (!manualConductorData) {
    showNotification("Please calculate conductor first.", 'warning');
    return;
  }
  
  try {
    const response = await fetch("/api/generate_conductor_pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(manualConductorData)
    });
    
    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Manual_Conductor_Calculation_Report.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    showNotification("Manual conductor report downloaded!", 'success');
  } catch (error) {
    console.error(error);
    showNotification("Failed to generate manual conductor PDF", 'error');
  }
});
const btnDownloadManualConductorWord = document.getElementById("btnDownloadManualConductorWord");
if (btnDownloadManualConductorWord) {
  btnDownloadManualConductorWord.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/generate_conductor_word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualConductorData)
      });
      if (!response.ok) throw new Error("Failed to generate Word");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Conductor_Calculation_Report.docx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showNotification("Conductor Word report downloaded!", 'success');
    } catch (error) {
      console.error(error);
      showNotification("Failed to generate conductor Word", 'error');
    }
  });
}

document.getElementById("btnDownloadManualSheath").addEventListener("click", async () => {
  if (!manualSheathData) {
    showNotification("Please calculate sheath first.", 'warning');
    return;
  }
  
  try {
    const response = await fetch("/api/generate_sheath_pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(manualSheathData)
    });
    
    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Manual_Sheath_Calculation_Report.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    showNotification("Manual sheath report downloaded!", 'success');
  } catch (error) {
    console.error(error);
    showNotification("Failed to generate manual sheath PDF", 'error');
  }
});
const btnDownloadManualSheathWord = document.getElementById("btnDownloadManualSheathWord");
if (btnDownloadManualSheathWord) {
  btnDownloadManualSheathWord.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/generate_sheath_word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualSheathData)
      });
      if (!response.ok) throw new Error("Failed to generate Word");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Sheath_Calculation_Report.docx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showNotification("Sheath Word report downloaded!", 'success');
    } catch (error) {
      console.error(error);
      showNotification("Failed to generate sheath Word", 'error');
    }
  });
}

// Manual CWS & Sheath combination download handler
const btnDownloadManualCwsSheath = document.getElementById("btnDownloadManualCwsSheath");
if (btnDownloadManualCwsSheath) {
  btnDownloadManualCwsSheath.addEventListener("click", async () => {
    // For manual CWS combinations, we need to collect the data from the current calculation
    const sheathMaterial = document.getElementById("manualSheathMaterial").value.toLowerCase();
    const manualMode = sheathMaterial.includes("cws_only") ? "cws_only" : (sheathMaterial.startsWith("cws_") ? "cws+sheath" : "normal");
    
    if (manualMode === "normal") {
      showNotification("CWS & Sheath report is only available for CWS combinations.", 'warning');
      return;
    }

    // Collect current calculation data
    const voltageKv = parseFloat(document.getElementById("manualSheathVoltageKv").value);
    const t = parseFloat(document.getElementById("manualSheathTimeSec").value);
    
    let cwsSheathData = {
      voltage: voltageKv,
      conductor_area: 0, // Not available in manual mode
      time: t,
      cws_results: null,
      sheath_results: null
    };

    // Add CWS data if present
    if (manualMode.includes("cws")) {
      const cwsArea = parseFloat(document.getElementById("manualCwsArea").value);
      const cwsThetaI = parseFloat(document.getElementById("manualCwsThetaInitial").value);
      const cwsThetaF = parseFloat(document.getElementById("manualCwsThetaFinal").value);
      const cwsWireDiameter = parseFloat(document.getElementById("manualCwsWireDiameter").value);
      
      if (!isNaN(cwsArea) && !isNaN(cwsThetaI) && !isNaN(cwsThetaF) && !isNaN(cwsWireDiameter)) {
        const cwsAdiabatic = calculateAdiabaticCurrent(cwsArea, t, "copper", cwsThetaI, cwsThetaF, TABLE_I_CWS);
        const insulationMaterial = document.getElementById("manualInsulationMaterial").value;
        const outerSheathMaterial = document.getElementById("manualOuterSheathMaterial").value;
        const cwsM = calculateMFactor(insulationMaterial, outerSheathMaterial, cwsWireDiameter, "copper", voltageKv, "no", "cws");
        const cwsEpsilon = calculateEpsilon(cwsM, t);
        const cwsNonAdiabatic = cwsEpsilon * cwsAdiabatic;

        cwsSheathData.cws_results = {
          area: cwsArea.toFixed(2),
          thickness: cwsWireDiameter.toFixed(2),
          theta_i: cwsThetaI.toString(),
          theta_f: cwsThetaF.toString(),
          k_value: "226",
          beta: "234.5",
          sigma_c: "3.45E+06",
          rho20: "1.7241E-08",
          i_ad: cwsAdiabatic.toFixed(3),
          i_non_ad: cwsNonAdiabatic.toFixed(3),
          epsilon: cwsEpsilon.toFixed(3),
          m_factor: cwsM.toFixed(4),
          p_factor: (cwsM * Math.sqrt(t)).toFixed(3),
          earth_fault_current: (cwsAdiabatic * 1.025).toFixed(2)
        };
      }
    }

    // Add sheath data if present
    if (manualMode === "cws+sheath") {
      const sheathMaterialForConstants = sheathMaterial === "cws_lead" ? "lead" : "aluminium";
      const sheathOuterD = parseFloat(document.getElementById("manualSheathOuterD").value);
      const sheathInnerD = parseFloat(document.getElementById("manualSheathInnerD").value);
      const sheathArea = parseFloat(document.getElementById("manualSheathAreaGiven").value);
      const sheathThetaI = parseFloat(document.getElementById("manualSheathThetaInitial").value);
      const sheathThetaF = parseFloat(document.getElementById("manualSheathThetaFinal").value);
      const sheathThickness = parseFloat(document.getElementById("manualSheathThickness").value);
      
      if (!isNaN(sheathArea) && !isNaN(sheathThetaI) && !isNaN(sheathThetaF) && !isNaN(sheathThickness)) {
        const sheathAdiabatic = calculateAdiabaticCurrent(sheathArea, t, sheathMaterialForConstants, sheathThetaI, sheathThetaF, TABLE_I_SHEATHS);
        const insulationMaterial = document.getElementById("manualInsulationMaterial").value;
        const outerSheathMaterial = document.getElementById("manualOuterSheathMaterial").value;
        const sheathM = calculateMFactor(insulationMaterial, outerSheathMaterial, sheathThickness, sheathMaterialForConstants, voltageKv, "no", "sheath");
        const sheathEpsilon = calculateEpsilon(sheathM, t);
        const sheathNonAdiabatic = sheathEpsilon * sheathAdiabatic;
        const sheathConstants = TABLE_I_SHEATHS[sheathMaterialForConstants];

        cwsSheathData.sheath_results = {
          material: sheathMaterialForConstants.charAt(0).toUpperCase() + sheathMaterialForConstants.slice(1),
          area: sheathArea.toFixed(2),
          thickness: sheathThickness.toFixed(2),
          theta_i: sheathThetaI.toString(),
          theta_f: sheathThetaF.toString(),
          k_value: sheathConstants.K.toString(),
          beta: sheathConstants.beta.toString(),
          sigma_c: sheathConstants.sigmaC.toExponential(2),
          rho20: sheathConstants.rho20.toExponential(2),
          i_ad: sheathAdiabatic.toFixed(3),
          i_non_ad: sheathNonAdiabatic.toFixed(3),
          epsilon: sheathEpsilon.toFixed(3),
          m_factor: sheathM.toFixed(4),
          p_factor: (sheathM * Math.sqrt(t)).toFixed(3),
          earth_fault_current: (sheathAdiabatic * 0.48).toFixed(2)
        };
      }
    }

    try {
      const response = await fetch("/api/generate_cws_sheath_pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cwsSheathData)
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Manual_CWS_Sheath_Combination_Report.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showNotification("Manual CWS & Sheath combination report downloaded!", 'success');
    } catch (error) {
      console.error(error);
      showNotification("Failed to generate manual CWS & Sheath PDF: " + error.message, 'error');
    }
  });
}

// =============== CWS & SHEATH COMBINATION CALCULATION ===============

// Configuration change handler
document.getElementById("cwsSheathConfig").addEventListener("change", (e) => {
  const config = e.target.value;
  const cwsParams = document.getElementById("cwsParameters");
  const sheathParams = document.getElementById("sheathParameters");
  
  // Hide all parameters first
  cwsParams.style.display = "none";
  sheathParams.style.display = "none";
  
  // Show relevant parameters based on configuration
  if (config === "cws_aluminium" || config === "cws_lead") {
    cwsParams.style.display = "block";
    sheathParams.style.display = "block";
    
    // Set sheath material based on configuration
    const sheathMaterial = config === "cws_aluminium" ? "aluminium" : "lead";
    document.getElementById("cwsSheathMaterial").value = sheathMaterial;
  } else if (config === "cws_only") {
    cwsParams.style.display = "block";
  } else if (config === "lead_only") {
    sheathParams.style.display = "block";
    document.getElementById("cwsSheathMaterial").value = "lead";
  }
});

// CWS geometry calculation
function updateCwsGeometry() {
  const wireDiameterInput = document.getElementById("cwsWireDiameter");
  const wireCountInput = document.getElementById("cwsWireCount");
  const areaEl = document.getElementById("cwsArea");

  const d = parseFloat(wireDiameterInput.value);
  const N = parseFloat(wireCountInput.value);

  if (!isNaN(d) && !isNaN(N) && d > 0 && N > 0) {
    const wireArea = (Math.PI * d * d) / 4;
    const totalArea = N * wireArea;
    areaEl.value = totalArea.toFixed(2);
  } else {
    areaEl.value = "";
  }
}

// CWS Sheath geometry calculation
function updateCwsSheathGeometry() {
  const DoInput = document.getElementById("cwsSheathOuterD");
  const DiInput = document.getElementById("cwsSheathInnerD");
  const thicknessEl = document.getElementById("cwsSheathThickness");
  const areaEl = document.getElementById("cwsSheathArea");

  const Do = parseFloat(DoInput.value);
  const Di = parseFloat(DiInput.value);

  if (!isNaN(Do) && !isNaN(Di) && Do > 0 && Di > 0 && Do > Di) {
    const delta = (Do - Di) / 2;
    const area = (Math.PI / 4) * (Do * Do - Di * Di);
    thicknessEl.value = delta.toFixed(3);
    areaEl.value = area.toFixed(2);
  } else {
    thicknessEl.value = "";
    areaEl.value = "";
  }
}

// Event listeners for geometry calculations
document.getElementById("cwsWireDiameter").addEventListener("input", updateCwsGeometry);
document.getElementById("cwsWireCount").addEventListener("input", updateCwsGeometry);
document.getElementById("cwsSheathOuterD").addEventListener("input", updateCwsSheathGeometry);
document.getElementById("cwsSheathInnerD").addEventListener("input", updateCwsSheathGeometry);

// Calculate adiabatic area for CWS or sheath
function calculateAdiabaticArea(I_AD_kA, t, material, theta_i, theta_f, materialTable) {
  const mat = materialTable[material];
  if (!mat) return null;

  const K = mat.K;
  const beta = mat.beta;

  const lnTerm = Math.log((theta_f + beta) / (theta_i + beta));
  if (lnTerm <= 0) return null;

  const I_AD_A = I_AD_kA * 1000;
  const s_sq = (I_AD_A ** 2 * t) / (K ** 2 * lnTerm);
  if (s_sq <= 0) return null;

  return Math.sqrt(s_sq);
}

// Calculate adiabatic current for given area
function calculateAdiabaticCurrent(area, t, material, theta_i, theta_f, materialTable) {
  const mat = materialTable[material];
  if (!mat) return null;

  const K = mat.K;
  const beta = mat.beta;

  const lnTerm = Math.log((theta_f + beta) / (theta_i + beta));
  if (lnTerm <= 0) return null;

  const I_AD_A = K * area * Math.sqrt(lnTerm / t);
  return I_AD_A / 1000; // Convert to kA
}

// Calculate M factor for CWS or sheath with different media
function calculateMFactor(insulationMaterial, outerSheathMaterial, thickness, componentMaterial, voltageKv, isOilFilled, componentType) {
  let sigma2, rho2, sigma3, rho3;
  
  if (componentType === 'cws') {
    // For CWS: inner = insulation, outer = bedding/PE
    const insulation = getThermalConstants("insulating", insulationMaterial, voltageKv);
    const outerSheath = getThermalConstants("protective", outerSheathMaterial, voltageKv);
    
    if (!insulation || !outerSheath) return null;
    
    sigma2 = insulation.sigma;
    rho2 = insulation.rho;
    sigma3 = outerSheath.sigma;
    rho3 = outerSheath.rho;
  } else {
    // For sheath: inner = bedding, outer = PE/earth
    const bedding = getThermalConstants("protective", "PE", voltageKv); // Assume PE bedding
    const outerSheath = getThermalConstants("protective", outerSheathMaterial, voltageKv);
    
    if (!bedding || !outerSheath) return null;
    
    sigma2 = bedding.sigma;
    rho2 = bedding.rho;
    sigma3 = outerSheath.sigma;
    rho3 = outerSheath.rho;
  }

  const materialTable = componentType === 'cws' ? TABLE_I_CWS : TABLE_I_SHEATHS;
  const mat = materialTable[componentMaterial];
  if (!mat) return null;

  const sigma1 = mat.sigmaC;
  const delta = thickness;

  const F = isOilFilled === "yes" ? THERMAL_CONTACT_FACTOR["oil-filled"] : THERMAL_CONTACT_FACTOR.default;

  const sqrtTerm1 = Math.sqrt(sigma2 / rho2);
  const sqrtTerm2 = Math.sqrt(sigma3 / rho3);
  const numerator = sqrtTerm1 + sqrtTerm2;
  const denominator = 2 * sigma1 * delta * 1e-3;

  if (denominator === 0) return null;

  return (numerator / denominator) * F;
}

// Store calculation data globally for PDF generation
let cwsSheathCalculationData = null;

// CWS & Sheath form handler
document.getElementById("cwsSheathForm").addEventListener("submit", (e) => {
  e.preventDefault();
  
  const config = document.getElementById("cwsSheathConfig").value;
  const voltageKv = parseFloat(document.getElementById("cwsVoltageKv").value);
  const I_AD_kA = parseFloat(document.getElementById("cwsSccKa").value);
  const t = parseFloat(document.getElementById("cwsTimeSec").value);
  const insulationMaterial = document.getElementById("cwsInsulationMaterial").value;
  const outerSheathMaterial = document.getElementById("cwsOuterSheathMaterial").value;

  if (!config) {
    showNotification("Please select a configuration.", 'warning');
    return;
  }

  if ([voltageKv, I_AD_kA, t].some((v) => isNaN(v))) {
    showNotification("Please fill all basic parameters.", 'warning');
    return;
  }

  if (!validateVoltageTime(voltageKv, t)) return;

  let html = "<h6 style='color: #2563eb;'>CWS & Sheath Calculation Results</h6><hr>";
  let results = [];
  let hasError = false;
  
  // Initialize calculation data
  cwsSheathCalculationData = {
    voltage: voltageKv,
    conductor_area: "N/A",
    time: t,
    cws_results: null,
    sheath_results: null
  };

  // Calculate CWS if included in configuration
  if (config.includes("cws")) {
    const cwsWireDiameter = parseFloat(document.getElementById("cwsWireDiameter").value);
    const cwsWireCount = parseFloat(document.getElementById("cwsWireCount").value);
    const cwsArea = parseFloat(document.getElementById("cwsArea").value);
    const cwsThetaI = parseFloat(document.getElementById("cwsThetaInitial").value);
    const cwsThetaF = parseFloat(document.getElementById("cwsThetaFinal").value);
    const cwsThickness = parseFloat(document.getElementById("cwsWireDiameter").value);

    if ([cwsWireDiameter, cwsWireCount, cwsArea, cwsThetaI, cwsThetaF].some((v) => isNaN(v))) {
      showNotification("Please fill all CWS parameters.", 'warning');
      return;
    }

    // Calculate CWS adiabatic current
    const cwsAdiabaticCurrent = calculateAdiabaticCurrent(cwsArea, t, "copper", cwsThetaI, cwsThetaF, TABLE_I_CWS);
    
    if (!cwsAdiabaticCurrent) {
      showNotification("Could not calculate CWS adiabatic current.", 'error');
      return;
    }
    
    console.log(`CWS Calculation Debug:
      Area: ${cwsArea} mm²
      K: ${TABLE_I_CWS.copper.K}
      β: ${TABLE_I_CWS.copper.beta}
      θi: ${cwsThetaI}°C
      θf: ${cwsThetaF}°C
      t: ${t}s
      I_ad: ${cwsAdiabaticCurrent.toFixed(3)} kA`);
    
    // Calculate CWS non-adiabatic current
    const cwsM = calculateMFactor(insulationMaterial, outerSheathMaterial, cwsThickness, "copper", voltageKv, "no", "cws");
    
    if (!cwsM) {
      showNotification("Could not calculate CWS M factor.", 'error');
      return;
    }
    
    const cwsEpsilon = calculateEpsilon(cwsM, t);
    
    if (!cwsEpsilon) {
      showNotification("Could not calculate CWS ε factor.", 'error');
      return;
    }
    
    console.log(`CWS Non-Adiabatic Debug:
      M: ${cwsM.toFixed(4)}
      ε: ${cwsEpsilon.toFixed(3)}
      I_non_ad: ${(cwsEpsilon * cwsAdiabaticCurrent).toFixed(3)} kA`);
    
    const cwsNonAdiabaticCurrent = cwsEpsilon * cwsAdiabaticCurrent;

    // Store detailed CWS results for PDF generation
    cwsSheathCalculationData.cws_results = {
      area: cwsArea.toFixed(2),
      thickness: cwsThickness.toFixed(2),
      theta_i: cwsThetaI.toString(),
      theta_f: cwsThetaF.toString(),
      k_value: "226",
      beta: "234.5",
      sigma_c: "3.45E+06",
      rho20: "1.7241E-08",
      i_ad: cwsAdiabaticCurrent.toFixed(3),
      i_non_ad: cwsNonAdiabaticCurrent.toFixed(3),
      epsilon: cwsEpsilon.toFixed(3),
      m_factor: cwsM.toFixed(4),
      p_factor: (cwsM * Math.sqrt(t)).toFixed(3),
      earth_fault_current: (cwsAdiabaticCurrent * 1.025).toFixed(2) // Approximate earth fault current
    };

    results.push({
      component: "CWS (Copper Wire Screen)",
      adiabatic: cwsAdiabaticCurrent.toFixed(3),
      nonAdiabatic: cwsNonAdiabaticCurrent.toFixed(3),
      area: cwsArea.toFixed(2),
      material: "Copper"
    });
  }

  // Calculate Sheath if included in configuration
  if (config.includes("aluminium") || config.includes("lead") || config === "lead_only") {
    const sheathMaterial = document.getElementById("cwsSheathMaterial").value;
    const sheathOuterD = parseFloat(document.getElementById("cwsSheathOuterD").value);
    const sheathInnerD = parseFloat(document.getElementById("cwsSheathInnerD").value);
    const sheathArea = parseFloat(document.getElementById("cwsSheathArea").value);
    const sheathThetaI = parseFloat(document.getElementById("cwsSheathThetaInitial").value);
    const sheathThetaF = parseFloat(document.getElementById("cwsSheathThetaFinal").value);
    const sheathThickness = parseFloat(document.getElementById("cwsSheathThickness").value);

    if ([sheathOuterD, sheathInnerD, sheathArea, sheathThetaI, sheathThetaF, sheathThickness].some((v) => isNaN(v))) {
      showNotification("Please fill all sheath parameters.", 'warning');
      return;
    }

    if (sheathOuterD <= sheathInnerD) {
      showNotification("Sheath outer diameter must be greater than inner diameter.", 'error');
      return;
    }

    // Calculate sheath adiabatic current
    const sheathAdiabaticCurrent = calculateAdiabaticCurrent(sheathArea, t, sheathMaterial, sheathThetaI, sheathThetaF, TABLE_I_SHEATHS);
    
    if (!sheathAdiabaticCurrent) {
      showNotification("Could not calculate sheath adiabatic current.", 'error');
      return;
    }
    
    console.log(`${sheathMaterial.toUpperCase()} Sheath Calculation Debug:
      Area: ${sheathArea} mm²
      K: ${TABLE_I_SHEATHS[sheathMaterial].K}
      β: ${TABLE_I_SHEATHS[sheathMaterial].beta}
      θi: ${sheathThetaI}°C
      θf: ${sheathThetaF}°C
      t: ${t}s
      I_ad: ${sheathAdiabaticCurrent.toFixed(3)} kA`);
    
    // Calculate sheath non-adiabatic current
    const sheathM = calculateMFactor(insulationMaterial, outerSheathMaterial, sheathThickness, sheathMaterial, voltageKv, "no", "sheath");
    
    if (!sheathM) {
      showNotification("Could not calculate sheath M factor.", 'error');
      return;
    }
    
    const sheathEpsilon = calculateEpsilon(sheathM, t);
    
    if (!sheathEpsilon) {
      showNotification("Could not calculate sheath ε factor.", 'error');
      return;
    }
    
    console.log(`${sheathMaterial.toUpperCase()} Sheath Non-Adiabatic Debug:
      M: ${sheathM.toFixed(4)}
      ε: ${sheathEpsilon.toFixed(3)}
      I_non_ad: ${(sheathEpsilon * sheathAdiabaticCurrent).toFixed(3)} kA`);
    
    const sheathNonAdiabaticCurrent = sheathEpsilon * sheathAdiabaticCurrent;

    // Store detailed sheath results for PDF generation
    const sheathConstants = TABLE_I_SHEATHS[sheathMaterial];
    cwsSheathCalculationData.sheath_results = {
      material: sheathMaterial.charAt(0).toUpperCase() + sheathMaterial.slice(1),
      area: sheathArea.toFixed(2),
      thickness: sheathThickness.toFixed(2),
      theta_i: sheathThetaI.toString(),
      theta_f: sheathThetaF.toString(),
      k_value: sheathConstants.K.toString(),
      beta: sheathConstants.beta.toString(),
      sigma_c: sheathConstants.sigmaC.toExponential(2),
      rho20: sheathConstants.rho20.toExponential(2),
      i_ad: sheathAdiabaticCurrent.toFixed(3),
      i_non_ad: sheathNonAdiabaticCurrent.toFixed(3),
      epsilon: sheathEpsilon.toFixed(3),
      m_factor: sheathM.toFixed(4),
      p_factor: (sheathM * Math.sqrt(t)).toFixed(3),
      earth_fault_current: (sheathAdiabaticCurrent * 0.48).toFixed(2) // Approximate earth fault current
    };

    results.push({
      component: `${sheathMaterial.charAt(0).toUpperCase() + sheathMaterial.slice(1)} Sheath`,
      adiabatic: sheathAdiabaticCurrent.toFixed(3),
      nonAdiabatic: sheathNonAdiabaticCurrent.toFixed(3),
      area: sheathArea.toFixed(2),
      material: sheathMaterial.charAt(0).toUpperCase() + sheathMaterial.slice(1)
    });
  }

  const totalAd = results.reduce((s, r) => s + parseFloat(r.adiabatic), 0);
  const totalNon = results.reduce((s, r) => s + parseFloat(r.nonAdiabatic), 0);
  html += `<h6 class="mt-4 mb-3">Calculation Results (t = ${t} s)</h6>`;
  html += `<div class="table-responsive">`;
  html += `<table class="table table-bordered table-striped">`;
  html += `<thead class="table-dark">`;
  html += `<tr><th>Component</th><th>Material</th><th>Area (mm²)</th><th>Adiabatic (1s)</th><th>Non-Adiabatic (1s)</th></tr>`;
  html += `</thead><tbody>`;
  
  results.forEach(result => {
    html += `<tr>`;
    html += `<td><strong>${result.component}</strong></td>`;
    html += `<td>${result.material}</td>`;
    html += `<td>${result.area}</td>`;
    html += `<td><span style="color: #2563eb; font-weight: bold;">${result.adiabatic} kA</span></td>`;
    html += `<td><span style="color: #059669; font-weight: bold;">${result.nonAdiabatic} kA</span></td>`;
    html += `</tr>`;
  });
  html += `<tr>`;
  html += `<td><strong>Total</strong></td>`;
  html += `<td></td>`;
  html += `<td></td>`;
  html += `<td><span style="color: #2563eb; font-weight: bold;">${totalAd.toFixed(3)} kA</span></td>`;
  html += `<td><span style="color: #059669; font-weight: bold;">${totalNon.toFixed(3)} kA</span></td>`;
  html += `</tr>`;
  
  html += `</tbody></table></div>`;

  // Show results in manual result box (since CWS is in manual section)
  document.getElementById("manualResultBox").style.display = "block";
  const manualResultText = document.getElementById("manualResultText");
  manualResultText.innerHTML = html;
  manualResultText.className = hasError ? 'results-box error' : 'results-box';
  document.getElementById("btnDownloadCwsSheath").style.display = "inline-block";
  
  showNotification("CWS & Sheath calculation complete!", 'success');
  
  // Scroll to results
  setTimeout(() => {
    const resultBox = document.getElementById("manualResultBox");
    if (resultBox && typeof resultBox.scrollIntoView === "function") {
      resultBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100);
});

// Download handler for CWS & Sheath report
document.getElementById("btnDownloadCwsSheath").addEventListener("click", async () => {
  if (!cwsSheathCalculationData) {
    showNotification("Please calculate CWS & Sheath first.", 'warning');
    return;
  }
  
  try {
    const response = await fetch("/api/generate_cws_sheath_pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cwsSheathCalculationData)
    });
    
    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CWS_Sheath_Calculation_Report.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    showNotification("CWS & Sheath report downloaded!", 'success');
  } catch (error) {
    console.error(error);
    showNotification("Failed to generate CWS & Sheath PDF: " + error.message, 'error');
  }
});
