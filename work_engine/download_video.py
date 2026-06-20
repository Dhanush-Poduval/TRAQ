import urllib.request

# Verified open-source test traffic video
video_url = "https://github.com/intel-iot-devkit/sample-videos/raw/master/person-bicycle-car-detection.mp4"
output_path = "test_traffic.mp4"

print("Downloading test video...")
urllib.request.urlretrieve(video_url, output_path)
print("✓ Success! Saved as 'test_traffic.mp4'")
