import CupertinoPane from '../ui/CupertinoPane'

export default function Card({ setRef, className, children, config }) {
  return (
    <CupertinoPane setRef={setRef} className={className} config={config}>
      {children}
    </CupertinoPane>
  )
}
