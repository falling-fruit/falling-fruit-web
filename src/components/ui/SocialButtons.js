import {
  Facebook,
  Github,
  Instagram,
  Slack,
  Twitter,
} from '@styled-icons/boxicons-logos'

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
    <a href="https://twitter.com/Falling_Fruit" alt="Twitter" title="Twitter">
      <Twitter />
    </a>
  </div>
)

export default SocialButtons
