import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack'
import '../tailwind.css'
import './Application.css'
import { Home } from './Home'

declare function Head(): NullstackNode

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
          <div class="container mx-auto px-4 mt-0">
            <Home route="/" />
          </div>
        </main>
      </>
    )
  }
}

export default Application
