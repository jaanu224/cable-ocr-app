# Frontend Integration Example for Word Export

## Quick Integration Guide

### Step 1: Add Word Download Buttons to HTML

Find the existing PDF download buttons in `index_enhanced.html` and add Word buttons next to them:

#### For Conductor Section (around line 650):
```html
<!-- Existing PDF button -->
<button type="button" id="btnDownloadConductor" class="btn btn-outline-enhanced btn-enhanced ms-3" style="display: none;">
  📄 Download Conductor Report (PDF)
</button>

<!-- NEW: Add this Word button -->
<button type="button" id="btnDownloadConductorWord" class="btn btn-outline-enhanced btn-enhanced ms-2" style="display: none;">
  📝 Download Conductor Report (Word)
</button>
```

#### For Sheath Section (around line 850):
```html
<!-- Existing PDF button -->
<button type="button" id="btnDownloadSheath" class="btn btn-outline-enhanced btn-enhanced ms-3" style="display: none;">
  📄 Download Sheath Report (PDF)
</button>

<!-- NEW: Add this Word button -->
<button type="button" id="btnDownloadSheathWord" class="btn btn-outline-enhanced btn-enhanced ms-2" style="display: none;">
  📝 Download Sheath Report (Word)
</button>
```

#### For Manual Mode Conductor (around line 1150):
```html
<button type="button" id="btnDownloadManualConductorWord" class="btn btn-outline-enhanced btn-enhanced ms-2" style="display: none;">
  📝 Download Conductor Report (Word)
</button>
```

#### For Manual Mode Sheath (around line 1250):
```html
<button type="button" id="btnDownloadManualSheathWord" class="btn btn-outline-enhanced btn-enhanced ms-2" style="display: none;">
  📝 Download Sheath Report (Word)
</button>
```

---

### Step 2: Add JavaScript Functions to `script_enhanced.js`

Add these helper functions at the end of your JavaScript file:

```javascript
// =============== WORD DOCUMENT DOWNLOAD FUNCTIONS ===============

/**
 * Download conductor calculation as Word document
 */
function downloadConductorWord(data) {
  console.log("Downloading conductor Word report...");
  
  fetch('/api/generate_conductor_word', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to generate Word document');
    }
    return response.blob();
  })
  .then(blob => {
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Conductor_Calculation_Report.docx';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    console.log("✓ Conductor Word report downloaded");
  })
  .catch(error => {
    console.error('Error downloading conductor Word:', error);
    alert('Failed to download Word document. Please try again.');
  });
}

/**
 * Download sheath calculation as Word document
 */
function downloadSheathWord(data) {
  console.log("Downloading sheath Word report...");
  
  fetch('/api/generate_sheath_word', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to generate Word document');
    }
    return response.blob();
  })
  .then(blob => {
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Sheath_Calculation_Report.docx';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    console.log("✓ Sheath Word report downloaded");
  })
  .catch(error => {
    console.error('Error downloading sheath Word:', error);
    alert('Failed to download Word document. Please try again.');
  });
}
```

---

### Step 3: Wire Up Button Click Handlers

Find where you handle the PDF download buttons and add similar handlers for Word buttons.

#### Example for Conductor:
```javascript
// After conductor calculation is complete and you show the PDF button:
const btnDownloadConductor = document.getElementById("btnDownloadConductor");
const btnDownloadConductorWord = document.getElementById("btnDownloadConductorWord");

if (btnDownloadConductor) {
  btnDownloadConductor.style.display = "inline-block";
  btnDownloadConductor.onclick = function() {
    downloadConductorPDF(conductorData); // Your existing PDF function
  };
}

// NEW: Show and wire up Word button
if (btnDownloadConductorWord) {
  btnDownloadConductorWord.style.display = "inline-block";
  btnDownloadConductorWord.onclick = function() {
    downloadConductorWord(conductorData); // New Word function
  };
}
```

#### Example for Sheath:
```javascript
// After sheath calculation is complete:
const btnDownloadSheath = document.getElementById("btnDownloadSheath");
const btnDownloadSheathWord = document.getElementById("btnDownloadSheathWord");

if (btnDownloadSheath) {
  btnDownloadSheath.style.display = "inline-block";
  btnDownloadSheath.onclick = function() {
    downloadSheathPDF(sheathData); // Your existing PDF function
  };
}

// NEW: Show and wire up Word button
if (btnDownloadSheathWord) {
  btnDownloadSheathWord.style.display = "inline-block";
  btnDownloadSheathWord.onclick = function() {
    downloadSheathWord(sheathData); // New Word function
  };
}
```

---

### Step 4: Test the Integration

1. Start your Flask app:
   ```bash
   python app_enhanced.py
   ```

2. Open http://localhost:5001 in your browser

3. Upload a PDF and perform calculations

4. You should now see both PDF and Word download buttons

5. Click the Word button to download the .docx file

6. Open the downloaded file in Microsoft Word, LibreOffice, or Google Docs

---

## Complete Example: Conductor Form Submit Handler

Here's a complete example showing how to handle both PDF and Word downloads:

```javascript
conductorForm.addEventListener("submit", function(e) {
  e.preventDefault();
  
  // Collect form data
  const conductorData = {
    voltage: parseFloat(document.getElementById("voltageKv").value),
    area: parseFloat(document.getElementById("givenConductorArea").value),
    material: document.getElementById("material").value,
    // ... other fields
  };
  
  // Perform calculation (your existing logic)
  calculateConductor(conductorData);
  
  // Show download buttons
  const btnPDF = document.getElementById("btnDownloadConductor");
  const btnWord = document.getElementById("btnDownloadConductorWord");
  
  if (btnPDF) {
    btnPDF.style.display = "inline-block";
    btnPDF.onclick = () => downloadConductorPDF(conductorData);
  }
  
  if (btnWord) {
    btnWord.style.display = "inline-block";
    btnWord.onclick = () => downloadConductorWord(conductorData);
  }
});
```

---

## Styling Tips

You can customize the button appearance:

```html
<!-- PDF button with blue icon -->
<button type="button" id="btnDownloadConductor" class="btn btn-outline-enhanced btn-enhanced ms-3">
  📄 PDF
</button>

<!-- Word button with green icon -->
<button type="button" id="btnDownloadConductorWord" class="btn btn-success-enhanced btn-enhanced ms-2">
  📝 Word
</button>
```

Or use a dropdown for format selection:

```html
<div class="btn-group">
  <button type="button" class="btn btn-primary-enhanced dropdown-toggle" data-bs-toggle="dropdown">
    Download Report
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#" onclick="downloadConductorPDF(data)">📄 PDF Format</a></li>
    <li><a class="dropdown-item" href="#" onclick="downloadConductorWord(data)">📝 Word Format</a></li>
  </ul>
</div>
```

---

## Troubleshooting

### Button doesn't appear
- Check that the button ID matches exactly
- Verify `style="display: none;"` is set initially
- Check browser console for JavaScript errors

### Download fails
- Check Flask app is running
- Verify the API endpoint is accessible
- Check browser console for network errors
- Ensure `python-docx` is installed

### Word file won't open
- Verify the file downloaded completely
- Check file size is > 0 bytes
- Try opening in different applications (Word, LibreOffice, Google Docs)

---

## Next Steps

1. Add the HTML buttons to your template
2. Add the JavaScript functions to your script
3. Wire up the click handlers
4. Test with real data
5. Customize styling to match your design

The backend is ready - you just need to connect the frontend!
