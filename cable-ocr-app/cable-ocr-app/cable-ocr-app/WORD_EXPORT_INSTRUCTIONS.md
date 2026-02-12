# Word Document Export Feature

## What's New

Your Cable OCR application now supports exporting calculation reports in **both PDF and Word (.docx) formats**.

## Changes Made

### 1. Backend (app_enhanced.py)
- Added `python-docx` library import for Word document generation
- Created two new functions:
  - `build_conductor_word_report()` - Generates conductor calculation in Word format
  - `build_sheath_word_report()` - Generates sheath calculation in Word format
- Added two new API endpoints:
  - `/api/generate_conductor_word` - Downloads conductor report as .docx
  - `/api/generate_sheath_word` - Downloads sheath report as .docx

### 2. Dependencies (requirements.txt)
- Added `python-docx==1.1.2` for Word document generation

## How to Use

### Installation
1. Install the new dependency:
   ```bash
   pip install python-docx==1.1.2
   ```
   Or install all requirements:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Integration (To Be Added)
You need to add Word download buttons to your HTML interface. Here's what to add:

#### For Conductor Report:
Add this button next to the existing PDF download button:
```html
<button type="button" id="btnDownloadConductorWord" class="btn btn-outline-enhanced btn-enhanced ms-2" style="display: none;">
  📝 Download Conductor Report (Word)
</button>
```

#### For Sheath Report:
Add this button next to the existing PDF download button:
```html
<button type="button" id="btnDownloadSheathWord" class="btn btn-outline-enhanced btn-enhanced ms-2" style="display: none;">
  📝 Download Sheath Report (Word)
</button>
```

### JavaScript Integration (To Be Added)
Add these functions to your `script_enhanced.js`:

```javascript
// Word download for conductor
function downloadConductorWord(data) {
  fetch('/api/generate_conductor_word', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(response => response.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Conductor_Calculation_Report.docx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  })
  .catch(error => console.error('Error downloading Word:', error));
}

// Word download for sheath
function downloadSheathWord(data) {
  fetch('/api/generate_sheath_word', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(response => response.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Sheath_Calculation_Report.docx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  })
  .catch(error => console.error('Error downloading Word:', error));
}
```

## Testing

1. Start your Flask application:
   ```bash
   python app_enhanced.py
   ```

2. Upload a PDF and perform calculations

3. Test the Word export by calling the API directly:
   ```bash
   curl -X POST http://localhost:5001/api/generate_conductor_word \
     -H "Content-Type: application/json" \
     -d '{"voltage": 132, "area": 3000, "material": "Copper", ...}'
   ```

## Features

The Word documents include:
- Professional formatting matching the PDF reports
- All calculation parameters and results
- Proper equations and formulas (text representation)
- Tables with borders and styling
- Yellow-highlighted header cells
- IEC 60949 standard compliance notes

## Notes

- Word documents use text representations of mathematical symbols (e.g., θ, β, ε)
- Formatting closely matches the PDF reports
- Documents are fully editable in Microsoft Word, LibreOffice, or Google Docs
- File size is typically smaller than PDF equivalents
