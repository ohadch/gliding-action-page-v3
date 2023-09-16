FROM python:3.11

# Install dependencies
RUN pip install --upgrade pip

# Prepare the environment
RUN apt-get update -y
RUN apt-get install ffmpeg libsm6 libxext6  -y

# Set the working directory to /app
WORKDIR /app

# Install requirements
COPY requirements.txt /app/requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Entrypoint
ENTRYPOINT ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
