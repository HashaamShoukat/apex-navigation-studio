# Assembles docs/images/preview.gif from the frames of qa/gif.cjs: python3 qa/gif.py  (needs Pillow)
import glob, os
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__))
frames = [Image.open(f).convert("RGB").resize((960, 600), Image.LANCZOS) for f in sorted(glob.glob(os.path.join(here, "out/gif/*.png")))]
pal = [f.quantize(colors=200, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE) for f in frames]
pal[0].save(os.path.join(here, "../docs/images/preview.gif"), save_all=True, append_images=pal[1:], duration=1500, loop=0, optimize=True)
