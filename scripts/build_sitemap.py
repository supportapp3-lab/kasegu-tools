"""Build a sitemap with last-modified dates from Git history."""
import argparse
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
SITEMAP_NAMESPACE = "http://www.sitemaps.org/schemas/sitemap/0.9"
SITE_BASE = "https://supportapp3-lab.github.io/kasegu-tools/"
NS = {"s": SITEMAP_NAMESPACE}


def file_for_url(url):
    if not url.startswith(SITE_BASE):
        raise ValueError(f"unsupported sitemap URL: {url}")
    parsed = urlsplit(url)
    if parsed.query or parsed.fragment:
        raise ValueError(f"sitemap URL must not contain a query or fragment: {url}")
    relative = unquote(parsed.path[len(urlsplit(SITE_BASE).path):]).lstrip("/")
    page = (ROOT / relative / "index.html").resolve()
    if not page.is_relative_to(ROOT.resolve()):
        raise ValueError(f"sitemap URL escapes the repository: {url}")
    return page


def last_modified(path):
    relative = path.relative_to(ROOT).as_posix()
    result = subprocess.run(
        ["git", "log", "-1", "--format=%cI", "--", relative],
        cwd=ROOT,
        check=False,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    value = result.stdout.strip()
    return value if result.returncode == 0 and value else None


def build_sitemap(source, output):
    if source.resolve() == output.resolve():
        raise ValueError("output path must differ from the source sitemap")
    tree = ElementTree.parse(source)
    root = tree.getroot()
    if root.tag != f"{{{SITEMAP_NAMESPACE}}}urlset":
        raise ValueError("input must be a sitemap urlset in the standard sitemap namespace")

    for entry in root.findall("s:url", NS):
        loc = entry.find("s:loc", NS)
        if loc is None or not loc.text:
            raise ValueError("each sitemap url must contain a non-empty loc")
        page = file_for_url(loc.text.strip())
        if not page.is_file():
            raise FileNotFoundError(f"{loc.text.strip()} (expected {page.relative_to(ROOT).as_posix()})")

        lastmod = entry.find("s:lastmod", NS)
        date = last_modified(page)
        if date:
            if lastmod is None:
                lastmod = ElementTree.SubElement(entry, f"{{{SITEMAP_NAMESPACE}}}lastmod")
            lastmod.text = date
        elif lastmod is not None:
            entry.remove(lastmod)

    ElementTree.register_namespace("", SITEMAP_NAMESPACE)
    data = ElementTree.tostring(root, encoding="utf-8", xml_declaration=True)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(data.replace(b"\r\n", b"\n"))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--src", type=Path, default=ROOT / "sitemap.xml", help="input sitemap (default: sitemap.xml)")
    parser.add_argument("--out", type=Path, required=True, help="generated sitemap output path")
    args = parser.parse_args()
    try:
        build_sitemap(args.src, args.out)
    except (ElementTree.ParseError, OSError, ValueError) as error:
        print(error, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
