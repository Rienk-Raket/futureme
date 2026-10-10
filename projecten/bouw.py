#!/usr/bin/env python3
"""Bouwt projecten/index.html uit src/ (één bestand, geen externe bronnen)."""
import base64, json, pathlib
HIER = pathlib.Path(__file__).resolve().parent
SRC = HIER / "src"
JS = ["kern.js", "db.js", "app.js", "schermen.js", "acties.js", "accountability.js", "score.js", "profiel.js", "vastlopen.js"]
# Kennismaking: de vragenbank en scoreweging uit kennis/ (dezelfde bestanden als Brain-Mate Nate), letterlijk in de app.
KENNIS = HIER.parent / "kennis"
VRAGEN = json.loads((KENNIS / "vragenbank.json").read_text(encoding="utf-8"))
WEGING = json.loads((KENNIS / "scoreweging.json").read_text(encoding="utf-8"))
assert len(VRAGEN["questions"]) == 96 and len(WEGING["pattern_clusters"]) == 7, "vragenbank of scoreweging klopt niet"
assert WEGING["global_neurodivergence_score"] is False and WEGING["diagnosis_probabilities_enabled"] is False, "verboden uitkomst aan"
KENNIS_JS = "const PT_VRAGENBANK = " + json.dumps(VRAGEN, ensure_ascii=False).replace("</", "<\\/") + ";\nconst PT_WEGING = " + json.dumps(WEGING, ensure_ascii=False).replace("</", "<\\/") + ";\n"
icoon = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#36e2ff"/><stop offset="1" stop-color="#8b7bff"/></linearGradient></defs>
<rect width="180" height="180" rx="40" fill="#04060c"/><circle cx="90" cy="90" r="58" fill="none" stroke="url(#g)" stroke-width="6" stroke-dasharray="6 10"/><circle cx="90" cy="90" r="34" fill="none" stroke="url(#g)" stroke-width="8"/><circle cx="90" cy="90" r="10" fill="#36e2ff"/></svg>"""
icoon_uri = "data:image/svg+xml;base64," + base64.b64encode(icoon.encode()).decode()
# iOS negeert SVG als beginschermicoon: daarom ook een PNG van 180 en 512 px naast index.html (met PIL getekend).
def png(maat):
    from PIL import Image, ImageDraw
    k = maat / 180
    im = Image.new("RGB", (maat, maat), "#04060c"); d = ImageDraw.Draw(im)
    for i in range(36):   # gestippelde buitenring

        a0 = i * 10; d.arc([90*k-58*k, 90*k-58*k, 90*k+58*k, 90*k+58*k], a0, a0 + 4, fill=(54, 226, 255), width=max(2, int(6*k)))
    d.ellipse([90*k-34*k, 90*k-34*k, 90*k+34*k, 90*k+34*k], outline=(139, 123, 255), width=max(2, int(8*k)))
    d.ellipse([90*k-10*k, 90*k-10*k, 90*k+10*k, 90*k+10*k], fill=(54, 226, 255))
    im.save(HIER / f"icoon-{maat}.png")
png(180); png(512)
manifest = {"name": "FutureMe Projecten", "short_name": "FutureMe", "start_url": "./index.html", "scope": "./", "display": "standalone", "background_color": "#04060c", "theme_color": "#04060c",
            "icons": [{"src": "icoon-180.png", "sizes": "180x180", "type": "image/png"}, {"src": "icoon-512.png", "sizes": "512x512", "type": "image/png"}, {"src": "icoon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]}
(HIER / "manifest.webmanifest").write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
manifest_uri = "manifest.webmanifest"
html = (SRC / "schil.html").read_text(encoding="utf-8")
js = KENNIS_JS + "\n\n".join((SRC / n).read_text(encoding="utf-8") for n in JS)
css = (SRC / "stijl.css").read_text(encoding="utf-8")
for a, b in (("__CSS__", css), ("__JS__", js.replace("</script", "<\\/script")), ("__MANIFEST__", manifest_uri), ("__ICOON__", "icoon-180.png")):
    assert a in html, a
    html = html.replace(a, b)
(HIER / "index.html").write_text(html, encoding="utf-8")
print(f"Gebouwd: {HIER / 'index.html'} ({len(html) // 1024} KB)")
