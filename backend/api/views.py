from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
import boto3
import os
from moviepy.editor import VideoFileClip
from PIL import Image
from django.conf import settings
from rest_framework import status
import logging
import tempfile

logger = logging.getLogger(__name__)

# AWS S3 Configuration
aws_access_key_id = ''
aws_secret_access_key = ''
region_name = settings.AWS_REGION
bucket_name = '' 
folder_path = ''  

s3 = boto3.client(
    's3',
    region_name=region_name,
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key
)

class VideoUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        file = request.data.get('file')
        if not file:
            logger.error("No file provided in the request.")
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        file_name = file.name
        s3_key = f"{folder_path}/{file_name}"

        try:
            
            s3.upload_fileobj(file, bucket_name, s3_key)
            logger.info(f"File {file_name} uploaded to S3 bucket '{bucket_name}' at '{s3_key}'")

            
            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
            
                s3.download_file(bucket_name, s3_key, temp_video.name)
                
                # Process the video
                clip = VideoFileClip(temp_video.name)
                duration = clip.duration
                frame_times = range(0, int(duration), 5)

                emotions_data = []

                for i, frame_time in enumerate(frame_times):
                    frame = clip.get_frame(frame_time)
                    frame_image = Image.fromarray(frame)
                    frame_file_name = f'frame_{i}.jpg'
                    
                    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_frame:
                        frame_image.save(temp_frame.name)
                        
                        
                        frame_s3_key = f"{folder_path}/{frame_file_name}"
                        s3.upload_file(temp_frame.name, bucket_name, frame_s3_key)
                        logger.info(f"Frame {frame_file_name} uploaded to S3 bucket '{bucket_name}' at '{frame_s3_key}'")

                        
                        rekogClient = boto3.client(
                            'rekognition',
                            aws_access_key_id=aws_access_key_id,
                            aws_secret_access_key=aws_secret_access_key,
                            region_name=region_name
                        )

                        response = rekogClient.detect_faces(
                            Image={
                                'S3Object': {
                                    'Bucket': bucket_name,
                                    'Name': frame_s3_key
                                }
                            },
                            Attributes=['ALL']
                        )

                        if response['FaceDetails']:
                            emotions = response['FaceDetails'][0]['Emotions']
                            emotion_data = {emotion['Type']: round(emotion['Confidence'], 2) for emotion in emotions}
                            emotions_data.append({
                                'frame_time': frame_time,
                                'emotions': emotion_data
                            })

            # Cleanup the temporary video file
            os.remove(temp_video.name)

            return Response({'emotions': emotions_data}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error uploading file {file_name} to S3 or processing: {str(e)}")
            return Response({"error": f"Error processing file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
