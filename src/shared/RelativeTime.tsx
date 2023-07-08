import { DateTime } from 'luxon'
import Nullstack, { NullstackClientContext } from 'nullstack'

interface Props {
  date: DateTime
}

export class RelativeTime extends Nullstack<Props> {
  force = 0

  hydrate({ environment, date }: NullstackClientContext<Props>) {
    if (environment.client) {
      setInterval(() => {
        this.force ^= 1
      }, 1000)
    }
  }

  render({ date }: Props) {
    return (
      <span data-refresh={`rt-${this.force}`} class="text-sm">
        {date.toRelative()}
      </span>
    )
  }
}
