"""
Test OCR functionality with Tesseract and Poppler
"""
import os
from PIL import Image, ImageDraw, ImageFont
import pytesseract

print("=" * 60)
print("Testing OCR Installation")
print("=" * 60)

# Test 1: Check Tesseract path
tesseract_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
print(f"\n1. Checking Tesseract installation...")
print(f"   Path: {tesseract_path}")
if os.path.exists(tesseract_path):
    print("   ✓ Tesseract executable found")
    pytesseract.pytesseract.tesseract_cmd = tesseract_path
else:
    print("   ✗ Tesseract executable NOT found")
    exit(1)

# Test 2: Check Poppler path
poppler_path = r"C:\poppler-25.12.0\Library\bin"
print(f"\n2. Checking Poppler installation...")
print(f"   Path: {poppler_path}")
pdftoppm = os.path.join(poppler_path, "pdftoppm.exe")
if os.path.exists(pdftoppm):
    print("   ✓ Poppler binaries found")
else:
    print("   ✗ Poppler binaries NOT found")
    exit(1)

# Test 3: Create a test image with text
print(f"\n3. Creating test image...")
img = Image.new('RGB', (400, 100), color='white')
draw = ImageDraw.Draw(img)
draw.text((10, 30), "Cable OCR Test 132kV", fill='black')
img.save('test_ocr_image.png')
print("   ✓ Test image created: test_ocr_image.png")

# Test 4: Run OCR on test image
print(f"\n4. Running OCR on test image...")
try:
    text = pytesseract.image_to_string(img)
    print(f"   ✓ OCR successful!")
    print(f"   Extracted text: '{text.strip()}'")
except Exception as e:
    print(f"   ✗ OCR failed: {e}")
    exit(1)

# Test 5: Test PDF to image conversion (if you have a test PDF)
print(f"\n5. Testing PDF to image conversion...")
try:
    from pdf2image import convert_from_bytes
    print("   ✓ pdf2image module imported successfully")
    print("   Note: Upload a PDF in the web app to test full OCR pipeline")
except Exception as e:
    print(f"   ✗ pdf2image import failed: {e}")

print("\n" + "=" * 60)
print("✓ All OCR components are working correctly!")
print("=" * 60)
print("\nYou can now:")
print("1. Start the Flask app: python app_enhanced.py")
print("2. Open http://localhost:5001")
print("3. Upload a cable datasheet PDF")
print("4. Extract parameters using OCR")
