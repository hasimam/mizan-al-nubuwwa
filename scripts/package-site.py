"""Prepare only public website assets for Cloudflare Pages."""
from pathlib import Path
import shutil
import sys

root = Path(__file__).resolve().parents[1]
destination = Path(sys.argv[1]).resolve()
if destination.exists():
    raise SystemExit('Choose a new, empty output directory.')
destination.mkdir(parents=True)
shutil.copy2(root / 'index.html', destination / 'index.html')
for name in ('css', 'js', 'assets'):
    shutil.copytree(root / name, destination / name)
print('Prepared public assets; parked backups and project files excluded.')
