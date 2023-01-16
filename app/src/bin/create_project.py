"""
Generate a from every 15 seconds
usage: python create_project.py "Project name" "1/2" /path/to/video1 /path/to/video2 /path/to/video3
"""
from video_helpers import Video
from datetime import datetime,timezone
import sys
from pathlib import Path
import cv2 as cv
from imageio import imsave
import json

def convert_color(image):
    return cv.cvtColor(image, cv.COLOR_BGR2RGB)


def process_videos(project_name, video_path, sample_rate):
    time = 0
    fps = 30

    output_dir = Path('../projects') / project_name
    video_name = Path(video_path).name

    base = output_dir / 'frames' / video_name
    base.mkdir(parents=True, exist_ok=True)


    with Video(video_path, mode='read') as video:
        while True:
            frame_num = int(time * fps)
            print(frame_num, video_path)
            video.seek(frame_num)
            frame = video.read()

            if frame is None:
                break
            frame = convert_color(frame)
            imsave(base / (str(frame_num) + '.png'), frame)
            time += sample_rate
    
    return base

def current_time():
    return datetime.now(timezone.utc)


def create_project_json(name):

    now = current_time()

    return {	
        "project_name": name,	
        "created_at": str(now),	
        "updated_at": str(now),	

        "folders": {	
            "labels": "labels",	
            "videos": "videos",	
            "frames": "frames"	
        },

        "cameras": {	
            Path(video).name: str(video.resolve())
            for video in sorted((Path('../projects') / name / 'frames').iterdir())
            if len(list((Path('../projects') / name / 'frames' / Path(video).name).iterdir())) > 0
        }	

    }

def create_annotation_json(name):

    return {
    "speakers": [
        {
            "id": "Person 1",
            "color": "#959b27",
            "image": "src/assets/images/person.jpg"
        },
        {
            "id": "Person 2",
            "color": "#3b3380",
            "image": "src/assets/images/person.jpg"
        },
        {
            "id": "Person 3",
            "color": "#d90000",
            "image": "src/assets/images/person.jpg"
        },
        {
            "id": "Person 4",
            "color": "#000000",
            "image": "src/assets/images/person.jpg"
        }
    ],
    "markers": {	
            Path(video).name: {
                str(frame.name).replace('.png', ''): []
                for frame in (Path('../projects') / name / 'frames' / Path(video).name).iterdir()
            }
            for video in sorted((Path('../projects') / name / 'frames').iterdir())
            if len(list((Path('../projects') / name / 'frames' / Path(video).name).iterdir())) > 0
        }	
}

def main():
    name = sys.argv[1]
    sample_rate = eval(sys.argv[2])
    videos = sys.argv[3:]

    for video in videos:
        base = process_videos(name, video, sample_rate * 60)

    json_contents = create_project_json(name)

    with open(Path('../projects') / name / 'project.json', 'w') as f:
        json.dump(json_contents, f, indent=4)

    
    json_contents = create_annotation_json(name)

    with open(Path('../projects') / name / 'annotations.json', 'w') as f:
        json.dump(json_contents, f, indent=4)


if __name__ == '__main__':
    main()