import { X } from '@styled-icons/boxicons-regular'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { LANGUAGE_OPTIONS } from '../../i18n'
import { fetchAndLocalizeTypes } from '../../redux/typeSlice'
import { editType, getTypeCounts, getTypes } from '../../utils/api'
import { selectIsAdmin, selectIsAuthLoading } from '../../utils/isAdmin'
import LabeledCheckbox from '../filter/LabeledCheckbox'
import Button from '../ui/Button'
import { PageHeader } from '../ui/Headers'
import Input from '../ui/Input'
import { InfoPage } from '../ui/PageTemplate'
import SingleSelect from '../ui/SingleSelect'
import TypeDetails from './TypeDetails'
import TypesOverview from './TypesOverview'
import TypesTree from './TypesTree'
import { typeStrings } from './typeStrings'
import { IconButton } from './typeStyles'
import {
  ancestorIds,
  buildChildrenMap,
  buildSearchIndex,
  buildTree,
  descendantIds,
  filterTree,
  MAX_PARENT_RANK,
  NO_LANGUAGE,
  normalizeText,
  plainLabel,
  validateTypes,
} from './typeUtils'

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
  max-height: calc(100vh - 14em);
  min-height: 12em;
  overflow: auto;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.secondaryBackground};
  border-radius: 0.375em;
`

const Notice = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
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

const PendingMark = styled.span`
  margin-inline-start: 0.25em;
  color: ${({ theme }) => theme.orange};
`

const ErrorMark = styled.span`
  margin-inline-start: 0.25em;
  color: ${({ theme }) => theme.red};
`

const DetailPane = styled.div`
  flex: 1;
  min-width: 0;
`

const Message = styled.p`
  padding: 1em;
  margin: 0;
`

const WORLD_BOUNDS = '-85.0511,-180|85.0511,180'

const languageOptions = [
  { value: NO_LANGUAGE, label: typeStrings.toolbar.languageNone },
  ...LANGUAGE_OPTIONS,
]

const TypesPage = () => {
  const isAdmin = useSelector(selectIsAdmin)
  const isAuthLoading = useSelector(selectIsAuthLoading)
  const { typeId } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const { i18n } = useTranslation()
  const selectedId = typeId ? Number(typeId) : null

  const [types, setTypes] = useState(null)
  const [counts, setCounts] = useState(new Map())
  const [loadError, setLoadError] = useState(null)
  const [language, setLanguage] = useState('en')
  const [search, setSearch] = useState('')
  const [pendingOnly, setPendingOnly] = useState(false)
  const [withLocationsOnly, setWithLocationsOnly] = useState(false)
  const [withoutLocationsOnly, setWithoutLocationsOnly] = useState(false)
  const [errorsOnly, setErrorsOnly] = useState(false)
  const [expanded, setExpanded] = useState(new Set())
  const [collapsedInFilter, setCollapsedInFilter] = useState(new Set())
  const [notice, setNotice] = useState({ message: typeStrings.tree.dragHint })
  const hasChanges = useRef(false)
  const expandedForSelection = useRef(null)

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

  const typeList = useMemo(() => types ?? [], [types])
  const typeById = useMemo(
    () => new Map(typeList.map((type) => [type.id, type])),
    [typeList],
  )
  const childrenMap = useMemo(
    () => buildChildrenMap(typeList).children,
    [typeList],
  )
  const searchIndex = useMemo(() => buildSearchIndex(typeList), [typeList])
  const validationErrors = useMemo(
    () => validateTypes(typeList, typeById),
    [typeList, typeById],
  )
  const tree = useMemo(
    () => buildTree(typeList, language),
    [typeList, language],
  )

  const query = normalizeText(search.trim())
  const isFiltering =
    Boolean(query) ||
    pendingOnly ||
    withLocationsOnly ||
    withoutLocationsOnly ||
    errorsOnly

  const { nodes, expandIds } = useMemo(
    () =>
      isFiltering
        ? filterTree(
            tree,
            (type) =>
              (!query || searchIndex.get(type.id).includes(query)) &&
              (!pendingOnly || type.pending) &&
              (!withLocationsOnly || counts.get(type.id) > 0) &&
              (!withoutLocationsOnly || !(counts.get(type.id) > 0)) &&
              (!errorsOnly || validationErrors.has(type.id)),
          )
        : { nodes: tree, expandIds: new Set() },
    [
      tree,
      isFiltering,
      query,
      pendingOnly,
      withLocationsOnly,
      withoutLocationsOnly,
      errorsOnly,
      validationErrors,
      searchIndex,
      counts,
    ],
  )

  useEffect(() => {
    setCollapsedInFilter(new Set())
  }, [query, pendingOnly, withLocationsOnly, withoutLocationsOnly, errorsOnly])

  useEffect(() => {
    if (
      selectedId &&
      typeById.has(selectedId) &&
      expandedForSelection.current !== selectedId
    ) {
      expandedForSelection.current = selectedId
      setExpanded(
        (previous) =>
          new Set([...previous, ...ancestorIds(selectedId, typeById)]),
      )
    }
  }, [selectedId, typeById])

  const effectiveExpanded = useMemo(
    () =>
      isFiltering
        ? new Set([...expandIds].filter((id) => !collapsedInFilter.has(id)))
        : expanded,
    [isFiltering, expandIds, collapsedInFilter, expanded],
  )

  const toggleIn = (setter) => (id) =>
    setter((previous) => {
      const next = new Set(previous)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })

  const handleToggle = isFiltering
    ? toggleIn(setCollapsedInFilter)
    : toggleIn(setExpanded)

  const expandableIds = isFiltering ? expandIds : childrenMap.keys()
  let canExpandAll = false
  let canCollapseAll = false
  for (const id of expandableIds) {
    if (effectiveExpanded.has(id)) {
      canCollapseAll = true
    } else {
      canExpandAll = true
    }
  }

  const handleExpandAll = () => {
    if (isFiltering) {
      setCollapsedInFilter(new Set())
    } else {
      setExpanded(new Set(childrenMap.keys()))
    }
  }

  const handleCollapseAll = () => {
    if (isFiltering) {
      setCollapsedInFilter(new Set(expandIds))
    } else {
      setExpanded(new Set())
    }
  }

  const handleSelect = (id) => history.push(`/admin/types/${id}`)

  const canMove = (typeId, parentId) => {
    const moved = typeById.get(typeId)
    if (!moved || parentId === (moved.parent_id ?? null)) {
      return false
    }
    if (parentId === null) {
      return true
    }
    const target = typeById.get(parentId)
    return (
      Boolean(target) &&
      parentId !== typeId &&
      !descendantIds(typeId, childrenMap).has(parentId) &&
      (target.taxonomic_rank ?? 0) <= MAX_PARENT_RANK
    )
  }

  const applyParent = async (typeId, parentId) => {
    try {
      const updated = await editType(typeId, { parent_id: parentId })
      handleTypeChange(updated)
      if (parentId !== null) {
        setExpanded((previous) => new Set(previous).add(parentId))
      }
      return true
    } catch (error) {
      toast.error(typeStrings.details.saveFailed(error.message))
      return false
    }
  }

  const handleMove = async (typeId, parentId) => {
    const moved = typeById.get(typeId)
    const parent = parentId === null ? null : typeById.get(parentId)
    const previousParentId = moved.parent_id ?? null
    if (await applyParent(typeId, parentId)) {
      setNotice({
        typeId,
        previousParentId,
        message: typeStrings.tree.moved(
          plainLabel(moved, language),
          parent ? plainLabel(parent, language) : null,
        ),
      })
    }
  }

  const handleUndo = async () => {
    const { typeId, previousParentId } = notice
    if (await applyParent(typeId, previousParentId)) {
      setNotice(null)
    }
  }

  const handleTypeChange = (updated) => {
    hasChanges.current = true
    setTypes((previous) =>
      previous.map((type) => (type.id === updated.id ? updated : type)),
    )
  }

  const handleStructureChange = async (nextSelectedId) => {
    hasChanges.current = true
    await load()
    history.push(
      nextSelectedId ? `/admin/types/${nextSelectedId}` : '/admin/types',
    )
  }

  if (!isAdmin && !isAuthLoading) {
    return <Redirect to="/map" />
  }

  const selectedType = selectedId ? typeById.get(selectedId) : null

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
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={typeStrings.toolbar.searchPlaceholder}
          />
        </SearchContainer>
        <LabeledCheckbox
          field="types-pending-only"
          value={pendingOnly}
          onChange={setPendingOnly}
          label={
            <>
              {typeStrings.toolbar.pendingOnly}{' '}
              <PendingMark>{typeStrings.tree.pendingMarker}</PendingMark>
            </>
          }
        />
        <LabeledCheckbox
          field="types-errors-only"
          value={errorsOnly}
          onChange={setErrorsOnly}
          label={
            <>
              {typeStrings.toolbar.errorsOnly}{' '}
              <ErrorMark>{typeStrings.tree.errorMarker}</ErrorMark>
            </>
          }
        />
        <LabeledCheckbox
          field="types-with-locations-only"
          value={withLocationsOnly}
          onChange={(checked) => {
            setWithLocationsOnly(checked)
            if (checked) {
              setWithoutLocationsOnly(false)
            }
          }}
          label={typeStrings.toolbar.withLocationsOnly}
        />
        <LabeledCheckbox
          field="types-without-locations-only"
          value={withoutLocationsOnly}
          onChange={(checked) => {
            setWithoutLocationsOnly(checked)
            if (checked) {
              setWithLocationsOnly(false)
            }
          }}
          label={typeStrings.toolbar.withoutLocationsOnly}
        />
        <Button secondary onClick={handleExpandAll} disabled={!canExpandAll}>
          {typeStrings.toolbar.expandAll}
        </Button>
        <Button
          secondary
          onClick={handleCollapseAll}
          disabled={!canCollapseAll}
        >
          {typeStrings.toolbar.collapseAll}
        </Button>
      </Toolbar>
      <Split>
        <TreePane>
          {types !== null && !loadError && notice && (
            <Notice>
              <span>{notice.message}</span>
              {notice.typeId !== undefined && (
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
          ) : nodes.length === 0 ? (
            <Message>{typeStrings.tree.noMatches}</Message>
          ) : (
            <TypesTree
              nodes={nodes}
              expanded={effectiveExpanded}
              selectedId={selectedId}
              counts={counts}
              errors={validationErrors}
              language={language}
              onToggle={handleToggle}
              onSelect={handleSelect}
              canMove={canMove}
              onMove={handleMove}
            />
          )}
        </TreePane>
        <DetailPane>
          {types !== null &&
            (selectedType ? (
              <TypeDetails
                key={selectedType.id}
                typeId={selectedType.id}
                types={typeList}
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
                counts={counts}
                language={language}
                onSelect={handleSelect}
              />
            ))}
        </DetailPane>
      </Split>
    </InfoPage>
  )
}

export default TypesPage
