# Complete Installation Guide - Cable OCR Application

## Prerequisites Installation

### 1. Tesseract OCR (Required for PDF text extraction)

#### Windows Installation:

**Download Link:**
- **Official Installer:** https://digi.bib.uni-mannheim.de/tesseract/tesseract-ocr-w64-setup-5.3.3.20231005.exe
- **GitHub Repository:** https://github.com/UB-Mannheim/tesseract/wiki

**Installation Steps:**
1. Download the installer from the link above
2. Run `tesseract-ocr-w64-setup-5.3.3.20231005.exe` as Administrator
3. During installation:
   - ✅ Accept the license agreement
   - ✅ Choose installation directory (default: `C:\Program Files\Tesseract-OCR`)
   - ✅ **IMPORTANT:** Check "Add to PATH" option
   - ✅ Select additional languages if needed (English is default)
4. Click "Install" and wait for completion

**Verify Installation:**
```cmd
tesseract --version
```
Expected output:
```
tesseract 5.3.3
```

**Update app_enhanced.py if needed:**
If you installed to a different location, update line 38:
```python
TESSERACT_EXE = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
```

---

### 2. Poppler (Required for PDF to Image conversion)

#### Windows Installation:

**Download Link:**
- **Latest Release:** https://github.com/oschwartz10612/poppler-windows/releases/
- **Direct Download (v24.08.0):** https://github.com/oschwartz10612/poppler-windows/releases/download/v24.08.0-0/Release-24.08.0-0.zip

**Installation Steps:**
1. Download `Release-24.08.0-0.zip`
2. Extract the ZIP file to a permanent location:
   - Recommended: `C:\poppler-24.08.0\`
3. The extracted folder should contain:
   ```
   poppler-24.08.0/
   ├── Library/
   │   └── bin/          ← This is what we need
   │       ├── pdfinfo.exe
   │       ├── pdftoppm.exe
   │       └── pdfimages.exe
   └── ...
   ```

**Update app_enhanced.py:**
Update line 41 with your extraction path:
```python
POPPLER_PATH = r"C:\poppler-24.08.0\Library\bin"
```

**Verify Installation:**
```cmd
C:\poppler-24.08.0\Library\bin\pdfinfo.exe -v
```

---

### 3. Python Dependencies

**Install all required packages:**
```bash
cd cable-ocr-app/cable-ocr-app
pip install -r requirements.txt
```

**Key packages installed:**
- Flask (web framework)
- pytesseract (Tesseract wrapper)
- pdf2image (PDF processing)
- reportlab (PDF generation)
- python-docx (Word generation)
- PyPDF2 (PDF manipulation)
- Pillow (image processing)

**Verify installation:**
```bash
python -c "import pytesseract, pdf2image, reportlab, docx; print('✓ All packages installed')"
```

---

## Complete Installation Checklist

- [ ] Python 3.8+ installed
- [ ] Tesseract OCR installed (`tesseract --version` works)
- [ ] Poppler extracted and path configured
- [ ] Python packages installed (`pip install -r requirements.txt`)
- [ ] Paths in `app_enhanced.py` updated (lines 38 and 41)
- [ ] Test script runs successfully (`python test_word_export.py`)

---

## Testing Your Installation

### Test 1: Python Imports
```bash
python -c "from app_enhanced import app; print('✓ App imports successfully')"
```

### Test 2: Word Generation
```bash
python test_word_export.py
```
Expected output:
```
Testing Word document generation...
--------------------------------------------------
1. Testing conductor Word report...
   ✓ Conductor Word document generated (37737 bytes)
   ✓ Saved as: test_conductor_report.docx

2. Testing sheath Word report...
   ✓ Sheath Word document generated (38274 bytes)
   ✓ Saved as: test_sheath_report.docx

--------------------------------------------------
✓ All tests completed!
```

### Test 3: Start Flask App
```bash
python app_enhanced.py
```
Expected output:
```
 * Running on http://127.0.0.1:5001
```

### Test 4: Upload a PDF
1. Open http://localhost:5001 in your browser
2. Upload a cable datasheet PDF
3. Click "Extract From PDF"
4. Verify OCR extraction works

---

## Troubleshooting

### Issue: "tesseract is not recognized"
**Solution:** 
- Tesseract not in PATH
- Add manually: System Properties → Environment Variables → Path → Add `C:\Program Files\Tesseract-OCR`
- Or update `TESSERACT_EXE` path in `app_enhanced.py`

### Issue: "Unable to get page count. Is poppler installed?"
**Solution:**
- Poppler not found
- Verify `POPPLER_PATH` in `app_enhanced.py` points to correct location
- Check that `pdftoppm.exe` exists in that folder

### Issue: "ModuleNotFoundError: No module named 'docx'"
**Solution:**
```bash
pip install python-docx==1.1.2
```

### Issue: "ModuleNotFoundError: No module named 'pytesseract'"
**Solution:**
```bash
pip install -r requirements.txt
```

### Issue: OCR returns empty text
**Solution:**
- PDF might be image-based (good for OCR)
- PDF might be corrupted
- Try increasing DPI in `ocr_pdf_to_text()` function
- Verify Tesseract language data is installed

---

## System Requirements

### Minimum:
- Windows 10 or later
- Python 3.8+
- 4 GB RAM
- 500 MB free disk space

### Recommended:
- Windows 10/11
- Python 3.10+
- 8 GB RAM
- 1 GB free disk space
- SSD for faster processing

---

## Alternative Installation Methods

### Using Chocolatey (Windows Package Manager):
```cmd
# Install Chocolatey first: https://chocolatey.org/install

# Install Tesseract
choco install tesseract

# Install Poppler
choco install poppler
```

### Using Conda:
```bash
# Create conda environment
conda create -n cable-ocr python=3.10
conda activate cable-ocr

# Install packages
conda install -c conda-forge tesseract poppler
pip install -r requirements.txt
```

---

## Quick Start After Installation

1. **Navigate to project:**
   ```bash
   cd cable-ocr-app/cable-ocr-app
   ```

2. **Start the application:**
   ```bash
   python app_enhanced.py
   ```

3. **Open in browser:**
   ```
   http://localhost:5001
   ```

4. **Upload a PDF and start calculating!**

---

## Additional Resources

- **Tesseract Documentation:** https://tesseract-ocr.github.io/
- **Poppler Documentation:** https://poppler.freedesktop.org/
- **Flask Documentation:** https://flask.palletsprojects.com/
- **python-docx Documentation:** https://python-docx.readthedocs.io/

---

## Support

If you encounter issues:
1. Check this installation guide
2. Verify all paths in `app_enhanced.py`
3. Run test scripts to isolate the problem
4. Check Python and package versions
5. Review error messages in Flask console

---

## Version Information

- **Tesseract:** 5.3.3 (recommended)
- **Poppler:** 24.08.0 (recommended)
- **Python:** 3.8+ (3.10+ recommended)
- **python-docx:** 1.1.2
- **Flask:** 3.1.2

Last updated: February 6, 2026
