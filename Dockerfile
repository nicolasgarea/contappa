FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app
COPY contappa-core/pom.xml .
COPY contappa-core/src ./src
RUN apt-get update && apt-get install -y maven && mvn clean package -DskipTests
EXPOSE 8080
CMD ["java", "-jar", "target/contappa-core-0.0.1-SNAPSHOT.jar"]
