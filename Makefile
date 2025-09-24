.PHONY: db_up db_down db_reload test run integration-tests wait-for-app ci-tests


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

wait-for-app:
	@echo "Waiting for application to be ready..."
	@until curl -s http://localhost:8080/actuator/health | grep -q '"status":"UP"'; do \
		echo "Waiting..."; \
		sleep 2; \
	done
	@echo "Application is ready!"

test:
	mvn -f contappa-core clean verify

integration-tests:
	newman run postman/collections/contappa-integration-tests.postman_collection.json \
	  -e postman/enviroments/contappa-local.postman_environment.json

ci-tests:
	$(MAKE) db_up
	$(MAKE) run &
	$(MAKE) wait-for-app
	$(MAKE) integration-tests
	$(MAKE) db_down