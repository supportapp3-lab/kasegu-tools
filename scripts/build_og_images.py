"""Generate committed OGP PNGs locally; Pillow and a Japanese font are required."""
import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TITLES = {
    'home': ('備えと暮らしの数量を', '手元で、分かりやすく。'),
    'default': ('暮らしの備えを', '一つずつ、確かめる。'),
    'bichiku': ('防災備蓄 計算', '水・トイレ・主食の目安'),
    'pet-bichiku': ('ペットの防災備蓄', 'フード・水の目安'),
    'baby-bichiku': ('赤ちゃんの防災備蓄', 'ミルク・おむつの目安'),
    'toilet-bichiku': ('携帯トイレ 備蓄計算', '手持ちと不足を整理'),
    'rolling-stock': ('備蓄の期限管理', 'ローリングストック'),
    'portable-power': ('ポータブル電源', '必要な容量を計算'),
    'ensei-hi': ('ライブ遠征費', '交通・宿泊の合計を整理'),
    'planter-soil': ('プランターの土', '必要な量を計算'),
    'paint-quantity': ('塗料の必要量', '塗る面積から計算'),
    'wallpaper-quantity': ('壁紙の必要量', '寸法から計算'),
    'aquarium-volume': ('水槽の水量', 'サイズから計算'),
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--font', type=Path, required=True,
                        help='Path to a local Japanese font (not copied into the repository)')
    args = parser.parse_args()
    if not args.font.is_file():
        parser.error('--font must point to a Japanese font file')
    from PIL import Image, ImageDraw, ImageFont

    def font(size, weight):
        result = ImageFont.truetype(str(args.font), size)
        try:
            axes = result.get_variation_axes()
        except OSError:  # Static fonts do not expose variation axes.
            return result
        result.set_variation_by_axes([
            min(axis['maximum'], max(axis['minimum'], weight))
            if axis['name'] == b'Weight' else axis['default'] for axis in axes
        ])
        return result

    destination = ROOT / 'assets' / 'og'
    destination.mkdir(parents=True, exist_ok=True)
    for name, (heading, subtitle) in TITLES.items():
        image = Image.new('RGB', (1200, 630), '#f5f4ed')
        draw = ImageDraw.Draw(image)
        draw.rectangle((0, 0, 22, 629), fill='#17665d')
        draw.rounded_rectangle((76, 66, 140, 130), radius=14, fill='#17665d')
        brand = font(34, 600)
        draw.text((90, 72), '備', font=brand, fill='white')
        draw.text((160, 70), '暮らしの計算室', font=brand, fill='#173f3b')
        size = 82
        while True:
            title = font(size, 700)
            if draw.textbbox((0, 0), heading, font=title)[2] <= 1040:
                break
            size -= 2
        draw.text((76, 222), heading, font=title, fill='#173f3b')
        detail = font(44, 500)
        draw.text((80, 350), subtitle, font=detail, fill='#47625d')
        draw.line((80, 486, 1118, 486), fill='#cdd8cf', width=2)
        footer = font(26, 400)
        draw.text((80, 518), '登録不要  /  手元の条件から整理', font=footer, fill='#47625d')
        image.save(destination / (name + '.png'), optimize=True)
        print(f'assets/og/{name}.png: 1200 x 630')


if __name__ == '__main__':
    main()
