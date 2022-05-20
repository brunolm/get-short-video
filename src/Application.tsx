import Nullstack, { NullstackClientContext } from 'nullstack'
import './Application.css'
import { Home } from './Home'
import './tailwind.css'

declare function Head(): typeof Application.prototype.renderHead

class Application extends Nullstack {
  prepare({ page }: NullstackClientContext) {
    page.locale = 'en-US'
  }

  renderHead() {
    return (
      <head>
        <meta name="theme-color" value="#333333" />
        <link href="https://fonts.gstatic.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com/css2?family=Crete+Round&family=Roboto&display=swap" rel="stylesheet" />
      </head>
    )
  }

  render() {
    return (
      <>
        <Head />

        <main class="dark dark:bg-gray-800 dark:text-gray-200">
          <div class="container mx-auto px-4 mt-32 md:mt-0">
            <Home route="/" />
          </div>
        </main>
      </>
    )
  }
}

export default Application
