const TreeNodeText = ({
  commonName,
  shouldIncludeScientificName,
  shouldIncludeCommonName,
  scientificName,
  count,
}) => (
  <span className="tree-node-text">
    {shouldIncludeCommonName && (
      <span className="tree-node-common-name">{commonName}</span>
    )}
    {shouldIncludeScientificName && (
      <span className="tree-node-scientific-name">{scientificName}</span>
    )}
    <span className="tree-node-count">({count})</span>
  </span>
)

export default TreeNodeText
