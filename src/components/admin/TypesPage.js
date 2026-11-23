import { X } from '@styled-icons/boxicons-regular'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useHistory, useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { LANGUAGE_OPTIONS } from '../../i18n'
import { fetchAndLocalizeTypes } from '../../redux/typeSlice'
import { getTypeCounts, getTypes } from '../../utils/api'
import { selectIsAdmin, selectIsAuthLoading } from '../../utils/isAdmin'
import Button from '../ui/Button'
import { PageHeader } from '../ui/Headers'
import Input from '../ui/Input'
import { MultiSelect } from '../ui/MultiSelect'
import { InfoPage } from '../ui/PageTemplate'
import SingleSelect from '../ui/SingleSelect'
import MultiTypePanel from './MultiTypePanel'
import NewTypeForm from './NewTypeForm'
import TypeDetails from './TypeDetails'
import TypesOverview from './TypesOverview'
import TypesTree from './TypesTree'
import { CATEGORY_OPTIONS, typeStrings } from './typeStrings'
import { IconButton } from './typeStyles'
import {
  buildTypeOptions,
  DEFAULT_FILTERS,
  ENGLISH_KEY,
  NO_LANGUAGE,
  plainLabel,
  UNCATEGORIZED,
  WORLD_BOUNDS,
} from './typeUtils'
import { useTypeMutations } from './useTypeMutations'
import { useTypesTree } from './useTypesTree'

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75em 1em;
  margin-block-end: 1em;
`

const LanguageContainer = styled.div`
  min-width: 14em;
`

const SearchContainer = styled.div`
  flex: 1;
  min-width: 12em;
  max-width: 24em;
`

const Split = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5em;
`

const TreePane = styled.div`
  flex: 0 0 min(36em, 45%);
  position: sticky;
  top: 0.5em;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 14em);
  min-height: 12em;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.secondaryBackground};
  border-radius: 0.375em;
`

const Notice = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 0.75em;
  padding: 0.5em 0.75em;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.secondaryText};
  background: ${({ theme }) => theme.navBackground};
  border-block-end: 1px solid ${({ theme }) => theme.secondaryBackground};

  & > span {
    flex: 1;
  }
`

const FilterContainer = styled.div`
  flex: 1;
  min-width: 14em;
  max-width: 24em;
`

const DetailPane = styled.div`
  flex: 1;
  min-width: 0;
`

const Message = styled.p`
  padding: 1em;
  margin: 0;
`

const languageOptions = [
  { value: NO_LANGUAGE, label: typeStrings.toolbar.languageNone },
  ...LANGUAGE_OPTIONS,
]

const conditionOptions = [
  { value: 'pending', label: typeStrings.toolbar.pending },
  { value: 'errors', label: typeStrings.toolbar.errors },
  { value: 'withLocations', label: typeStrings.toolbar.withLocations },
  { value: 'withoutLocations', label: typeStrings.toolbar.withoutLocations },
  ...CATEGORY_OPTIONS,
  { value: UNCATEGORIZED, label: typeStrings.toolbar.uncategorized },
]

const TypesPage = () => {
  const isAdmin = useSelector(selectIsAdmin)
  const isAuthLoading = useSelector(selectIsAuthLoading)
  const { typeId } = useParams()
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const { i18n } = useTranslation()
  const isCreating = typeId === 'new'
  const selectedId = typeId && !isCreating ? Number(typeId) : null

  const [types, setTypes] = useState(null)
  const [counts, setCounts] = useState(new Map())
  const [loadError, setLoadError] = useState(null)
  const [language, setLanguage] = useState(ENGLISH_KEY)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [notice, setNotice] = useState({ message: typeStrings.tree.dragHint })
  const [multiSelected, setMultiSelected] = useState(new Set())
  const anchorId = useRef(null)
  const hasChanges = useRef(false)

  const load = useCallback(async () => {
    try {
      const [typeList, countList] = await Promise.all([
        getTypes(),
        getTypeCounts({ bounds: WORLD_BOUNDS }),
      ])
      setTypes(typeList)
      setCounts(new Map(countList.map(({ id, count }) => [id, count])))
      setLoadError(null)
    } catch (error) {
      setLoadError(error.message ?? String(error))
    }
  }, [])

  useEffect(() => {
    if (isAdmin) {
      load()
    }
  }, [isAdmin, load])

  useEffect(
    () => () => {
      if (hasChanges.current) {
        dispatch(fetchAndLocalizeTypes(i18n.language))
      }
    },
    [dispatch, i18n.language],
  )

  const {
    typeList,
    typeById,
    childrenMap,
    searchIndex,
    validationErrors,
    rows,
    indexById,
    canExpandAll,
    canCollapseAll,
    toggle,
    expand,
    expandAll,
    collapseAll,
    findNext,
  } = useTypesTree({ types, counts, language, filters, selectedId })

  const typeOptions = useMemo(
    () => buildTypeOptions(typeList, language, searchIndex),
    [typeList, language, searchIndex],
  )

  const handleTypeChange = useCallback((updated) => {
    hasChanges.current = true
    setTypes((previous) =>
      previous.map((type) => (type.id === updated.id ? updated : type)),
    )
  }, [])

  const handleTypeAdded = useCallback((created) => {
    hasChanges.current = true
    setTypes((previous) => [...previous, created])
  }, [])

  const { canMove, moveTypes, undoMoves, unpendTypes, createType } =
    useTypeMutations({
      typeById,
      childrenMap,
      onTypeUpdated: handleTypeChange,
      onTypeAdded: handleTypeAdded,
    })

  const updateFilters = (changes) =>
    setFilters((previous) => ({ ...previous, ...changes }))

  const handleSelect = (id) => {
    setMultiSelected(new Set())
    anchorId.current = id
    history.push(`/admin/types/${id}`)
  }

  const handleDeselect = () => {
    setMultiSelected(new Set())
    anchorId.current = null
    history.push('/admin/types')
  }

  const handleRowClick = (id, event, visibleIds) => {
    if (event.shiftKey) {
      const anchor = visibleIds.includes(anchorId.current)
        ? anchorId.current
        : visibleIds.includes(selectedId)
          ? selectedId
          : id
      const from = visibleIds.indexOf(anchor)
      const to = visibleIds.indexOf(id)
      const range = visibleIds.slice(Math.min(from, to), Math.max(from, to) + 1)
      setMultiSelected(
        new Set(
          event.ctrlKey || event.metaKey ? [...multiSelected, ...range] : range,
        ),
      )
    } else if (event.ctrlKey || event.metaKey) {
      const next = new Set(multiSelected)
      if (next.size === 0 && selectedId) {
        next.add(selectedId)
      }
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      anchorId.current = id
      if (next.size === 0) {
        handleDeselect()
      } else {
        setMultiSelected(next)
      }
    } else if (id === selectedId && multiSelected.size === 0) {
      handleDeselect()
    } else {
      handleSelect(id)
    }
  }

  const handleJump = (isTarget, emptyMessage) => {
    const id = findNext(isTarget)
    if (id === null) {
      toast.info(emptyMessage)
    } else {
      handleSelect(id)
    }
  }

  const handleMove = async (typeIds, parentId) => {
    const parent = parentId === null ? null : typeById.get(parentId)
    const moves = await moveTypes(typeIds, parentId)
    if (moves.length > 0) {
      if (parentId !== null) {
        expand(parentId)
      }
      setMultiSelected(new Set())
      const parentLabel = parent ? plainLabel(parent, language) : null
      setNotice({
        moves,
        message:
          moves.length === 1
            ? typeStrings.tree.moved(
                plainLabel(typeById.get(moves[0].typeId), language),
                parentLabel,
              )
            : typeStrings.tree.movedMany(moves.length, parentLabel),
      })
    }
  }

  const handleUnpend = async (typeIds) => {
    const count = await unpendTypes(typeIds)
    if (count > 0) {
      setNotice({ message: typeStrings.multi.unpended(count) })
    }
  }

  const handleUndo = async () => {
    const remaining = await undoMoves(notice.moves)
    setNotice(remaining.length > 0 ? { ...notice, moves: remaining } : null)
  }

  const handleStructureChange = async (nextSelectedId) => {
    hasChanges.current = true
    setMultiSelected(new Set())
    await load()
    history.push(
      nextSelectedId ? `/admin/types/${nextSelectedId}` : '/admin/types',
    )
  }

  const startCreating = (childIds = []) => {
    const parentIds = new Set(
      childIds.map((id) => typeById.get(id)?.parent_id ?? null),
    )
    const params = new URLSearchParams()
    if (childIds.length > 0) {
      params.set('children', childIds.join(','))
    }
    if (parentIds.size === 1 && [...parentIds][0] !== null) {
      params.set('parent', String([...parentIds][0]))
    }
    const query = params.toString()
    history.push(`/admin/types/new${query ? `?${query}` : ''}`)
  }

  const parentCandidateIds =
    multiSelected.size > 0 ? [...multiSelected] : selectedId ? [selectedId] : []

  const handleCreate = async (data, childIds) => {
    const result = await createType(data, childIds)
    if (result) {
      const name = plainLabel(result.created, language)
      setMultiSelected(new Set())
      if (data.parent_id) {
        expand(data.parent_id)
      }
      expand(result.created.id)
      setNotice({
        message:
          childIds.length > 0
            ? typeStrings.tree.createdWithChildren(name, result.movedCount)
            : typeStrings.tree.created(name),
      })
      history.push(`/admin/types/${result.created.id}`)
    }
  }

  const initialChildIds = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return (params.get('children') ?? '')
      .split(',')
      .map(Number)
      .filter((id) => id > 0 && typeById.has(id))
  }, [location.search, typeById])

  const initialParentId = useMemo(() => {
    const parentId = Number(new URLSearchParams(location.search).get('parent'))
    return typeById.has(parentId) ? parentId : null
  }, [location.search, typeById])

  if (!isAdmin && !isAuthLoading) {
    return <Redirect to="/map" />
  }

  const selectedType = selectedId ? typeById.get(selectedId) : null
  const isMultiSelect = multiSelected.size > 1

  return (
    <InfoPage fullWidth>
      <PageHeader>{typeStrings.title}</PageHeader>
      <Toolbar>
        <LanguageContainer>
          <SingleSelect
            options={languageOptions}
            value={language}
            onChange={(option) => setLanguage(option.value)}
            aria-label={typeStrings.toolbar.language}
          />
        </LanguageContainer>
        <SearchContainer>
          <Input
            value={filters.search}
            onChange={(event) => updateFilters({ search: event.target.value })}
            placeholder={typeStrings.toolbar.searchPlaceholder}
          />
        </SearchContainer>
        <FilterContainer>
          <MultiSelect
            options={conditionOptions}
            value={conditionOptions.filter(({ value }) =>
              filters.conditions.includes(value),
            )}
            onChange={(options) =>
              updateFilters({ conditions: options.map(({ value }) => value) })
            }
            placeholder={typeStrings.toolbar.filters}
            aria-label={typeStrings.toolbar.filters}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            isClearable
          />
        </FilterContainer>
      </Toolbar>
      <Toolbar>
        <Button
          secondary
          onClick={() =>
            handleJump((type) => type.pending, typeStrings.tree.noNextPending)
          }
        >
          {typeStrings.toolbar.nextPending}
        </Button>
        <Button
          secondary
          onClick={() =>
            handleJump(
              (type) => validationErrors.has(type.id),
              typeStrings.tree.noNextError,
            )
          }
        >
          {typeStrings.toolbar.nextError}
        </Button>
        <Button secondary onClick={expandAll} disabled={!canExpandAll}>
          {typeStrings.toolbar.expandAll}
        </Button>
        <Button secondary onClick={collapseAll} disabled={!canCollapseAll}>
          {typeStrings.toolbar.collapseAll}
        </Button>
        <Button
          secondary
          disabled={parentCandidateIds.length === 0}
          onClick={() => startCreating(parentCandidateIds)}
        >
          {typeStrings.create.createParent}
        </Button>
      </Toolbar>
      <Split>
        <TreePane>
          {types !== null && !loadError && notice && (
            <Notice>
              <span>{notice.message}</span>
              {notice.moves && (
                <Button secondary onClick={handleUndo}>
                  {typeStrings.tree.undo}
                </Button>
              )}
              <IconButton
                onClick={() => setNotice(null)}
                title={typeStrings.tree.dismiss}
                aria-label={typeStrings.tree.dismiss}
              >
                <X />
              </IconButton>
            </Notice>
          )}
          {loadError ? (
            <Message>{typeStrings.tree.loadFailed(loadError)}</Message>
          ) : types === null ? (
            <Message>{typeStrings.tree.loading}</Message>
          ) : rows.length === 0 ? (
            <Message>{typeStrings.tree.noMatches}</Message>
          ) : (
            <TypesTree
              rows={rows}
              indexById={indexById}
              selectedId={selectedId}
              selectedIds={multiSelected}
              counts={counts}
              errors={validationErrors}
              language={language}
              onToggle={toggle}
              onSelect={handleRowClick}
              canMove={canMove}
              onMove={handleMove}
            />
          )}
        </TreePane>
        <DetailPane>
          {types !== null &&
            (isCreating ? (
              <NewTypeForm
                key={location.search}
                typeOptions={typeOptions}
                typeById={typeById}
                childrenMap={childrenMap}
                language={language}
                initialParentId={initialParentId}
                initialChildIds={initialChildIds}
                onCreate={handleCreate}
                onCancel={() => history.push('/admin/types')}
              />
            ) : isMultiSelect ? (
              <MultiTypePanel
                selectedIds={multiSelected}
                typeOptions={typeOptions}
                typeById={typeById}
                childrenMap={childrenMap}
                language={language}
                onUnpend={handleUnpend}
                onAssignParent={handleMove}
                onCreateParent={startCreating}
                onClear={handleDeselect}
              />
            ) : selectedType ? (
              <TypeDetails
                key={selectedType.id}
                typeId={selectedType.id}
                typeOptions={typeOptions}
                typeById={typeById}
                childrenMap={childrenMap}
                counts={counts}
                errors={validationErrors.get(selectedType.id)}
                language={language}
                onTypeChange={handleTypeChange}
                onStructureChange={handleStructureChange}
              />
            ) : (
              <TypesOverview
                types={typeList}
                typeById={typeById}
                counts={counts}
                language={language}
                onSelect={handleSelect}
                onNewType={() => startCreating([])}
              />
            ))}
        </DetailPane>
      </Split>
    </InfoPage>
  )
}

export default TypesPage
