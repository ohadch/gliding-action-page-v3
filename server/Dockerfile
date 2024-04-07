FROM python:3.11-slim

# Install dependencies
RUN pip install --upgrade pip

# Prepare the environment
RUN apt-get update -y
RUN apt-get install ffmpeg libsm6 libxext6 libpq-dev gcc make  -y

# Set the working directory to /app
WORKDIR /app

# Install requirements
COPY requirements.txt /app/requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app

# Make port 8000 available to the world outside this container
EXPOSE 9001

# Entrypoint
RUN chmod +x /app/entrypoint.sh
CMD ["/app/entrypoint.sh"]
