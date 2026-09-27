import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/',
  realm: 'FaculdadeApp',
  clientId: 'frontend-app',
});

export default keycloak;