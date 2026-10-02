export const superAdminSwagger = {
  "/super-admin/requests": {
    "get": {
      "tags": [
        "2. Tier 1: Super Admin (Platform Owner)"
      ],
      "summary": "List Super Seller Onboarding Requests",
      "description": "Lists all pending, approved, or rejected shop registration requests with membership tier data.",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "status",
          "in": "query",
          "schema": {
            "type": "string",
            "enum": [
              "PENDING",
              "APPROVED",
              "REJECTED"
            ]
          },
          "description": "Filter by approval status"
        },
        {
          "name": "billingStatus",
          "in": "query",
          "schema": {
            "type": "string",
            "enum": [
              "FREE_TIER",
              "MANUALLY_VERIFIED",
              "PENDING_APPROVAL",
              "EXEMPT"
            ]
          }
        },
        {
          "name": "page",
          "in": "query",
          "schema": {
            "type": "integer",
            "default": 1
          }
        },
        {
          "name": "limit",
          "in": "query",
          "schema": {
            "type": "integer",
            "default": 20
          }
        }
      ],
      "responses": {
        "200": {
          "description": "List of Super Seller onboarding requests.",
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
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/SuperSellerRequest"
                    }
                  },
                  "meta": {
                    "type": "object",
                    "properties": {
                      "totalPending": {
                        "type": "integer",
                        "example": 4
                      },
                      "totalApproved": {
                        "type": "integer",
                        "example": 38
                      },
                      "total": {
                        "type": "integer",
                        "example": 42
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "403": {
          "description": "Forbidden. Super Admin authorization required."
        }
      }
    }
  },
  "/super-admin/requests/{requestId}/approve": {
    "patch": {
      "tags": [
        "2. Tier 1: Super Admin (Platform Owner)"
      ],
      "summary": "Accept & Approve Super Seller Request (Shop Activation)",
      "description": "Approves a Super Seller request, activates user account, activates the storefront for nearby client searches, and grants the verified badge. No payment gateway needed.",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "requestId",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          },
          "example": "req-uuid-001"
        }
      ],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "grantVerificationBadge": {
                  "type": "boolean",
                  "default": true
                },
                "planTier": {
                  "type": "string",
                  "enum": [
                    "STANDARD_FREE",
                    "STARTER",
                    "PRO",
                    "ENTERPRISE"
                  ],
                  "default": "STARTER"
                },
                "billingStatus": {
                  "type": "string",
                  "enum": [
                    "FREE_TIER",
                    "MANUALLY_VERIFIED",
                    "EXEMPT"
                  ],
                  "default": "MANUALLY_VERIFIED"
                },
                "adminNotes": {
                  "type": "string",
                  "example": "Physical storefront verified on Brigade Road. GST documents valid."
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Super Seller request successfully approved.",
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
                    "example": "Super Seller request approved. Shop is now activated and live for nearby clients."
                  },
                  "data": {
                    "type": "object",
                    "properties": {
                      "requestId": {
                        "type": "string",
                        "example": "req-uuid-001"
                      },
                      "status": {
                        "type": "string",
                        "example": "APPROVED"
                      },
                      "shopId": {
                        "type": "string",
                        "example": "shop-uuid-001"
                      },
                      "isVerified": {
                        "type": "boolean",
                        "example": true
                      },
                      "isActive": {
                        "type": "boolean",
                        "example": true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "404": {
          "description": "Request not found."
        }
      }
    }
  },
  "/super-admin/requests/{requestId}/reject": {
    "patch": {
      "tags": [
        "2. Tier 1: Super Admin (Platform Owner)"
      ],
      "summary": "Reject Super Seller Request",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "requestId",
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
                "rejectionReason"
              ],
              "properties": {
                "rejectionReason": {
                  "type": "string",
                  "example": "Address could not be verified. Please re-submit with valid business proof."
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Request rejected successfully."
        }
      }
    }
  },
  "/super-admin/plans": {
    "get": {
      "tags": [
        "2. Tier 1: Super Admin (Platform Owner)"
      ],
      "summary": "List Subscription Plans (Monetization)",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "responses": {
        "200": {
          "description": "List of subscription plans available for Super Sellers.",
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
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/SubscriptionPlan"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "post": {
      "tags": [
        "2. Tier 1: Super Admin (Platform Owner)"
      ],
      "summary": "Create / Update Subscription Plan (Direct Admin Control)",
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
                "code",
                "name",
                "pricePaise"
              ],
              "properties": {
                "code": {
                  "type": "string",
                  "example": "PRO_ANNUAL"
                },
                "name": {
                  "type": "string",
                  "example": "Pro Annual Super Seller"
                },
                "pricePaise": {
                  "type": "integer",
                  "description": "Price in paise (₹9,999.00 = 999900)",
                  "example": 999900
                },
                "durationDays": {
                  "type": "integer",
                  "example": 365
                },
                "maxProducts": {
                  "type": "integer",
                  "example": 500
                },
                "maxAdmins": {
                  "type": "integer",
                  "example": 10
                },
                "featuresJson": {
                  "type": "object",
                  "properties": {
                    "priorityNearbyRanking": {
                      "type": "boolean",
                      "example": true
                    },
                    "whatsappLeadAnalytics": {
                      "type": "boolean",
                      "example": true
                    },
                    "verifiedBadgeIncluded": {
                      "type": "boolean",
                      "example": true
                    }
                  }
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Plan created successfully."
        }
      }
    }
  },
  "/super-admin/analytics": {
    "get": {
      "tags": [
        "2. Tier 1: Super Admin (Platform Owner)"
      ],
      "summary": "Platform-wide Traffic, Visitor & Lead Analytics",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "period",
          "in": "query",
          "schema": {
            "type": "string",
            "enum": [
              "24h",
              "7d",
              "30d",
              "90d",
              "all"
            ],
            "default": "30d"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Visitor and platform analytics."
        }
      }
    }
  }
};
