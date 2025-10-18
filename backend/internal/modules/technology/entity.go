package technology

type Technology struct {
	ID                   int    `db:"id"`
	Name                 string `db:"name"`
	Description          string `db:"description"`
	ExampleDSNConnection string `db:"example_dsn_connection"`
	CreatedAt            int64  `db:"created_at"`
	UpdatedAt            int64  `db:"updated_at"`
}
