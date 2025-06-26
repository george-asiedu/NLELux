export const swagger = {
  swaggerDocsTitle: 'NLELux API Documentation',
  swaggerDocsDescription:
    'REST API for NLELux ecommerce platform, providing endpoints for managing products, orders, users, and more.',
  swaggerDocsVersion: '1.0.0',
  swaggerDocsPath: 'api-docs',
  productionUrl: 'https://nle_lux.onrender.com',
  localUrl: 'http://localhost:',
  globalPrefix: 'api/v1',
  noAccess: 'Url cannot access this resource',
};

export const allowedOrigins = ['http://localhost:4200'];
export const allowedMethods = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'OPTIONS',
];
export const allowedHeaders = 'Content-Type, Accept, X-Powered-By: NLELux';
