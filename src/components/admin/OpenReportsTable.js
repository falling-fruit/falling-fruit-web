import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { resolveReportsForLocation } from '../../redux/locationSlice'
import { getOpenReports } from '../../utils/api'
import { formatISOString } from '../entry/textFormatters'
import DataTable from '../table/DataTable'
import Button from '../ui/Button'
import Checkbox from '../ui/Checkbox'
import Input from '../ui/Input'
import LocationDisplay from '../ui/LocationDisplay'
import SingleSelect from '../ui/SingleSelect'
import { adminStrings, problemTypeLabel } from './adminStrings'
import {
  buildResolutionAction,
  isResolutionActionReady,
  presetResolutionCode,
  reporterKey,
  reporterName,
  SINGLE_LOCATION_RESOLUTION_CODES,
  tristateChecked,
  uniqueLocations,
} from './resolution'
import ResolutionActionFields from './ResolutionActionFields'
import ResolutionSummary from './ResolutionSummary'

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-block-end: 1em;

  label {
    font-weight: bold;
  }
`

const SelectContainer = styled.div`
  min-width: 12em;
`

const SearchContainer = styled.div`
  flex: 1;
  min-width: 12em;
  max-width: 24em;
`

const ReportCount = styled.h2`
  margin-block: 0 0.75em;
  font-size: 1.1rem;
`

const ReportLines = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li:not(:last-child) {
    margin-block-end: 0.25em;
  }
`

const ReportId = styled.span`
  color: ${({ theme }) => theme.secondaryText};
  font-variant-numeric: tabular-nums;
`

const ProblemRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5em;
`

const ResolvePanel = styled.div`
  margin-block-start: 1.5em;
  padding: 1.5em;
  border: 1px solid ${({ theme }) => theme.secondaryBackground};
  border-radius: 0.5em;
`

const ResolveForm = styled.fieldset`
  margin: 0;
  padding: 0;
  border: none;

  &:disabled {
    opacity: 0.6;
  }
`

const ResolveHint = styled.p`
  margin-block: 0 1em;
  color: ${({ theme }) => theme.secondaryText};
`

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
`

const MultiLocationNote = styled.p`
  color: ${({ theme }) => theme.tertiaryText};
  font-style: italic;
`

const RelatedReportsNote = styled.div`
  margin-block-end: 1em;
  padding: 0.75em 1em;
  border: 1px solid ${({ theme }) => theme.orange};
  border-radius: 0.375em;
  background: ${({ theme }) => theme.secondaryBackground};

  p {
    margin: 0 0 0.5em;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li:not(:last-child) {
    margin-block-end: 0.25em;
  }
`

const AddReportButton = styled.button`
  padding: 0;
  border: none;
  background: none;
  color: ${({ theme }) => theme.orange};
  cursor: pointer;
  font: inherit;
  text-decoration: underline;
`

const noop = () => undefined

const maxCreatedAt = (reports) =>
  reports.reduce(
    (latest, report) =>
      latest === null ||
      new Date(report.created_at).getTime() > new Date(latest).getTime()
        ? report.created_at
        : latest,
    null,
  )

const minLocationId = (reports) =>
  reports.reduce(
    (min, report) =>
      report.location?.id != null && report.location.id < min
        ? report.location.id
        : min,
    Infinity,
  )

const firstReporterName = (reports) => {
  const name =
    reporterName(reports[0]?.reporter) || adminStrings.reports.anonymous
  return name.toLowerCase()
}

const dayKey = (createdAt) => {
  const date = new Date(createdAt)
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

const groupReports = (reports, groupBy) => {
  if (groupBy === 'none') {
    return reports.map((report) => ({
      key: `report-${report.id}`,
      reports: [report],
    }))
  }

  const groups = new Map()
  reports.forEach((report) => {
    const reporterBucket =
      reporterKey(report.reporter) ?? `anonymous-${report.id}`
    let bucketKey
    if (groupBy === 'location') {
      bucketKey = `location-${report.location?.id ?? `deleted-${report.id}`}`
    } else if (groupBy === 'reporter') {
      bucketKey = `reporter-${reporterBucket}`
    } else if (groupBy === 'problem') {
      bucketKey = `problem-${report.problem_code}`
    } else {
      bucketKey = `date-${dayKey(report.created_at)}`
    }
    if (!groups.has(bucketKey)) {
      groups.set(bucketKey, { key: bucketKey, reports: [] })
    }
    groups.get(bucketKey).reports.push(report)
  })

  return [...groups.values()].sort(
    (a, b) =>
      new Date(maxCreatedAt(b.reports)).getTime() -
      new Date(maxCreatedAt(a.reports)).getTime(),
  )
}

const OpenReportsTable = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const { typesAccess } = useSelector((state) => state.type)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [groupBy, setGroupBy] = useState('location')
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState({})
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [sort, setSort] = useState({ columnId: 'date', asc: false })

  const [code, setCode] = useState(null)
  const [codeManuallySet, setCodeManuallySet] = useState(false)
  const [response, setResponse] = useState('')
  const [notifyReporters, setNotifyReporters] = useState(true)
  const [photoId, setPhotoId] = useState(null)
  const [reviewIds, setReviewIds] = useState([])
  const [editAttested, setEditAttested] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    setData(await getOpenReports())
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [search, groupBy])

  const reportSearchText = (report) => {
    const location = report.location
    const typeNames = (location?.type_ids || []).map((typeId) => {
      const type = typesAccess.getType(typeId)
      const components = type?.displayComponents()
      return [components?.common, components?.scientific, components?.cultivar]
        .filter(Boolean)
        .join(' ')
    })
    return [
      report.id,
      formatISOString(report.created_at, i18n.language),
      report.location?.id,
      location?.address,
      ...typeNames,
      report.reporter?.name,
      report.reporter?.email,
      problemTypeLabel(report.problem_code),
      report.comment,
    ]
      .filter((value) => value != null && value !== '')
      .join(' ')
      .toLowerCase()
  }

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return data
    }
    return data.filter((report) => reportSearchText(report).includes(query))
  }, [data, search, typesAccess, i18n.language]) // eslint-disable-line

  const groupedData = useMemo(
    () => groupReports(filteredData, groupBy),
    [filteredData, groupBy],
  )

  const groupComparators = {
    date: (a, b) =>
      new Date(maxCreatedAt(a.reports)).getTime() -
      new Date(maxCreatedAt(b.reports)).getTime(),
    location: (a, b) => minLocationId(a.reports) - minLocationId(b.reports),
    reporter: (a, b) =>
      firstReporterName(a.reports).localeCompare(firstReporterName(b.reports)),
  }

  const sortedData = useMemo(() => {
    const comparator = groupComparators[sort.columnId]
    if (!comparator) {
      return groupedData
    }
    const sorted = [...groupedData].sort(comparator)
    return sort.asc ? sorted : sorted.reverse()
  }, [groupedData, sort]) // eslint-disable-line

  const pageCount = Math.max(1, Math.ceil(sortedData.length / perPage))
  const currentPage = Math.min(page, pageCount)
  const pagedData = useMemo(
    () => sortedData.slice((currentPage - 1) * perPage, currentPage * perPage),
    [sortedData, currentPage, perPage],
  )

  const visibleReports = useMemo(
    () => pagedData.flatMap((row) => row.reports),
    [pagedData],
  )

  const selectedReports = useMemo(
    () => data.filter((report) => selectedIds[report.id]),
    [data, selectedIds],
  )

  const selectedLocationIds = useMemo(
    () => new Set(selectedReports.map((report) => report.location?.id)),
    [selectedReports],
  )

  const relatedReports = useMemo(
    () =>
      data.filter(
        (report) =>
          report.location?.id != null &&
          selectedLocationIds.has(report.location.id) &&
          !selectedIds[report.id],
      ),
    [data, selectedLocationIds, selectedIds],
  )

  const relatedReportLocationCount = useMemo(
    () => new Set(relatedReports.map((report) => report.location?.id)).size,
    [relatedReports],
  )

  const singleLocationId =
    selectedLocationIds.size === 1 ? [...selectedLocationIds][0] : null

  const hasReporters = useMemo(
    () => selectedReports.some((report) => report.reporter?.email),
    [selectedReports],
  )

  useEffect(() => {
    if (
      singleLocationId == null &&
      SINGLE_LOCATION_RESOLUTION_CODES.includes(code)
    ) {
      setCode(null)
    }
  }, [singleLocationId, code])

  useEffect(() => {
    if (codeManuallySet) {
      return
    }
    const preset = presetResolutionCode(selectedReports, {
      singleLocation: singleLocationId != null,
    })
    setCode(preset)
  }, [selectedReports, singleLocationId, codeManuallySet])

  const handleCodeChange = (newCode) => {
    setCodeManuallySet(true)
    setCode(newCode)
  }

  const toggleReport = (reportId, checked) => {
    setSelectedIds((prev) => ({ ...prev, [reportId]: checked }))
  }

  const toggleGroup = (reports, checked) => {
    setSelectedIds((prev) => {
      const next = { ...prev }
      reports.forEach((report) => {
        next[report.id] = checked
      })
      return next
    })
  }

  const toggleAll = (checked) => {
    setSelectedIds((prev) => {
      const next = { ...prev }
      visibleReports.forEach((report) => {
        next[report.id] = checked
      })
      return next
    })
  }

  const visibleSelectedCount = visibleReports.filter(
    (report) => selectedIds[report.id],
  ).length
  const allChecked = tristateChecked(
    visibleSelectedCount,
    visibleReports.length,
  )

  const resolution = buildResolutionAction({
    code,
    response,
    photoId,
    reviewIds,
    editAttested,
  })

  const canSubmit =
    !isSubmitting &&
    selectedReports.length > 0 &&
    isResolutionActionReady(resolution)

  const resetForm = () => {
    setCode(null)
    setCodeManuallySet(false)
    setResponse('')
    setNotifyReporters(true)
    setPhotoId(null)
    setReviewIds([])
    setEditAttested(false)
    setSelectedIds({})
  }

  const handleSubmit = async () => {
    if (!canSubmit) {
      return
    }
    setIsSubmitting(true)

    const result = await dispatch(
      resolveReportsForLocation({
        locationId: singleLocationId,
        reportIds: selectedReports.map((report) => report.id),
        resolution,
        notifyReporters,
      }),
    )

    setIsSubmitting(false)

    if (resolveReportsForLocation.fulfilled.match(result)) {
      const emails = result.payload?.emails
      const message = adminStrings.resolve.resolved(emails)

      if (emails?.failed?.length) {
        toast.info(message)
      } else {
        toast.success(message)
      }

      resetForm()
      fetchData()
    } else {
      toast.error(
        adminStrings.resolve.failure(
          result.error?.message || t('error_message.unknown_error'),
        ),
      )
    }
  }

  const groupByOptions = [
    { value: 'location', label: adminStrings.reports.groupByLocation },
    { value: 'reporter', label: adminStrings.reports.groupByReporter },
    { value: 'problem', label: adminStrings.reports.groupByProblem },
    { value: 'date', label: adminStrings.reports.groupByDate },
    { value: 'none', label: adminStrings.reports.groupByNone },
  ]

  const SelectCell = ({ reports }) => {
    const checkedCount = reports.filter((r) => selectedIds[r.id]).length
    const checked = tristateChecked(checkedCount, reports.length)
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => toggleGroup(reports, e.target.checked)}
        aria-label={adminStrings.resolve.selectReports}
      />
    )
  }

  const LocationCell = ({ reports }) => (
    <ReportLines>
      {uniqueLocations(reports).map(({ key, locationId, location }) => (
        <li key={key}>
          {locationId == null ? (
            <span>{adminStrings.reports.deletedLocation}</span>
          ) : (
            <Link to={`/locations/${locationId}`}>
              {location ? (
                <LocationDisplay location={location} />
              ) : (
                `#${locationId}`
              )}
            </Link>
          )}
        </li>
      ))}
    </ReportLines>
  )

  const ReporterCell = ({ reports }) => {
    const uniqueReporters = new Map()
    reports.forEach(({ reporter }) => {
      const key = reporterKey(reporter) ?? 'anonymous'
      uniqueReporters.set(key, {
        key,
        id: reporter?.user_id ?? null,
        name: reporterName(reporter) || adminStrings.reports.anonymous,
      })
    })

    return (
      <ReportLines>
        {[...uniqueReporters.values()].map(({ key, id, name }) => (
          <li key={key}>
            {id != null ? <Link to={`/users/${id}`}>{name}</Link> : name}
          </li>
        ))}
      </ReportLines>
    )
  }

  const ProblemTypeCell = ({ reports }) => {
    const uniqueCodes = [...new Set(reports.map((r) => r.problem_code))]

    return (
      <ReportLines>
        {uniqueCodes.map((code) => (
          <li key={code}>{problemTypeLabel(code)}</li>
        ))}
      </ReportLines>
    )
  }

  const ProblemDetailsCell = ({ reports, showType }) => (
    <ReportLines>
      {reports.map((report) => (
        <li key={report.id}>
          <ProblemRow>
            <Checkbox
              id={`select-${report.id}`}
              checked={!!selectedIds[report.id]}
              onChange={(e) => toggleReport(report.id, e.target.checked)}
              aria-label={adminStrings.resolve.selectReports}
            />
            <span>
              <ReportId>#{report.id}</ReportId>
              {showType ? ` ${problemTypeLabel(report.problem_code)}` : ''}
              {report.comment ? ` — ${report.comment}` : ''}
            </span>
          </ProblemRow>
        </li>
      ))}
    </ReportLines>
  )

  const groupedByProblem = groupBy === 'problem'

  const problemColumns = groupedByProblem
    ? [
        {
          id: 'problem_type',
          name: adminStrings.reports.problemType,
          cell: (row) => <ProblemTypeCell reports={row.reports} />,
          minWidth: '10em',
        },
        {
          id: 'problem_details',
          name: adminStrings.reports.problemDetails,
          cell: (row) => (
            <ProblemDetailsCell reports={row.reports} showType={false} />
          ),
          grow: 3,
          wrap: true,
        },
      ]
    : [
        {
          id: 'problem',
          name: adminStrings.reports.problem,
          cell: (row) => <ProblemDetailsCell reports={row.reports} showType />,
          grow: 3,
          wrap: true,
        },
      ]

  const selectColumn = {
    id: 'select',
    name: (
      <Checkbox
        checked={allChecked}
        onChange={(e) => toggleAll(e.target.checked)}
        aria-label={adminStrings.resolve.selectAll}
      />
    ),
    cell: (row) => <SelectCell reports={row.reports} />,
    width: '56px',
    center: true,
    style: { paddingInline: '8px' },
  }

  const dataColumns = [
    {
      id: 'date',
      name: adminStrings.reports.date,
      selector: (row) => maxCreatedAt(row.reports),
      sortable: true,
      format: (row) =>
        formatISOString(maxCreatedAt(row.reports), i18n.language),
      minWidth: '9em',
    },
    {
      id: 'location',
      name: adminStrings.reports.location,
      cell: (row) => <LocationCell reports={row.reports} />,
      sortable: true,
      sortFunction: (a, b) =>
        minLocationId(a.reports) - minLocationId(b.reports),
      minWidth: '8em',
    },
    {
      id: 'reporter',
      name: adminStrings.reports.reporter,
      cell: (row) => <ReporterCell reports={row.reports} />,
      sortable: true,
      selector: (row) => firstReporterName(row.reports),
      minWidth: '10em',
    },
    ...problemColumns,
  ]

  const groupColumnId = { problem: 'problem_type' }[groupBy] ?? groupBy
  const groupColumn = dataColumns.find((column) => column.id === groupColumnId)
  const columns = [
    selectColumn,
    ...(groupColumn ? [groupColumn] : []),
    ...dataColumns.filter((column) => column !== groupColumn),
  ]

  return (
    <>
      {!isLoading && (
        <ReportCount>{adminStrings.reports.openCount(data.length)}</ReportCount>
      )}
      <Toolbar>
        <label htmlFor="group-by-select">{adminStrings.reports.groupBy}</label>
        <SelectContainer>
          <SingleSelect
            id="group-by-select"
            options={groupByOptions}
            value={groupBy}
            onChange={(option) => option && setGroupBy(option.value)}
          />
        </SelectContainer>
        <SearchContainer>
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={adminStrings.reports.searchPlaceholder}
            aria-label={adminStrings.reports.searchPlaceholder}
          />
        </SearchContainer>
      </Toolbar>
      <DataTable
        columns={columns}
        data={pagedData}
        keyField="key"
        sortServer
        defaultSortFieldId={sort.columnId}
        defaultSortAsc={sort.asc}
        onSort={(column, direction) =>
          setSort({ columnId: column.id, asc: direction === 'asc' })
        }
        progressPending={isLoading}
        persistTableHead
        pagination
        paginationServer
        paginationTotalRows={sortedData.length}
        paginationDefaultPage={currentPage}
        paginationPerPage={perPage}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
        paginationComponentOptions={{
          selectAllRowsItem: true,
          selectAllRowsItemText: adminStrings.reports.all,
        }}
        onChangePage={setPage}
        onChangeRowsPerPage={(newPerPage, newPage) => {
          setPerPage(newPerPage)
          setPage(newPage)
        }}
        noDataComponent={<p>{adminStrings.reports.emptyOpen}</p>}
      />

      {selectedReports.length > 0 ? (
        <ResolvePanel>
          <ResolutionSummary reports={selectedReports} />

          {relatedReports.length > 0 && (
            <RelatedReportsNote>
              <p>
                {adminStrings.resolve.relatedReportsWarning(
                  relatedReportLocationCount,
                )}
              </p>
              <ul>
                {relatedReports.map((report) => (
                  <li key={report.id}>
                    <ReportId>#{report.id}</ReportId>{' '}
                    {problemTypeLabel(report.problem_code)}
                    {report.comment ? ` — ${report.comment}` : ''}{' '}
                    <AddReportButton
                      type="button"
                      onClick={() => toggleReport(report.id, true)}
                    >
                      {adminStrings.resolve.addRelatedReport}
                    </AddReportButton>
                  </li>
                ))}
              </ul>
            </RelatedReportsNote>
          )}

          {singleLocationId == null && (
            <MultiLocationNote>
              {adminStrings.resolve.multiLocationNote}
            </MultiLocationNote>
          )}

          <ResolutionActionFields
            code={code}
            onCodeChange={handleCodeChange}
            response={response}
            onResponseChange={setResponse}
            notifyReporters={notifyReporters}
            onNotifyReportersChange={setNotifyReporters}
            photoId={photoId}
            onPhotoIdChange={setPhotoId}
            reviewIds={reviewIds}
            onReviewIdsChange={setReviewIds}
            editAttested={editAttested}
            onEditAttestedChange={setEditAttested}
            singleLocationId={singleLocationId}
            hasReporters={hasReporters}
          />

          <ButtonRow>
            <Button secondary type="button" onClick={resetForm}>
              {t('form.button.cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              {adminStrings.resolve.submit}
            </Button>
          </ButtonRow>
        </ResolvePanel>
      ) : (
        <ResolvePanel>
          <ResolveHint>{adminStrings.resolve.emptySelectionHint}</ResolveHint>
          <ResolveForm disabled>
            <ResolutionActionFields
              code={null}
              onCodeChange={noop}
              response=""
              onResponseChange={noop}
              notifyReporters={false}
              onNotifyReportersChange={noop}
              photoId={null}
              onPhotoIdChange={noop}
              reviewIds={[]}
              onReviewIdsChange={noop}
              editAttested={false}
              onEditAttestedChange={noop}
              singleLocationId={null}
              hasReporters={false}
            />

            <ButtonRow>
              <Button secondary type="button" disabled>
                {t('form.button.cancel')}
              </Button>
              <Button type="button" disabled>
                {adminStrings.resolve.submit}
              </Button>
            </ButtonRow>
          </ResolveForm>
        </ResolvePanel>
      )}
    </>
  )
}

export default OpenReportsTable
