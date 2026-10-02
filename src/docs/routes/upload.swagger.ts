export const uploadSwagger = {
  "/uploads/presign": {
    "post": {
      "tags": [
        "8. Media & File Uploads"
      ],
      "summary": "Generate Presigned File Upload URL",
      "description": "Generates secure S3 / cloud storage upload destination for product photos and verification documents.",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "filename",
                "filetype"
              ],
              "properties": {
                "filename": {
                  "type": "string",
                  "example": "iphone15_case_cover.png"
                },
                "filetype": {
                  "type": "string",
                  "example": "image/png"
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Presigned upload URL created.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean",
                    "example": true
                  },
                  "data": {
                    "$ref": "#/components/schemas/PresignedUploadResponse"
                  }
                }
              }
            }
          }
        },
        "401": {
          "description": "Unauthorized"
        }
      }
    }
  }
};
