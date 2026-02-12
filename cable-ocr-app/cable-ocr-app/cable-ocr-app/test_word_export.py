"""
Quick test script to verify Word document generation works
"""
from app_enhanced import build_conductor_word_report, build_sheath_word_report

# Test data for conductor
conductor_test_data = {
    'voltage': 132,
    'area': 3000,
    'material': 'Copper',
    'insulation': 'XLPE',
    'outer_sheath': 'PE',
    'scc_required': 40,
    'time': 1,
    'k_value': 226,
    'beta': 234.5,
    'theta_i': 90,
    'theta_f': 250,
    'i_ad': 45.2,
    'calculated_area': 2850
}

# Test data for sheath
sheath_test_data = {
    'voltage': 132,
    'conductor_area': 3000,
    'material': 'Copper',
    'sheath_material': 'Aluminium',
    'insulation': 'XLPE',
    'outer_sheath': 'PE',
    'scc_required': 40,
    'time': 1,
    'thickness': 1.7,
    'inner_d': 93.64,
    'outer_d': 97.04,
    'sheath_area': 495.8,
    'k_value': 148,
    'beta': 228,
    'theta_i': 80,
    'theta_f': 250,
    'i_ad': 18.5,
    'i_non_ad': 20.8,
    'epsilon': 1.125,
    'm_factor': 0.85,
    'sigma1': 2500000,
    'sigma2': 2400000,
    'sigma3': 2400000,
    'rho2': 3.5,
    'rho3': 3.5,
    'f_factor': 0.7
}

print("Testing Word document generation...")
print("-" * 50)

try:
    # Test conductor Word generation
    print("1. Testing conductor Word report...")
    conductor_buffer = build_conductor_word_report(conductor_test_data)
    print(f"   ✓ Conductor Word document generated ({len(conductor_buffer.getvalue())} bytes)")
    
    # Save to file for manual inspection
    with open('test_conductor_report.docx', 'wb') as f:
        f.write(conductor_buffer.getvalue())
    print("   ✓ Saved as: test_conductor_report.docx")
    
except Exception as e:
    print(f"   ✗ Error: {e}")
    import traceback
    traceback.print_exc()

print()

try:
    # Test sheath Word generation
    print("2. Testing sheath Word report...")
    sheath_buffer = build_sheath_word_report(sheath_test_data)
    print(f"   ✓ Sheath Word document generated ({len(sheath_buffer.getvalue())} bytes)")
    
    # Save to file for manual inspection
    with open('test_sheath_report.docx', 'wb') as f:
        f.write(sheath_buffer.getvalue())
    print("   ✓ Saved as: test_sheath_report.docx")
    
except Exception as e:
    print(f"   ✗ Error: {e}")
    import traceback
    traceback.print_exc()

print()
print("-" * 50)
print("✓ All tests completed!")
print("\nYou can now open the generated .docx files to verify formatting.")
