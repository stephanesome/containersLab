# build application
FROM gradle:jdk21-alpine AS build
WORKDIR /workspace
COPY . .
RUN chmod +x gradle
RUN gradle bootJar --no-daemon
# setup image
FROM eclipse-temurin:21-jdk-alpine AS image
EXPOSE 8080
RUN mkdir /app
COPY --from=build /workspace/build/libs/*.jar /app/app.jar
ENTRYPOINT ["java", "-jar","/app/app.jar"]
