export const authSwagger = {
  "/auth/register-super-seller": {
    "post": {
      "tags": [
        "1. Authentication"
      ],
      "summary": "Super Seller Registration & Onboarding Request",
      "description": "Submits a Super Seller registration request. Creates a pending account and shop for Super Admin review. No payment gateway involved.",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "name",
                "email",
                "phone",
                "password",
                "shopName",
                "shopType",
                "address"
              ],
              "properties": {
                "name": {
                  "type": "string",
                  "example": "Pooja Mourya"
                },
                "email": {
                  "type": "string",
                  "example": "pooja@poojamobile.com"
                },
                "password": {
                  "type": "string",
                  "example": "StrongSecurePassword123!"
                },
                "phone": {
                  "type": "string",
                  "example": "+91 98450 12345"
                },
                "shopName": {
                  "type": "string",
                  "example": "Pooja Mobile Hub"
                },
                "shopType": {
                  "type": "string",
                  "example": "SUPER_SELLER"
                },
                "address": {
                  "type": "string",
                  "example": "12/4 Brigade Road, Bangalore"
                },
                "latitude": {
                  "type": "number",
                  "example": 12.9716
                },
                "longitude": {
                  "type": "number",
                  "example": 77.5946
                },
                "whatsappNumber": {
                  "type": "string",
                  "example": "919845012345"
                },
                "businessDocUrl": {
                  "type": "string",
                  "example": "https://example.com/gst-cert.pdf"
                },
                "openingHours": {
                  "type": "string",
                  "example": "9:00 AM - 9:00 PM"
                },
                "planType": {
                  "type": "string",
                  "example": "STARTER_MONTHLY"
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Super Seller request submitted successfully in PENDING_APPROVAL status."
        },
        "409": {
          "description": "Email already registered."
        }
      }
    }
  },
  "/auth/login": {
    "post": {
      "tags": [
        "1. Authentication"
      ],
      "summary": "Log in with Email and Password",
      "description": "Authenticates a Super Admin, Super Seller, or Seller Admin and returns Access & Refresh JWT tokens.",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "email",
                "password"
              ],
              "properties": {
                "email": {
                  "type": "string",
                  "example": "superadmin@marketplace.internal"
                },
                "password": {
                  "type": "string",
                  "example": "AdminSecurePass2026!"
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Login successful with JWT access tokens and user profile."
        },
        "401": {
          "description": "Invalid email or password."
        },
        "403": {
          "description": "Account pending approval or suspended."
        }
      }
    }
  },
  "/auth/refresh": {
    "post": {
      "tags": [
        "1. Authentication"
      ],
      "summary": "Refresh Access Token",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "refreshToken"
              ],
              "properties": {
                "refreshToken": {
                  "type": "string",
                  "example": "eyJhbGciOiJIUzI1NiIsIn..."
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "New access token issued."
        },
        "401": {
          "description": "Invalid or expired refresh token."
        }
      }
    }
  },
  "/auth/me": {
    "get": {
      "tags": [
        "1. Authentication"
      ],
      "summary": "Get Current Authenticated User Profile & Shop",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "responses": {
        "200": {
          "description": "Current user profile with shop and application status."
        },
        "401": {
          "description": "Unauthorized."
        }
      }
    }
  },
  "/auth/register-seller": {
    "post": {
      "tags": [
        "1. Authentication"
      ],
      "summary": "Register Seller / Store Owner Onboarding Request",
      "description": "Registers a new Super Seller account and creates their pending shop profile. Returns access & refresh tokens with status PENDING_APPROVAL.",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "name",
                "email",
                "phone",
                "password",
                "shopName",
                "shopType",
                "address"
              ],
              "properties": {
                "name": {
                  "type": "string",
                  "example": "Pooja Mourya"
                },
                "email": {
                  "type": "string",
                  "example": "pooja@poojamobile.com"
                },
                "password": {
                  "type": "string",
                  "example": "StrongSecurePassword123!"
                },
                "phone": {
                  "type": "string",
                  "example": "+91 98450 12345"
                },
                "shopName": {
                  "type": "string",
                  "example": "Pooja Mobile Hub"
                },
                "shopType": {
                  "type": "string",
                  "example": "SUPER_SELLER"
                },
                "address": {
                  "type": "string",
                  "example": "12/4 Brigade Road, Bangalore"
                },
                "latitude": {
                  "type": "number",
                  "example": 12.9716
                },
                "longitude": {
                  "type": "number",
                  "example": 77.5946
                },
                "whatsappNumber": {
                  "type": "string",
                  "example": "919845012345"
                },
                "businessDocUrl": {
                  "type": "string",
                  "example": "https://example.com/gst-cert.pdf"
                },
                "openingHours": {
                  "type": "string",
                  "example": "9:00 AM - 9:00 PM"
                },
                "planType": {
                  "type": "string",
                  "example": "STARTER_MONTHLY"
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Super Seller request submitted successfully in PENDING_APPROVAL status."
        },
        "409": {
          "description": "Email already registered."
        }
      }
    }
  },
  "/auth/logout": {
    "post": {
      "tags": [
        "1. Authentication"
      ],
      "summary": "User Logout",
      "description": "Invalidates user session. Authenticated users provide Bearer token.",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "responses": {
        "200": {
          "description": "Successfully logged out.",
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
                    "example": "Logged out successfully"
                  }
                }
              }
            }
          }
        },
        "401": {
          "description": "Unauthorized / Missing token."
        }
      }
    }
  }
};
