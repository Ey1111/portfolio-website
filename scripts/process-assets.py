from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from PIL import Image, ImageOps
import json
import shutil
import subprocess


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source-materials" / "full"
OUTPUT = ROOT / "public" / "materials"
MANIFEST = ROOT / "src" / "materials.json"
FFMPEG = "ffmpeg"

MEDIA_IMAGES = {".jpg", ".jpeg", ".png", ".webp"}
MEDIA_VIDEOS = {".mp4", ".mov", ".m4v"}


def display_name(path: Path) -> str:
    return path.stem.replace("_", " ")


def make_image(source: Path, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
        image.save(target, "WEBP", quality=84, method=6)


def make_video(source: Path, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            FFMPEG,
            "-y",
            "-i",
            str(source),
            "-vf",
            "scale='min(1280,iw)':-2:flags=lanczos,fps=24",
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "30",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            "-c:a",
            "aac",
            "-b:a",
            "96k",
            str(target),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    records = {key: [] for key in ("nextmind", "chocolate", "vpc", "yoyo", "antifraud", "hobbies")}
    video_jobs = []

    for project_dir in sorted(path for path in SOURCE.iterdir() if path.is_dir()):
        key = project_dir.name
        files = sorted(path for path in project_dir.rglob("*") if path.is_file())
        for index, source in enumerate(files, 1):
            extension = source.suffix.lower()
            relative_source = source.relative_to(project_dir)
            base = f"{index:02d}"

            if extension in MEDIA_IMAGES:
                target = OUTPUT / key / "media" / f"{base}.webp"
                make_image(source, target)
                kind = "image"
            elif extension in MEDIA_VIDEOS:
                target = OUTPUT / key / "media" / f"{base}.mp4"
                video_jobs.append((source, target))
                kind = "video"
            else:
                target = OUTPUT / key / "files" / f"{base}{extension}"
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, target)
                kind = "document"

            records[key].append(
                {
                    "id": f"{key}-{index:02d}",
                    "name": display_name(source),
                    "originalName": source.name,
                    "sourceGroup": str(relative_source.parent).replace("\\", " / "),
                    "kind": kind,
                    "extension": extension.lstrip(".").upper(),
                    "url": "/" + str(target.relative_to(ROOT / "public")).replace("\\", "/"),
                    "size": source.stat().st_size,
                }
            )

    with ThreadPoolExecutor(max_workers=3) as pool:
        jobs = {pool.submit(make_video, source, target): source for source, target in video_jobs}
        for future in as_completed(jobs):
            source = jobs[future]
            future.result()
            print(f"video: {source.name}")

    profile = Path(r"D:\AAA关于简历\证件照-白底.png")
    make_image(profile, ROOT / "public" / "assets" / "profile-color.webp")
    MANIFEST.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Wrote {sum(len(items) for items in records.values())} records to {MANIFEST}")


if __name__ == "__main__":
    main()
