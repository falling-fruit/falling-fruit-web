const TreeNodeText = ({
  commonName,
  shouldIncludeScientificName,
  scientificName,
  count,
}) => (
  <span className="tree-node-text">
    <span className="tree-node-common-name">{commonName}</span>
    {shouldIncludeScientificName && (
      <span className="tree-node-scientific-name">{scientificName}</span>
    )}
    <span className="tree-node-count">({count})</span>
  </span>
)

export default TreeNodeText
