package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Resolution struct {
	RID        primitive.ObjectID `json:"r_id,omitempty" bson:"_id,omitempty"`
	UserID     primitive.ObjectID `json:"user_id" bson:"user_id"`
	Resolution string             `json:"resolution" bson:"resolution"`
	Tags       []string           `json:"tags" bson:"tags"`
	CreatedAt  time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt  time.Time          `json:"updated_at" bson:"updated_at"`
}
