import {
  Facebook,
  Github,
  Instagram,
  Slack,
} from '@styled-icons/boxicons-logos'

import { ReactComponent as X } from '../../components/entry/icons/X.svg'

const SocialButtons = ({ ...props }) => (
  <div {...props}>
    <a href="https://github.com/falling-fruit" alt="GitHub" title="GitHub">
      <Github />
    </a>
    <a
      href="https://join.slack.com/t/fallingfruit/shared_invite/zt-1oh1paonq-XJ7dBHPapv6uuBTc93~4UA"
      alt="Slack"
      title="Slack"
    >
      <Slack />
    </a>
    <a href="https://facebook.com/FallingFruit" alt="Facebook" title="Facebook">
      <Facebook />
    </a>
    <a
      href="https://instagram.com/fallingfruit"
      alt="Instagram"
      title="Instagram"
    >
      <Instagram />
    </a>
    <a href="https://x.com/Falling_Fruit" alt="X" title="X">
      <X />
    </a>
  </div>
)

export default SocialButtons
