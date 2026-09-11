import os
import subprocess
import imageio_ffmpeg

videos = [
    r"C:\Users\HP\Videos\Captures\Discover UnBound X - Google Chrome 2026-09-11 15-30-00.mp4",
    r"C:\Users\HP\Videos\Captures\Discover UnBound X - Google Chrome 2026-09-11 15-03-01.mp4"
]

out_base = r"C:\Users\HP\AppData\Local\Temp\video_frames"
os.makedirs(out_base, exist_ok=True)
ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
print("FFmpeg exe:", ffmpeg_exe)

for v_idx, video_path in enumerate(videos):
    if not os.path.exists(video_path):
        continue
    prefix = f"vid{v_idx}"
    print(f"Processing {video_path}...")
    v_out = os.path.join(out_base, prefix)
    os.makedirs(v_out, exist_ok=True)
    extract_cmd = [
        ffmpeg_exe, "-y", "-i", video_path,
        "-vf", "fps=1/2,scale=1280:-1",
        os.path.join(v_out, "frame_%03d.jpg")
    ]
    subprocess.run(extract_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    frames = os.listdir(v_out)
    print(f"Extracted {len(frames)} frames for {prefix}")

print("Done extracting!")

