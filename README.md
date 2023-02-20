# Auto import Swagger to postman.


## Usage

1. Clone repo
2. Copy .env.sample to .env
3. Go to Postman account and create new API key
4. Add API key to .env file
5. Add workspace name to .env file
6. RUN `npm install`
7. RUN `npm link`
8. RUN `apiup` to update your collection

## Caveat
This script will delete any existing collection in the workspace and creating a new one. You may lost your existing collection configuration.