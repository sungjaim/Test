"""Build the site from src/template.html + data/*.json + assets/logo.jpg.

Outputs:
  index.html            standalone website (open directly or host on GitHub Pages)
  dist/preview.html     same page without the <html>/<head> wrapper, for the claude.ai preview

Run:  python3 build.py
"""
import base64, json, pathlib

root = pathlib.Path(__file__).parent
tpl = (root / "src/template.html").read_text(encoding="utf-8")
site = json.loads((root / "data/site.json").read_text(encoding="utf-8"))
dresses = json.loads((root / "data/dresses.json").read_text(encoding="utf-8"))
logo = "data:image/jpeg;base64," + base64.b64encode((root / "assets/logo.jpg").read_bytes()).decode()

page = (tpl.replace("__LOGO__", logo)
           .replace("__SITE__", json.dumps(site, ensure_ascii=False))
           .replace("__DRESSES__", json.dumps(dresses, ensure_ascii=False)))

(root / "dist").mkdir(exist_ok=True)
(root / "dist/preview.html").write_text(page, encoding="utf-8")

head, _, body = page.partition("</style>")
standalone = ("<!doctype html>\n<html lang=\"ko\">\n<head>\n<meta charset=\"utf-8\">\n"
              "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n"
              "<meta name=\"description\" content=\"LS 엘에스 · Love ur Skating 피겨 의상 대여\">\n"
              + head + "</style>\n</head>\n<body>\n" + body + "\n</body>\n</html>\n")
(root / "index.html").write_text(standalone, encoding="utf-8")
print("built index.html and dist/preview.html")
