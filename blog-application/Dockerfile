# Multi-stage build for smaller image size
FROM maven:3.8.3-openjdk-17 AS build
WORKDIR /app

# Copy pom.xml first for better caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Production stage
FROM openjdk:17.0.1-jdk-slim
WORKDIR /app

# Create uploads directory
RUN mkdir -p /app/uploads

# Copy the built JAR file (correct artifact name)
COPY --from=build /app/target/blog-application-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Set environment variables with defaults
ENV SPRING_PROFILES_ACTIVE=docker \
    JAVA_OPTS="-Xms256m -Xmx512m"

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]