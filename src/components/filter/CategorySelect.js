import styled from 'styled-components/macro'

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: ${({ theme, selected }) =>
    selected ? theme.transparentOrange : ''};
  border: 1px solid;
  color: ${({ theme, selected }) =>
    selected ? theme.secondaryText : theme.text};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.primaryLight};
    color: ${({ theme }) => theme.white};
    border-color: ${({ theme }) => theme.primaryLight};
  }
`

const CategorySelect = ({ categories, onChange }) => {
  const toggleCategory = (category) => {
    const newCategories = { ...categories }
    newCategories[category] = !newCategories[category]
    onChange(newCategories)
  }

  return (
    <TagContainer>
      {Object.entries(categories).map(([category, enabled]) => (
        <Tag
          key={category}
          selected={enabled}
          onClick={() => toggleCategory(category)}
        >
          {category === 'noCategory'
            ? 'No Category'
            : category.charAt(0).toUpperCase() + category.slice(1)}
        </Tag>
      ))}
    </TagContainer>
  )
}

export default CategorySelect
