FROM node:20.9.0

WORKDIR /home/serhii/Desktop/Programming/Course/Projects/facerecognitionapp/face_recognition_app/Server

COPY ./ ./
RUN npm install
CMD ["/bin/bash"]