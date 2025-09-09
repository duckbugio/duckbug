package main

import (
	"strings"

	"github.com/spf13/viper"
)

type Config struct {
	Logger   loggerConf
	Port     int
	Postgres postgresConf
	Domain   string
	Jwt      jwtConf
}

type loggerConf struct {
	Level string
}

type postgresConf struct {
	Dsn string
}

type jwtConf struct {
	Secret string
}

func LoadConfig(path string) (Config, error) {
	config := Config{}

	if path != "" {
		viper.SetConfigFile(path)
		if err := viper.ReadInConfig(); err != nil {
			return config, err
		}
	}

	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AutomaticEnv()

	// Bind environment variables so they override config file
	_ = viper.BindEnv("logger.level", "LOGGER_LEVEL")
	_ = viper.BindEnv("port", "PORT")
	_ = viper.BindEnv("postgres.dsn", "POSTGRES_DSN")
	_ = viper.BindEnv("domain", "DOMAIN")
	_ = viper.BindEnv("jwt.secret", "JWT_SECRET")

	err := viper.Unmarshal(&config)
	return config, err
}
