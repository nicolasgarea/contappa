.PHONY: db_up db_down db_reload test run

db_up:
	docker-compose -f docker/docker-compose.yml up -d db

db_down:
	docker-compose -f docker/docker-compose.yml rm -sf db

db_reload:
	$(MAKE) db_down
	$(MAKE) db_up

check:
	mvn -f contappa-core checkstyle:check

run:
	mvn -f contappa-core/pom.xml spring-boot:run

test:
	mvn -f contappa-core clean verify
