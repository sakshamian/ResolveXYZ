package db

import (
	"context"
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	DB     *mongo.Database
	client *mongo.Client
)

// connects to database
func Connect() {
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(os.Getenv("MONGO_URI")).SetServerAPIOptions(serverAPI)

	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		panic(err)
	}

	DB = client.Database(os.Getenv("MONGO_DATABASE"))
	fmt.Println("Successfully connected to MongoDB!")
}

// Disconnects
func Disconnect() {
	if client != nil {
		err := client.Disconnect(context.TODO())
		if err != nil {
			fmt.Printf("Failed to disconnect MongoDB: %v\n", err)
		} else {
			fmt.Println("Disconnected from MongoDB!")
		}
	}
}

// Returns a collection object
func GetCollection(collectionName string) *mongo.Collection {
	return DB.Collection(collectionName)
}
