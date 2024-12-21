FROM python:3.11-slim

# Install dependencies
RUN pip install --upgrade pip

# Set the working directory to /app
WORKDIR /app

# Install libs
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    make \
    curl

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
