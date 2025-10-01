.PHONY: db_up db_down db_reload test run integration-tests wait-for-app ci-tests

db_up:
	docker compose -f docker/docker-compose.yml up -d db

db_down:
	docker compose -f docker/docker-compose.yml rm -sf db

db_reload: db_down db_up

check:
	mvn -f contappa-core checkstyle:check

deploy:
	docker compose -f docker/docker-compose.yml up

wait-for-app:
	@echo "Waiting for application to be ready..."
	@timeout=60; \
	until curl -s http://localhost:8080/actuator/health | grep -q '"status":"UP"'; do \
		echo "Waiting..."; \
		sleep 2; \
		timeout=$$((timeout-2)); \
		if [ $$timeout -le 0 ]; then \
			echo "Timeout reached! App not ready."; \
			exit 1; \
		fi; \
	done
	@echo "Application is ready!"

test:
	mvn -f contappa-core clean verify

integration-tests:
	newman run postman/collections/contappa-integration-tests.postman_collection.json \
	  -e postman/enviroments/contappa-local.postman_environment.json

ci-tests: db_up
	docker compose -f docker/docker-compose.yml build backend
	docker compose -f docker/docker-compose.yml up -d
	$(MAKE) wait-for-app
	$(MAKE) integration-tests
	docker compose -f docker/docker-compose.yml down -v
