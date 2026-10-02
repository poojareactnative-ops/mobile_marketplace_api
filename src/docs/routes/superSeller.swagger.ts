export const superSellerSwagger = {
  "/super-seller/admins": {
    "post": {
      "tags": [
        "3. Tier 2: Super Seller (Shop Owner)"
      ],
      "summary": "Create an Admin (SELLER_ADMIN) for this Shop",
      "description": "Super Seller creates store staff / technicians with SELLER_ADMIN role.",
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
                "name",
                "email",
                "password",
                "phone"
              ],
              "properties": {
                "name": {
                  "type": "string",
                  "example": "Rajesh Kumar"
                },
                "email": {
                  "type": "string",
                  "example": "rajesh@poojamobile.com"
                },
                "password": {
                  "type": "string",
                  "example": "TempAdminPassword456!"
                },
                "phone": {
                  "type": "string",
                  "example": "+91 98765 43210"
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Admin user created successfully for this shop.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean",
                    "example": true
                  },
                  "message": {
                    "type": "string",
                    "example": "Admin user created successfully for your shop."
                  },
                  "data": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "example": "admin-uuid-501"
                      },
                      "name": {
                        "type": "string",
                        "example": "Rajesh Kumar"
                      },
                      "email": {
                        "type": "string",
                        "example": "rajesh@poojamobile.com"
                      },
                      "phone": {
                        "type": "string",
                        "example": "+91 98765 43210"
                      },
                      "role": {
                        "type": "string",
                        "example": "SELLER_ADMIN"
                      },
                      "shopId": {
                        "type": "string",
                        "example": "shop-uuid-001"
                      },
                      "status": {
                        "type": "string",
                        "example": "ACTIVE"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "409": {
          "description": "User with this email already exists."
        }
      }
    },
    "get": {
      "tags": [
        "3. Tier 2: Super Seller (Shop Owner)"
      ],
      "summary": "List Store Admins for Current Shop",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "responses": {
        "200": {
          "description": "List of store admins."
        }
      }
    }
  },
  "/super-seller/admins/{adminId}": {
    "patch": {
      "tags": [
        "3. Tier 2: Super Seller (Shop Owner)"
      ],
      "summary": "Suspend or Reactivate Store Admin",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "adminId",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "status"
              ],
              "properties": {
                "status": {
                  "type": "string",
                  "enum": [
                    "ACTIVE",
                    "SUSPENDED"
                  ],
                  "example": "SUSPENDED"
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Admin status updated successfully."
        }
      }
    },
    "delete": {
      "tags": [
        "3. Tier 2: Super Seller (Shop Owner)"
      ],
      "summary": "Remove Store Admin from Shop",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "adminId",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Admin removed successfully."
        }
      }
    }
  }
};
