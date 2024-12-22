package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Likes struct {
	ID        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	UserID    primitive.ObjectID `json:"user_id" bson:"user_id"`
	RID       primitive.ObjectID `json:"r_id,omitempty" bson:"r_id,omitempty"`
	CreatedAt time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt time.Time          `json:"updated_at" bson:"updated_at"`
}
