const Swagger = require('./Swagger');

class Auth extends Swagger {
  constructor (entity) {
    super();
    this.entity = entity;
    this.paths = {};
    this.components = {};
  }

  generate () {
    this.generateAuth();
    this.generateSignin();
    this.generateSignup();
    this.generateComponents();
    return { paths: this.paths, components: this.components };
  }

  generateAuth () {
    this.paths['/auth'] = {
      get: {
        operationId: 'auth',
        tags: ['Auth'],
        summary: 'Get current autenticated model from the Token',
        description: 'Get current autenticated model from the Token. Helpfull if you need to get a fresh copy of the current user or model',
        responses: this.getResponses(),
        security: [
          {
            jwt: []
          }
        ]
      }
    };
  }

  generateSignin () {
    const properties = {
      phone: {
        description: 'Identification for Authentication',
        type: 'string',
        required: true
      },
      password: {
        description: 'Secret code for Authentication',
        type: 'string',
        format: 'password',
        required: true
      }
    };

    this.paths['/signin'] = {
      post: {
        operationId: 'signin',
        tags: ['Auth'],
        summary: 'Signin to get a Token for Authentication',
        description: 'Signin with Identification/Secret from an existing account to get a JWT Token for Authentication. Default pass in seeds is: Pass1234',
        responses: this.getResponses(),
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                description: 'JSON string containing info for signin',
                required: ['phone', 'password'],
                type: 'object',
                properties
              }
            },
            'application/x-www-form-urlencoded': {
              schema: {
                description: 'JSON string containing info for signin',
                required: ['phone', 'password'],
                type: 'object',
                properties
              }
            }
          }
        }
      }
    };
  }

  generateSignup () {
    const properties = {};
    const required = [];

    this.entity.fields.forEach(field => {
      let type = field.type;
      if (type === 'decimal') {
        type = 'number'
      }

      properties[field.name] = {
        type
      };

      if (field.nullable === false) {
        required.push(field.name);
      }
    });

    this.paths['/signup'] = {
      post: {
        operationId: 'signup',
        tags: ['Auth'],
        summary: 'Signup to create an account and automatically get a Token for Authentication',
        description: 'Signup with Identification/Secret and other info to create an account and automatically get a JWT Token for Authentication.',
        responses: this.getResponses(),
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                description: 'JSON string containing info for signup',
                required,
                type: 'object',
                properties
              }
            },
            'application/x-www-form-urlencoded': {
              schema: {
                description: 'JSON string containing info for signup',
                required,
                type: 'object',
                properties
              }
            }
          }
        }
      }
    };
  }

  generateComponents () {
    this.components = {
      securitySchemes: {
        jwt: {
          type: 'http',
          description: 'JSON Web Token (JWT) security. You can get a Token from Login or Register endpoint. N.B. in Swagger UI do not put the word Bearer before the token',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  }
}

module.exports = Auth;
