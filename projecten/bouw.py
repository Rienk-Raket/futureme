#!/usr/bin/env python3
"""Bouwt projecten/index.html uit src/ (één bestand, geen externe bronnen)."""
import base64, json, pathlib
HIER = pathlib.Path(__file__).resolve().parent
SRC = HIER / "src"
JS = ["kern.js", "db.js", "app.js", "schermen.js", "acties.js", "accountability.js"]
icoon = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#36e2ff"/><stop offset="1" stop-color="#8b7bff"/></linearGradient></defs>
<rect width="180" height="180" rx="40" fill="#04060c"/><circle cx="90" cy="90" r="58" fill="none" stroke="url(#g)" stroke-width="6" stroke-dasharray="6 10"/><circle cx="90" cy="90" r="34" fill="none" stroke="url(#g)" stroke-width="8"/><circle cx="90" cy="90" r="10" fill="#36e2ff"/></svg>"""
icoon_uri = "data:image/svg+xml;base64," + base64.b64encode(icoon.encode()).decode()
manifest = {"name": "FutureMe Projecten", "short_name": "FutureMe", "start_url": ".", "display": "standalone", "background_color": "#04060c", "theme_color": "#04060c",
            "icons": [{"src": icoon_uri, "sizes": "any", "type": "image/svg+xml"}]}
manifest_uri = "data:application/manifest+json;base64," + base64.b64encode(json.dumps(manifest).encode()).decode()
html = (SRC / "schil.html").read_text(encoding="utf-8")
js = "\n\n".join((SRC / n).read_text(encoding="utf-8") for n in JS)
css = (SRC / "stijl.css").read_text(encoding="utf-8")
for a, b in (("__CSS__", css), ("__JS__", js.replace("</script", "<\\/script")), ("__MANIFEST__", manifest_uri), ("__ICOON__", icoon_uri)):
    assert a in html, a
    html = html.replace(a, b)
(HIER / "index.html").write_text(html, encoding="utf-8")
print(f"Gebouwd: {HIER / 'index.html'} ({len(html) // 1024} KB)")
