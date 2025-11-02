package main

import (
	"flag"
	"fmt"
	"os"
	"strings"

	"github.com/duckbugio/duckbug/internal/storage/seeds"
	"github.com/jmoiron/sqlx"
	"github.com/spf13/viper"

	_ "github.com/lib/pq"
)

type Config struct {
	Postgres postgresConf
}

type postgresConf struct {
	Dsn string
}

var configFile string

func init() {
	flag.StringVar(&configFile, "config", "", "Path to config file")
}

func loadConfig(path string) (Config, error) {
	config := Config{}

	if path != "" {
		viper.SetConfigFile(path)
		if err := viper.ReadInConfig(); err != nil {
			return config, err
		}
	}

	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AutomaticEnv()

	_ = viper.BindEnv("postgres.dsn", "POSTGRES_DSN")

	err := viper.Unmarshal(&config)
	return config, err
}

func main() {
	flag.Parse()

	config, err := loadConfig(configFile)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading config: %v\n", err)
		os.Exit(1)
	}

	if config.Postgres.Dsn == "" {
		fmt.Fprintf(os.Stderr, "Error: POSTGRES_DSN is not set\n")
		os.Exit(1)
	}

	fmt.Printf("Connecting to database...\n")
	db, err := sqlx.Connect("postgres", config.Postgres.Dsn)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	fmt.Println("🌱 Running seeds...")

	if err := seeds.SeedTechnologies(db); err != nil {
		fmt.Fprintf(os.Stderr, "Failed to seed technologies: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("✅ All seeds completed successfully!")
}
