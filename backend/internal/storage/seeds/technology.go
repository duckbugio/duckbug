package seeds

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/duckbugio/duckbug/internal/modules/technology"
	"github.com/jmoiron/sqlx"
)

// SeedTechnologies inserts initial technology data into the database
func SeedTechnologies(db *sqlx.DB) error {
	now := time.Now().Unix()

	javascriptMarkdown := "## Install\n\n" +
		"To install the DuckBug JavaScript SDK, use npm or yarn:\n\n" +
		"```bash\nnpm install @duckbug/js\n# or\nyarn add @duckbug/js\n```\n\n" +
		"## Configure SDK\n\n" +
		"To capture all errors, initialize the DuckBug JavaScript SDK as soon as possible:\n\n" +
		"```javascript\nimport * as DuckBug from '@duckbug/js';\n\nDuckBug.init({\n  dsn: 'YOUR_DSN_HERE',\n});\n```\n\n" +
		"## Verify\n\n" +
		"You can capture exceptions manually:\n\n" +
		"```javascript\ntry {\n  functionThatFails();\n} catch (error) {\n  DuckBug.captureException(error);\n}\n```"

	phpMarkdown := "## Install\n\n" +
		"To install the PHP SDK, you need to be using Composer in your project. For more details about Composer, see the Composer documentation.\n\n" +
		"```bash\ncomposer require duckbug/php\n```\n\n" +
		"## Configure SDK\n\n" +
		"To capture all errors, even the one during the startup of your application, you should initialize the DuckBug PHP SDK as soon as possible:\n\n" +
		"```php\nDuckBug::init([\n    Provider::setup(\n        new DuckBugProvider(\n            'YOUR_DSN_HERE',\n        )\n    ),\n]);\n```\n\n" +
		"## Verify\n\n" +
		"In PHP you can either capture a caught exception or capture the last error:\n\n" +
		"```php\ntry {\n    $this->functionFailsForSure();\n} catch (\\Throwable $exception) {\n    DuckBug::capture($exception);\n}\n```"

	reactMarkdown := "## Install\n\n" +
		"To install the DuckBug React SDK, use npm or yarn:\n\n" +
		"```bash\nnpm install @duckbug/react\n# or\nyarn add @duckbug/react\n```\n\n" +
		"## Configure SDK\n\n" +
		"Initialize DuckBug in your React app entry point (e.g., index.js or App.js):\n\n" +
		"```jsx\nimport * as DuckBug from '@duckbug/react';\n\nDuckBug.init({\n  dsn: 'YOUR_DSN_HERE',\n});\n```\n\n" +
		"## Verify\n\n" +
		"You can capture errors in React components using Error Boundaries or manual capture:\n\n" +
		"```jsx\nimport React from 'react';\nimport * as DuckBug from '@duckbug/react';\n\nclass ErrorBoundary extends React.Component {\n  componentDidCatch(error, errorInfo) {\n    DuckBug.captureException(error, {\n      contexts: {\n        react: {\n          componentStack: errorInfo.componentStack,\n        },\n      },\n    });\n  }\n\n  render() {\n    return this.props.children;\n  }\n}\n```"

	technologies := []*technology.Technology{
		{
			Name:                 "JavaScript",
			Description:          "JavaScript programming language",
			ExampleDSNConnection: javascriptMarkdown,
			CreatedAt:            now,
			UpdatedAt:            now,
		},
		{
			Name:                 "PHP",
			Description:          "PHP programming language",
			ExampleDSNConnection: phpMarkdown,
			CreatedAt:            now,
			UpdatedAt:            now,
		},
		{
			Name:                 "React",
			Description:          "A JavaScript library for building user interfaces",
			ExampleDSNConnection: reactMarkdown,
			CreatedAt:            now,
			UpdatedAt:            now,
		},
	}

	ctx := context.Background()
	const checkQuery = `SELECT id FROM technologies WHERE name = $1`
	const insertQuery = `
		INSERT INTO technologies (name, description, example_dsn_connection, created_at, updated_at)
		VALUES (:name, :description, :example_dsn_connection, :created_at, :updated_at)
	`

	for _, tech := range technologies {
		var existingID int
		err := db.GetContext(ctx, &existingID, checkQuery, tech.Name)
		if err != nil {
			if !errors.Is(err, sql.ErrNoRows) {
				return fmt.Errorf("failed to check technology existence for %s: %w", tech.Name, err)
			}
			_, err = db.NamedExecContext(ctx, insertQuery, tech)
			if err != nil {
				return fmt.Errorf("failed to insert technology %s: %w", tech.Name, err)
			}
		} else {
			continue
		}
	}

	return nil
}
