# POS System (Point of Sale)

This is a work-in-progress **Point of Sale system** developed in Java using Spring Boot, PostgreSQL, and Docker.


 Designed using **OpenAPI (Swagger)** for clear and structured API contracts, and **DBML** for modeling the PostgreSQL database schema.

---

## Technologies Used

- Java 21
- Spring Boot
- Spring Data JPA
- PostgreSQL (via Docker)
- Docker & Docker Compose
- OpenAPI / Swagger
- DBML (Database Markup Language)
- Git & GitHub

---

## Project Status

 Under active development – not production-ready yet.

---

> The backend is not yet ready for execution.  
> However, you can already start the PostgreSQL service using Docker Compose:

```bash
# Clone the repository
git clone git@github.com:nicolasgarea/contappa.git
cd contappa/docker

# Start PostgreSQL container
docker-compose up -d db
