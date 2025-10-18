package technology

type Logger interface {
	Debug(msg string)
	Info(msg string)
	Warn(msg string)
	Error(msg string)
}

type Entity struct {
	ID                   int    `json:"id" example:"1"`
	Name                 string `json:"name" example:"React Native"`
	Description          string `json:"description" example:"Mobile app development framework"`
	ExampleDSNConnection string `json:"exampleDsnConnection" example:"postgresql://user:password@localhost:5432/mydb"`
}

type EntityList struct {
	Count int      `json:"count"`
	Items []Entity `json:"items"`
}
