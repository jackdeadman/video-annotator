import cv2
from io import UnsupportedOperation

def load_video(path):
    return cv2.VideoCapture(path)

def create_video(file, width=500, height=500, fps=30.0):
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    output_video = cv2.VideoWriter(file, fourcc, fps, (width, height))


class VideoReader:

    def __init__(self, path):
        self.__video = cv2.VideoCapture(path)

    def write(self):
        raise UnsupportedOperation("Cannot write when file mode is read")
    
    def read(self):
        return self.__video.read()

    def __next__(self):
        has_next_frame, frame = self.read()
        if has_next_frame:
            return frame
        else:
            raise StopIteration
    
    def close(self):
        self.__video.release()
    
    def get(self, value):
        return self.__video.get(value)

    def set(self, key, value):
        self.__video.set(key, value)

class VideoWriter:

    # 1920 x 1080 default
    def __init__(self, file, *, fps=30, width=1920, height=1080):
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        self.__video = cv2.VideoWriter(file, fourcc, fps, (width, height))

    def write(self, frame):
        self.__video.write(frame)

    def read(self):
        raise UnsupportedOperation("Cannot read when file mode is write")
    
    def __next__(self):
        raise UnsupportedOperation("Cannot loop through file being written to")

    def close(self):
        self.__video.release()
    
    def get(self, key):
        return self.__video.get(key)
    
    def set(self, key, value):
        self.__video.set(key, value)

class Video:
    # 1920 x 1080 default
    def __init__(self, path, *, mode, width=1920, height=1080, fps=30):
        """
        path: path to file
        mode: read | write
        """
        self.frame_no = 1
        if mode == 'read':
            self.__backend = VideoReader(path)
        elif mode == 'write':
            self.__backend = VideoWriter(path, width=width, height=height, fps=fps)
        else:
            raise ValueError("Mode must be read or write")
    
    def __enter__(self):
        return self
    
    def __exit__(self, type, value, traceback):
        return self.__backend.close()

    def read(self):
        return self.__backend.read()[1]
    
    def write(self, frame):
        self.__backend.write(frame)
    
    def __iter__(self):
        return self
    
    def __next__(self):
        return self.__backend.__next__()
    
    def seek(self, frame_no):
        self.__backend.set(cv2.CAP_PROP_POS_FRAMES, frame_no)
        self.frame_no = frame_no
    
    @property
    def frames(self):
        return int(self.__backend.get(cv2.CAP_PROP_FRAME_COUNT))