# Emotion-recognition

## Introduction

•	Project Overview: - The project is designed to analyse facial expressions in video content by capturing and detecting these expressions at regular intervals of every 5 seconds. This approach allows for a detailed understanding of emotional changes over time within the video, providing insights into the dynamics of facial expressions as they evolve throughout the footage.

•	Technologies Used: - The project utilizes a combination of Django, React JS, and Amazon Rekognition to achieve its goals. Django serves as the backend framework, managing data, handling requests, and providing the necessary APIs for the application. React JS is used for building the frontend, creating an interactive and responsive user interface that allows users to interact with the system seamlessly. Amazon Rekognition, a powerful image and video analysis service, is integrated to perform the facial expression detection. It processes video frames at 5-second intervals, identifying and analysing facial expressions, and sending the results back to the frontend for visualization and further analysis. Together, these technologies create a robust system for real-time emotion detection from videos.


System Architecture
![image](https://github.com/user-attachments/assets/c1284886-aa4f-4463-a6b1-d320b53dbbbf)

AI Model Integration
1. Model Selection:
•	AI Models Used:
o	Amazon Rekognition: For facial expression detection, Amazon Rekognition was selected due to its advanced capabilities in image and video analysis. It provides robust features for detecting faces and analyzing emotions with high accuracy. The model is pre-trained by AWS, which saves time and resources compared to training a custom model from scratch.
•	Reasons for Selection:
o	Pre-trained and Scalable: Amazon Rekognition is a fully managed service that is pre-trained and scales automatically, making it suitable for processing large volumes of video data efficiently.
o	Accuracy and Reliability: It offers high accuracy in emotion detection and integrates seamlessly with other AWS services, providing reliable and actionable insights from video frames.
o	Ease of Integration: Using Amazon Rekognition eliminates the need for extensive model training and tuning, streamlining the development process.
2. Integration with Django:
•	Setup:
o	AWS SDK Integration: The Django backend uses the boto3 library to interact with AWS services. The boto3 client is configured with AWS credentials and the S3 bucket details for uploading and downloading files.
o	REST API Endpoint: The VideoUploadView class in Django REST Framework (DRF) handles video uploads. It processes the uploaded video file, extracts frames, and uploads these frames to S3.
o	Facial Expression Analysis: After uploading each frame to S3, the backend uses Amazon Rekognition's detect_faces API to analyse the emotions in each frame. The results are compiled and sent back to the frontend.
o	Exception Handling: Proper error handling and logging are implemented to manage issues related to file uploads, S3 interactions, and emotion detection.
•	Workflow:
1.	File Upload: The video file is uploaded to S3 via the Django backend.
2.	Frame Extraction: The video is processed to extract frames at 5-second intervals.
3.	Frame Upload: Each extracted frame is uploaded to S3.
4.	Emotion Detection: Amazon Rekognition analyses each frame to detect emotions.
5.	Response Preparation: The results are compiled and sent back to the frontend.
3. Interaction with ReactJS:
•	User Interaction:
o	File Upload: Users interact with the ReactJS frontend to upload a video file. The file is sent to the Django backend via an HTTP POST request using Axios.
o	Status Display: While the video is being processed, the frontend displays a loading state to indicate that the analysis is underway.
•	Data Retrieval and Display:
o	Receive Response: Once the backend completes the emotion detection, it sends the results back to the ReactJS frontend.
o	Results Display: The frontend receives the emotion data and updates the UI to display the results in a tabular format. Each entry includes the time of the frame and the detected emotions along with their confidence levels.
o	Error Handling: If any errors occur during the upload or processing stages, they are displayed to the user through alerts or notifications.
Results and Discussion

 
                                                              Fig 1. User interaction screen

 
                                             Fig 2. Results for desktop view

 
                                       Fig 3. Results for Mobile view


![image](https://github.com/user-attachments/assets/f61346e7-c618-463f-a9ef-f09b38d161e8)
