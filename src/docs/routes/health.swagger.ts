export const healthSwagger = {
  "/health": {
    "get": {
      "tags": [
        "9. Health & System Checks"
      ],
      "summary": "API Health Check Endpoint",
      "description": "Returns server operational status and current timestamp.",
      "responses": {
        "200": {
          "description": "API is healthy and operational.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "status": {
                    "type": "string",
                    "example": "OK"
                  },
                  "timestamp": {
                    "type": "string",
                    "format": "date-time",
                    "example": "2026-10-02T08:15:00.000Z"
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
