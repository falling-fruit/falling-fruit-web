import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getResolvedReports } from '../../utils/api'
import { formatISOString } from '../entry/textFormatters'
import DataTable from '../table/DataTable'
import Input from '../ui/Input'
import LocationDisplay from '../ui/LocationDisplay'
import SingleSelect from '../ui/SingleSelect'
import {
  adminStrings,
  PROBLEM_TYPE_LABELS,
  problemTypeLabel,
  RESOLUTION_CODE_LABELS,
  resolutionCodeLabel,
} from './adminStrings'

const DEFAULT_PAGE_SIZE = 25
const SEARCH_DEBOUNCE_MS = 300

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5em;
  margin-block-end: 1em;
`

const SearchContainer = styled.div`
  flex: 1;
  min-width: 12em;
  max-width: 24em;
`

const SelectContainer = styled.div`
  min-width: 12em;
`

const Secondary = styled.span`
  color: ${({ theme }) => theme.secondaryText};
`

const ReportId = styled.span`
  color: ${({ theme }) => theme.secondaryText};
  font-variant-numeric: tabular-nums;
`

const problemOptions = PROBLEM_TYPE_LABELS.map((label, code) => ({
  value: code,
  label,
}))

const resolutionOptions = RESOLUTION_CODE_LABELS.map((label, code) => ({
  value: code,
  label,
}))

const sortOptions = [
  { value: 'newest', label: adminStrings.reports.sortNewest },
  { value: 'oldest', label: adminStrings.reports.sortOldest },
]

const ResolvedReportsTable = () => {
  const { i18n } = useTranslation()
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [totalRows, setTotalRows] = useState(0)

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [problemCode, setProblemCode] = useState(null)
  const [resolutionCode, setResolutionCode] = useState(null)
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    const timeout = setTimeout(
      () => setSearch(searchInput.trim()),
      SEARCH_DEBOUNCE_MS,
    )
    return () => clearTimeout(timeout)
  }, [searchInput])

  const fetchPage = useCallback(
    async (pageNumber, perPage) => {
      setIsLoading(true)
      const offset = (pageNumber - 1) * perPage
      const rows = await getResolvedReports({
        q: search || undefined,
        problem_code: problemCode ?? undefined,
        resolution_code: resolutionCode ?? undefined,
        sort,
        limit: perPage,
        offset,
      })
      setData(rows)
      const loadedCount = offset + rows.length
      setTotalRows(rows.length < perPage ? loadedCount : loadedCount + perPage)
      setIsLoading(false)
    },
    [search, problemCode, resolutionCode, sort],
  )

  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      fetchPage(1, pageSize)
      return
    }
    setPage(1)
    fetchPage(1, pageSize)
  }, [fetchPage]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChangePage = (newPage) => {
    setPage(newPage)
    fetchPage(newPage, pageSize)
  }

  const handleChangeRowsPerPage = (newPerPage, newPage) => {
    setPageSize(newPerPage)
    setPage(newPage)
    fetchPage(newPage, newPerPage)
  }

  const columns = [
    {
      id: 'id',
      name: adminStrings.reports.id,
      selector: (row) => row.id,
      format: (row) => <ReportId>#{row.id}</ReportId>,
      minWidth: '5em',
      maxWidth: '7em',
    },
    {
      id: 'location',
      name: adminStrings.reports.location,
      cell: (row) =>
        row.location != null ? (
          <Link to={`/locations/${row.location.id}`}>
            <LocationDisplay location={row.location} />
          </Link>
        ) : (
          <Secondary>{adminStrings.reports.deletedLocation}</Secondary>
        ),
      minWidth: '7em',
    },
    {
      id: 'reporter',
      name: adminStrings.reports.reporter,
      cell: (row) => {
        const name = row.reporter?.name || adminStrings.reports.anonymous
        return row.reporter?.user_id != null ? (
          <Link to={`/users/${row.reporter.user_id}`}>{name}</Link>
        ) : (
          name
        )
      },
      minWidth: '9em',
    },
    {
      id: 'problem',
      name: adminStrings.reports.problem,
      cell: (row) => (
        <span>
          {problemTypeLabel(row.problem_code)}
          {row.comment ? <Secondary> — {row.comment}</Secondary> : ''}
        </span>
      ),
      grow: 2,
      wrap: true,
    },
    {
      id: 'resolution',
      name: adminStrings.reports.resolution,
      cell: (row) =>
        row.resolution ? (
          <span>
            {resolutionCodeLabel(row.resolution.code)}
            {row.resolution.response ? (
              <Secondary> — {row.resolution.response}</Secondary>
            ) : (
              ''
            )}
          </span>
        ) : null,
      grow: 2,
      wrap: true,
    },
    {
      id: 'responder',
      name: adminStrings.reports.responder,
      selector: (row) => row.resolution?.responder?.name,
      format: (row) => row.resolution?.responder?.name || '',
      minWidth: '8em',
    },
    {
      id: 'resolved_at',
      name: adminStrings.reports.resolvedOn,
      selector: (row) => row.resolved_at,
      format: (row) => formatISOString(row.resolved_at, i18n.language),
      minWidth: '9em',
    },
  ]

  return (
    <>
      <Toolbar>
        <SearchContainer>
          <Input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={adminStrings.reports.resolvedSearchPlaceholder}
            aria-label={adminStrings.reports.resolvedSearchPlaceholder}
          />
        </SearchContainer>
        <SelectContainer>
          <SingleSelect
            options={problemOptions}
            value={problemCode ?? ''}
            clearable
            onChange={(option) =>
              setProblemCode(
                option && option.value !== '' ? option.value : null,
              )
            }
            aria-label={adminStrings.reports.filterByProblem}
          />
        </SelectContainer>
        <SelectContainer>
          <SingleSelect
            options={resolutionOptions}
            value={resolutionCode ?? ''}
            clearable
            onChange={(option) =>
              setResolutionCode(
                option && option.value !== '' ? option.value : null,
              )
            }
            aria-label={adminStrings.reports.filterByResolution}
          />
        </SelectContainer>
        <SelectContainer>
          <SingleSelect
            options={sortOptions}
            value={sort}
            onChange={(option) => option && setSort(option.value)}
            aria-label={adminStrings.reports.sortBy}
          />
        </SelectContainer>
      </Toolbar>
      <DataTable
        columns={columns}
        data={data}
        keyField="id"
        progressPending={isLoading}
        persistTableHead
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        paginationDefaultPage={page}
        paginationPerPage={pageSize}
        paginationRowsPerPageOptions={[25, 50, 100]}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        noDataComponent={<p>{adminStrings.reports.emptyResolved}</p>}
      />
    </>
  )
}

export default ResolvedReportsTable
