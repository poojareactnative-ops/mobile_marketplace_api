export const swaggerSchemas = {
  "ApiResponse": {
    "type": "object",
    "properties": {
      "success": {
        "type": "boolean",
        "example": true
      },
      "message": {
        "type": "string",
        "example": "Operation completed successfully"
      },
      "data": {
        "type": "object"
      }
    }
  },
  "ApiError": {
    "type": "object",
    "properties": {
      "success": {
        "type": "boolean",
        "example": false
      },
      "message": {
        "type": "string",
        "example": "Detailed error explanation"
      },
      "errors": {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    }
  },
  "User": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "example": "user-uuid-101"
      },
      "name": {
        "type": "string",
        "example": "Pooja Mourya"
      },
      "email": {
        "type": "string",
        "example": "pooja@poojamobile.com"
      },
      "phone": {
        "type": "string",
        "example": "+91 98450 12345"
      },
      "role": {
        "type": "string",
        "enum": [
          "SUPER_ADMIN",
          "SUPER_SELLER",
          "SELLER_ADMIN",
          "CUSTOMER"
        ],
        "example": "SUPER_SELLER"
      },
      "status": {
        "type": "string",
        "enum": [
          "ACTIVE",
          "PENDING_APPROVAL",
          "SUSPENDED",
          "REJECTED"
        ],
        "example": "ACTIVE"
      },
      "shopId": {
        "type": "string",
        "example": "shop-uuid-001"
      },
      "createdAt": {
        "type": "string",
        "format": "date-time"
      }
    }
  },
  "Shop": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "example": "shop-uuid-001"
      },
      "ownerUserId": {
        "type": "string",
        "example": "user-uuid-101"
      },
      "name": {
        "type": "string",
        "example": "Pooja Mobile Hub"
      },
      "type": {
        "type": "string",
        "enum": [
          "SUPER_SELLER",
          "ACCESSORY_SELLER"
        ],
        "example": "SUPER_SELLER"
      },
      "description": {
        "type": "string",
        "example": "Premier smartphone repair and authentic accessories store."
      },
      "phone": {
        "type": "string",
        "example": "+91 98450 12345"
      },
      "whatsappNumber": {
        "type": "string",
        "example": "919845012345"
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
      "isActive": {
        "type": "boolean",
        "example": true
      },
      "isVerified": {
        "type": "boolean",
        "example": true
      },
      "openingHours": {
        "type": "string",
        "example": "9:00 AM - 9:00 PM"
      },
      "rating": {
        "type": "number",
        "example": 4.8
      },
      "reviewCount": {
        "type": "integer",
        "example": 124
      }
    }
  },
  "Product": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "example": "prod-101"
      },
      "shopId": {
        "type": "string",
        "example": "shop-uuid-001"
      },
      "categoryId": {
        "type": "string",
        "example": "cat-uuid-case"
      },
      "name": {
        "type": "string",
        "example": "iPhone 15 Matte Finish Shield Case"
      },
      "brand": {
        "type": "string",
        "example": "Spigen"
      },
      "sku": {
        "type": "string",
        "example": "SPG-IP15-MBL"
      },
      "conditionState": {
        "type": "string",
        "example": "New"
      },
      "warranty": {
        "type": "string",
        "example": "6 Months Brand Warranty"
      },
      "pricePaise": {
        "type": "integer",
        "description": "Price in paise (₹899.00 = 89900)",
        "example": 89900
      },
      "compareAtPricePaise": {
        "type": "integer",
        "example": 129900
      },
      "discountPercent": {
        "type": "integer",
        "example": 30
      },
      "stock": {
        "type": "integer",
        "example": 14
      },
      "status": {
        "type": "string",
        "enum": [
          "ACTIVE",
          "DRAFT",
          "OUT_OF_STOCK",
          "ARCHIVED"
        ],
        "example": "ACTIVE"
      },
      "description": {
        "type": "string",
        "example": "Military-grade shock absorption case with slim profile."
      },
      "images": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "url": {
              "type": "string",
              "example": "https://images.unsplash.com/photo-1603302576837-37561b2e2302"
            },
            "altText": {
              "type": "string",
              "example": "Spigen Case Angle"
            },
            "position": {
              "type": "integer",
              "example": 0
            }
          }
        }
      }
    }
  },
  "NearestProductItem": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "example": "prod-101"
      },
      "name": {
        "type": "string",
        "example": "iPhone 15 Matte Finish Shield Case"
      },
      "brand": {
        "type": "string",
        "example": "Spigen"
      },
      "pricePaise": {
        "type": "integer",
        "example": 89900
      },
      "compareAtPricePaise": {
        "type": "integer",
        "example": 129900
      },
      "discountPercent": {
        "type": "integer",
        "example": 30
      },
      "stock": {
        "type": "integer",
        "example": 14
      },
      "conditionState": {
        "type": "string",
        "example": "New"
      },
      "warranty": {
        "type": "string",
        "example": "6 Months Warranty"
      },
      "distanceMeters": {
        "type": "integer",
        "description": "Haversine distance from client location in meters",
        "example": 420
      },
      "shop": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "shop-uuid-001"
          },
          "name": {
            "type": "string",
            "example": "Pooja Mobile Hub"
          },
          "phone": {
            "type": "string",
            "example": "+91 98450 12345"
          },
          "whatsappNumber": {
            "type": "string",
            "example": "919845012345"
          },
          "isVerified": {
            "type": "boolean",
            "example": true
          },
          "address": {
            "type": "string",
            "example": "12/4 Brigade Road, Bangalore"
          },
          "distanceFormatted": {
            "type": "string",
            "example": "420 m away"
          }
        }
      }
    }
  },
  "SuperSellerRequest": {
    "type": "object",
    "properties": {
      "requestId": {
        "type": "string",
        "example": "req-uuid-001"
      },
      "status": {
        "type": "string",
        "enum": [
          "PENDING",
          "APPROVED",
          "REJECTED"
        ],
        "example": "PENDING"
      },
      "createdAt": {
        "type": "string",
        "format": "date-time"
      },
      "shop": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "shop-uuid-001"
          },
          "name": {
            "type": "string",
            "example": "Pooja Mobile Hub"
          },
          "type": {
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
          }
        }
      },
      "applicant": {
        "type": "object",
        "properties": {
          "userId": {
            "type": "string",
            "example": "user-uuid-101"
          },
          "name": {
            "type": "string",
            "example": "Pooja Mourya"
          },
          "email": {
            "type": "string",
            "example": "pooja@poojamobile.com"
          },
          "phone": {
            "type": "string",
            "example": "+91 98450 12345"
          }
        }
      },
      "membership": {
        "type": "object",
        "properties": {
          "planTier": {
            "type": "string",
            "example": "STARTER"
          },
          "feePaise": {
            "type": "integer",
            "example": 99900
          },
          "billingStatus": {
            "type": "string",
            "example": "MANUALLY_VERIFIED"
          }
        }
      }
    }
  },
  "SubscriptionPlan": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "example": "plan-starter-monthly"
      },
      "code": {
        "type": "string",
        "example": "STARTER_MONTHLY"
      },
      "name": {
        "type": "string",
        "example": "Starter Super Seller"
      },
      "pricePaise": {
        "type": "integer",
        "example": 99900
      },
      "durationDays": {
        "type": "integer",
        "example": 30
      },
      "maxProducts": {
        "type": "integer",
        "example": 100
      },
      "maxAdmins": {
        "type": "integer",
        "example": 3
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
      },
      "isActive": {
        "type": "boolean",
        "example": true
      }
    }
  },
  "RepairJob": {
    "type": "object",
    "properties": {
      "ticketId": {
        "type": "string",
        "example": "rep-uuid-9999"
      },
      "referenceNumber": {
        "type": "string",
        "example": "REP-9999"
      },
      "customerName": {
        "type": "string",
        "example": "Vijay Sundaram"
      },
      "customerPhone": {
        "type": "string",
        "example": "9812345678"
      },
      "deviceId": {
        "type": "string",
        "example": "Apple iPhone 14 Pro"
      },
      "problemDescription": {
        "type": "string",
        "example": "Screen glass broken, digitizer functioning normally."
      },
      "status": {
        "type": "string",
        "enum": [
          "SUBMITTED",
          "UNDER_REVIEW",
          "QUOTED",
          "APPROVED",
          "IN_PROGRESS",
          "READY",
          "COMPLETED",
          "CANCELLED",
          "NOT_REPAIRABLE"
        ],
        "example": "UNDER_REVIEW"
      },
      "estimatedCostPaise": {
        "type": "integer",
        "example": 599900
      },
      "shop": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "shop-uuid-001"
          },
          "name": {
            "type": "string",
            "example": "Pooja Mobile Hub"
          }
        }
      }
    }
  },
  "PresignedUploadResponse": {
    "type": "object",
    "properties": {
      "uploadUrl": {
        "type": "string",
        "example": "https://storage.googleapis.com/mobile_marketplace_api-storage/uploads/1727835000000-product.jpg"
      },
      "publicUrl": {
        "type": "string",
        "example": "https://storage.googleapis.com/mobile_marketplace_api-storage/uploads/1727835000000-product.jpg"
      },
      "key": {
        "type": "string",
        "example": "uploads/1727835000000-product.jpg"
      },
      "expiresInSeconds": {
        "type": "integer",
        "example": 900
      }
    }
  },
  "VisitorTrackingPayload": {
    "type": "object",
    "required": [
      "visitorId",
      "pageUrl",
      "actionType"
    ],
    "properties": {
      "visitorId": {
        "type": "string",
        "example": "vis_anon_98231"
      },
      "pageUrl": {
        "type": "string",
        "example": "https://marketplace.com/products/iphone-15"
      },
      "actionType": {
        "type": "string",
        "enum": [
          "PAGE_VIEW",
          "NEARBY_SEARCH",
          "WHATSAPP_ENQUIRY_CLICK"
        ],
        "example": "WHATSAPP_ENQUIRY_CLICK"
      },
      "shopId": {
        "type": "string",
        "example": "shop-uuid-001"
      },
      "userAgent": {
        "type": "string",
        "example": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)"
      }
    }
  }
};
