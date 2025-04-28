import { ListUl, X } from '@styled-icons/boxicons-regular'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components/macro'

import ImagePreview from '../ui/ImagePreview'
import ListEntry, { Icons, PrimaryText } from '../ui/ListEntry'

const remove = (list, startIndex, deleteCount) => {
  const result = Array.from(list)
  result.splice(startIndex, deleteCount)
  return result
}

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const PhotoEntry = styled(ListEntry).attrs((props) => ({
  leftIcons: [
    <ListUl size={20} key={1} />,
    <ImagePreview isUploading={props.isUploading} small key={2}>
      <img src={props.src} alt={props.alt} />
    </ImagePreview>,
  ],
  rightIcons: (
    <X size={20} onClick={props.$onDelete} style={{ cursor: 'pointer' }} />
  ),
}))`
  height: 65px;
  padding: 0;
  background-color: ${({ theme }) => theme.background};

  ${Icons} {
    margin-inline-end: 10px;
  }
`

const NewBadge = styled.div.attrs({ children: 'New photo' })`
  display: inline-block;
  background-color: ${({ theme }) => theme.blue};
  color: ${({ theme }) => theme.background};
  border-radius: 0.375em;
  padding: 2px;
`

const PhotoListContainer = styled.div`
  margin-block-end: 16px;
`

export const PhotoList = ({ photos, onChange }) => {
  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    onChange(reorder(photos, result.source.index, result.destination.index))
  }

  const entries =
    photos &&
    photos.map(({ id, image, name, isNew, isUploading }, index) => (
      <Draggable key={id} draggableId={`${id}`} index={index}>
        {(provided) => (
          <PhotoEntry
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={provided.draggableProps.style}
            src={image}
            alt={name}
            isUploading={isUploading}
            $onDelete={() => onChange(remove(photos, index, 1))}
          >
            <PrimaryText>{isNew && <NewBadge />}</PrimaryText>
            <PrimaryText>{name}</PrimaryText>
          </PhotoEntry>
        )}
      </Draggable>
    ))

  return (
    <PhotoListContainer>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {entries}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </PhotoListContainer>
  )
}
